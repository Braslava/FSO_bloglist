const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");
const { nonExistingId } = require("../tests/test_helpers");

usersRouter.post("/", async (request, response) => {
    const { username, name, password } = request.body;
    if (!username || !password || password.length < 3 || username.length < 3) {
        return response.status(400).json({
            error: "username and passowrd are required and must be at least 3 characters long",
        });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return response.status(400).json({
            error: "username must be unique",
        });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
        username,
        name,
        passwordHash,
    });

    try {
        const savedUser = await user.save();
        response.status(201).json(savedUser);
    } catch (exception) {
        nonExistingId(exception);
    }
});

usersRouter.get("/", async (request, response) => {
    const users = await User.find({}).populate("blogs");
    response.json(users);
});
module.exports = usersRouter;
