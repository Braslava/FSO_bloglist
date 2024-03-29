const config = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");

const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");

const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const mongoose = require("mongoose");

const mongoUrl = config.MONGODB_URI;

mongoose
    .connect(mongoUrl)
    .then(() => {
        console.log("connected to MongoDB");
    })
    .catch((error) => {
        logger.error("error connecting to MongoDB:", error.message);
    });

app.use(cors());
app.use(express.json());
app.use(middleware.morganConfig);
app.use(middleware.tokenExtractor);

app.use("/api/blogs", middleware.userExtracor, blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

app.use(middleware.unknownEndpoint);

app.use(middleware.errorHandler);

module.exports = app;
