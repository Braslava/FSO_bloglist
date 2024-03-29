const mongoose = require("mongoose");
const supertest = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../app");
const User = require("../models/user");
const helpers = require("./test_helpers");

const api = supertest(app);

beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash1 = await bcrypt.hash("sekret", 10);
    const user1 = new User({ username: "testuser1", passwordHash1 });
    await user1.save();
    const passwordHash2 = await bcrypt.hash("sekret", 10);
    const user2 = new User({ username: "testuser2", passwordHash2 });
    await user2.save();
});

const USER_COUNT = 2;

describe("when there are initially some users saved", () => {
    test("users are returned as json", async () => {
        await api
            .get("/api/users")
            .expect(200)
            .expect("Content-Type", /application\/json/);
    });

    test("all users are returned", async () => {
        const response = await api.get("/api/users");

        expect(response.body).toHaveLength(2);
    });

    test("a specific user is within the returned users", async () => {
        const response = await api.get("/api/users");

        const usernames = response.body.map((r) => r.username);
        expect(usernames).toContain("testuser1");
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
        expect(response.body).toHaveLength(USER_COUNT + 1);
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

afterAll(() => {
    mongoose.connection.close();
});
