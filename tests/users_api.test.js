const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const User = require("../models/user");
const helpers = require("./test_helpers");

const api = supertest(app);

beforeEach(async () => {
    await User.deleteMany({});
    await User.insertMany(helpers.initialUsers);
});

describe("when there are initially some users saved", () => {
    test("users are returned as json", async () => {
        await api
            .get("/api/users")
            .expect(200)
            .expect("Content-Type", /application\/json/);
    });

    test("all users are returned", async () => {
        const response = await api.get("/api/users");

        expect(response.body).toHaveLength(helpers.initialUsers.length);
    });

    test("a specific user is within the returned users", async () => {
        const response = await api.get("/api/users");

        const usernames = response.body.map((r) => r.username);
        expect(usernames).toContain("TestUser2");
    });

    test("returned users contain an id property", async () => {
        const response = await api.get("/api/users");
        response.body.forEach((user) => expect(user.id).toBeDefined());
    });
});

// describe("viewing a specific blog", () => {
//     test("succeeds with a valid id", async () => {
//         const blogsAtStart = await helpers.blogsInDb();

//         const blogToView = blogsAtStart[0];
//         // console.log(blogToView);
//         // console.log("id to request", blogToView.id);

//         const fetchedBlog = await api
//             .get(`/api/blogs/${blogToView.id}`)
//             .expect(200)
//             .expect("Content-Type", /application\/json/);

//         const processedBlogToView = JSON.parse(JSON.stringify(blogToView));

//         expect(fetchedBlog.body).toEqual(processedBlogToView);
//     });

//     test("fails with statuscode 404 if blog does not exist", async () => {
//         const validNonexistingId = await helpers.nonExistingId();
//         // console.log(validNonexistingId);
//         await api.get(`/api/blogs/${validNonexistingId}`).expect(404);
//     });

//     // there is no validation for id in place yet
//     // test("fails with statuscode 400 id is invalid", async () => {
//     //     const invalidId = "5a3d5da5907008xxxxx";

//     //     await api.get(`/api/blogs/${invalidId}`).expect(400);
//     // });
// });

describe("adding a new user", () => {
    test("a valid user can be added", async () => {
        const newUser = {
            username: "Added user",
            name: "Emily Orange",
            password: "validtestpassword",
        };

        await api
            .post("/api/users")
            .send(newUser)
            .expect(201)
            .expect("Content-Type", /application\/json/);

        const response = await api.get("/api/users");
        // console.log("post response", response);
        const usernames = response.body.map((r) => r.username);
        console.log("post usernames", response.body);
        expect(response.body).toHaveLength(helpers.initialUsers.length + 1);
        expect(usernames).toContain("Added user");
    }, 10000);

    test("400 is returned if the new user misses username", async () => {
        const newUser = {
            name: "Invalid User",
            password: "testpassword",
        };

        await api.post("/api/users").send(newUser).expect(400);
    });
    test("400 is returned if the new user misses password", async () => {
        const newUser = {
            name: "Invalid User",
            username: "nopassworduser",
        };

        await api.post("/api/users").send(newUser).expect(400);
    });
    test("400 is returned if the new username is shorter than 3 characters", async () => {
        const newUser = {
            name: "Invalid User",
            username: "dd",
            password: "testpassword",
        };

        await api.post("/api/users").send(newUser).expect(400);
    });
    test("400 is returned if the new password is shorter than 3 characters", async () => {
        const newUser = {
            name: "Invalid User",
            username: "invaliduser",
            password: "dd",
        };

        await api.post("/api/users").send(newUser).expect(400);
    });
});

// describe("delete blog", () => {
//     test("succeeds with status code 204 if id exists", async () => {
//         const blogsAtStart = await helpers.blogsInDb();
//         const blogToDelete = blogsAtStart[0];
//         await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

//         const blogsAfterDeletion = await helpers.blogsInDb();
//         expect(blogsAfterDeletion).toHaveLength(
//             helpers.initialBlogs.length - 1
//         );
//         // array of blog ids after deletion should not include the deleted blog id
//         expect(blogsAfterDeletion.map((blog) => blog.id)).not.toContain(
//             blogToDelete.id
//         );
//     });

//     test("400 returned if id does not exist", async () => {
//         const nonExistingId = helpers.nonExistingId();
//         await api.delete(`/api/blogs/${nonExistingId}`).expect(400);
//     });
// });

// describe("update blog", () => {
//     test("updates likes if id exists", async () => {
//         const blogsAtStart = await helpers.blogsInDb();
//         console.log(blogsAtStart[0].likes);
//         const blogToUpdate = {
//             ...blogsAtStart[0],
//             likes: blogsAtStart[0].likes + 1,
//         };
//         console.log("Blog to update", blogToUpdate);

//         const updatedBlogResponse = await api
//             .put(`/api/blogs/${blogToUpdate.id}`)
//             .send(blogToUpdate)
//             .expect(200);

//         console.log("Updated", updatedBlogResponse.body);
//         expect(updatedBlogResponse.body).toEqual(blogToUpdate);
//     });

//     test("400 returned if id does not exist", async () => {
//         const nonExistingId = helpers.nonExistingId();
//         await api
//             .put(`/api/blogs/${nonExistingId}`, {
//                 title: "Updated Title",
//                 author: "Updated Author",
//                 url: "www.fakeupdate.com",
//             })
//             .expect(400);
//     });
// });

afterAll(() => {
    mongoose.connection.close();
});
