const mongoose = require("mongoose");
const supertest = require("supertest");
const bcrypt = require("bcrypt");

const app = require("../app");
const Blog = require("../models/blog");
const User = require("../models/user");
const helpers = require("./test_helpers");

const api = supertest(app);

beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(helpers.initialBlogs);
});

describe("when there are initially some blogs saved", () => {
    test("blogs are returned as json", async () => {
        await api
            .get("/api/blogs")
            .expect(200)
            .expect("Content-Type", /application\/json/);
    });

    test("all blogs are returned", async () => {
        const response = await api.get("/api/blogs");

        expect(response.body).toHaveLength(helpers.initialBlogs.length);
    });

    test("a specific blog is within the returned blogs", async () => {
        const response = await api.get("/api/blogs");

        const titles = response.body.map((r) => r.title);
        expect(titles).toContain("Second blog");
    });

    test("returned blogs contain an id property", async () => {
        const response = await api.get("/api/blogs");
        response.body.forEach((blog) => expect(blog.id).toBeDefined());
    });
});

describe("viewing a specific blog", () => {
    test("succeeds with a valid id", async () => {
        const blogsAtStart = await helpers.blogsInDb();

        const blogToView = blogsAtStart[0];
        // console.log(blogToView);
        // console.log("id to request", blogToView.id);

        const fetchedBlog = await api
            .get(`/api/blogs/${blogToView.id}`)
            .expect(200)
            .expect("Content-Type", /application\/json/);

        const processedBlogToView = JSON.parse(JSON.stringify(blogToView));

        expect(fetchedBlog.body).toEqual(processedBlogToView);
    });

    test("fails with statuscode 404 if blog does not exist", async () => {
        const validNonexistingId = await helpers.nonExistingId();
        // console.log(validNonexistingId);
        await api.get(`/api/blogs/${validNonexistingId}`).expect(404);
    });

    // there is no validation for id in place yet
    // test("fails with statuscode 400 id is invalid", async () => {
    //     const invalidId = "5a3d5da5907008xxxxx";

    //     await api.get(`/api/blogs/${invalidId}`).expect(400);
    // });
});

describe("adding a new blog", () => {
    let token;
    beforeEach(async () => {
        await User.deleteMany({});

        const passwordHash = await bcrypt.hash("secret", 10);
        const user = new User({ username: "root", passwordHash });

        await user.save();

        const response = await api
            .post("/api/login")
            .send({ username: "root", password: "secret" });

        token = response.body.token;
    });

    test("a valid blog can be added", async () => {
        const newBlog = {
            title: "Added blog",
            author: "Emily Orange",
            url: "www.yayblog.com",
            likes: 14,
        };

        await api
            .post("/api/blogs")
            .send(newBlog)
            .set("Authorization", `bearer ${token}`)
            .expect(201)
            .expect("Content-Type", /application\/json/);

        const response = await api.get("/api/blogs");

        const titles = response.body.map((r) => r.title);

        expect(response.body).toHaveLength(helpers.initialBlogs.length + 1);
        expect(titles).toContain("Added blog");
    }, 10000);

    test("likes default to 0 if the new blog missing likes property", async () => {
        const newBlog = {
            title: "Blog with no likes",
            author: "Author No Likes",
            url: "www.yayblog.com",
        };

        await api
            .post("/api/blogs")
            .send(newBlog)
            .set("Authorization", `bearer ${token}`)
            .expect(201)
            .expect("Content-Type", /application\/json/);

        const response = await api.get("/api/blogs");

        const addedBlog = response.body.find(
            (blog) => blog.title === newBlog.title
        );
        // console.log(addedBlog);
        expect(addedBlog.likes).toEqual(0);
    });

    test("400 is returned if the new blog misses title", async () => {
        const newBlog = {
            author: "No Title Author",
            url: "www.yayblog.com",
        };

        await api
            .post("/api/blogs")
            .send(newBlog)
            .set("Authorization", `bearer ${token}`)
            .expect(400);
    });

    test("400 is returned if the new blog misses url", async () => {
        const newBlog = {
            title: "No url",
            author: "Emily Orange",
            likes: 23,
        };

        await api
            .post("/api/blogs")
            .send(newBlog)
            .set("Authorization", `bearer ${token}`)
            .expect(400);
    });
});

describe("delete blog", () => {
    let token;
    beforeEach(async () => {
        await User.deleteMany({});

        const passwordHash = await bcrypt.hash("secret", 10);
        const user = new User({ username: "root", passwordHash });

        await user.save();

        const response = await api
            .post("/api/login")
            .send({ username: "root", password: "secret" });

        token = response.body.token;
    });

    test("succeeds with status code 204 if id exists", async () => {
        const blogsAtStart = await helpers.blogsInDb();
        const blogToDelete = blogsAtStart[0];
        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set("Authorization", `bearer ${token}`)
            .expect(204);

        const blogsAfterDeletion = await helpers.blogsInDb();
        expect(blogsAfterDeletion).toHaveLength(
            helpers.initialBlogs.length - 1
        );
        // array of blog ids after deletion should not include the deleted blog id
        expect(blogsAfterDeletion.map((blog) => blog.id)).not.toContain(
            blogToDelete.id
        );
    });

    test("400 returned if id does not exist", async () => {
        const nonExistingId = helpers.nonExistingId();
        await api
            .delete(`/api/blogs/${nonExistingId}`)
            .set("Authorization", `bearer ${token}`)
            .expect(400);
    });
});

describe("update blog", () => {
    let token;
    beforeEach(async () => {
        await User.deleteMany({});

        const passwordHash = await bcrypt.hash("secret", 10);
        const user = new User({ username: "root", passwordHash });

        await user.save();

        const response = await api
            .post("/api/login")
            .send({ username: "root", password: "secret" });

        token = response.body.token;
    });
    test("updates likes if id exists", async () => {
        const blogsAtStart = await helpers.blogsInDb();
        console.log(blogsAtStart[0].likes);
        const blogToUpdate = {
            ...blogsAtStart[0],
            likes: blogsAtStart[0].likes + 1,
        };
        console.log("Blog to update", blogToUpdate);

        const updatedBlogResponse = await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(blogToUpdate)
            .set("Authorization", `bearer ${token}`)
            .expect(200);

        console.log("Updated", updatedBlogResponse.body);
        expect(updatedBlogResponse.body).toEqual(blogToUpdate);
    });

    test("400 returned if id does not exist", async () => {
        const nonExistingId = helpers.nonExistingId();
        await api
            .put(`/api/blogs/${nonExistingId}`, {
                title: "Updated Title",
                author: "Updated Author",
                url: "www.fakeupdate.com",
            })
            .set("Authorization", `bearer ${token}`)
            .expect(400);
    });
});

// afterAll(async () => {
//     mongoose.connection.close();
// });
