const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

blogsRouter.get("/", async (request, response) => {
    const blogs = await Blog.find({});
    console.log(blogs);
    response.json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
    const blog = await Blog.findById(request.params.id).populate("user", {
        username: 1,
        name: 1,
    });
    // console.log(blog);
    if (blog) {
        response.json(blog);
    } else {
        response.status(404).end();
    }
});

blogsRouter.post("/", async (request, response) => {
    // const decodedToken = jwt.verify(request.token, process.env.SECRET);
    // if (!decodedToken.id) {
    //     return response.status(401).json({ error: "token missing or invalid" });
    // }
    //const user = await User.findById(decodedToken.id);
    const user = request.user;
    // const user = await User.findById(request.body.userId);
    console.log(user);
    const blog = new Blog({ ...request.body, user: user?._id });

    if (!request.body.likes) {
        blog.likes = 0;
    }
    if (!request.body.title || !request.body.url) {
        response.status(400);
        return response.json(blog);
    }
    const savedBlog = await blog.save();
    if (user) {
        user.blogs = user.blogs.concat(savedBlog._id);
        await user.save();
    }
    response.status(201).json(blog);
});

blogsRouter.delete("/:id", async (request, response, next) => {
    // const decodedToken = jwt.verify(request.token, process.env.SECRET);
    // if (!decodedToken.id) {
    //     return response.status(401).json({ error: "token missing or invalid" });
    // }
    // const user = await User.findById(decodedToken.id);
    const user = request.user;
    // console.log("user is", user);
    const idToDelete = request.params.id;
    // console.log(request.params.id);

    try {
        const blog = await Blog.findById(idToDelete).populate("user", {
            username: 1,
            name: 1,
        });
        // console.log("blog to delete", blog);
        // console.log("user from token", user.id.toString());
        // console.log("blog user", blog?.user._id.toString());

        if (blog?.user._id.toString() === user.id.toString()) {
            await Blog.findByIdAndRemove(idToDelete);
            response.status(204).end();
        } else {
            response.status(401).json({ error: "unauthorized" });
        }
    } catch (error) {
        next(error);
    }
});

blogsRouter.put("/:id", async (request, response, next) => {
    const body = request.body;
    console.log("new likes", body.likes);

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
    };
    console.log("new blog", blog);

    try {
        const updatedBlog = await Blog.findByIdAndUpdate(
            request.params.id,
            blog,
            { new: true }
        );
        console.log("updated in backend", updatedBlog);
        response.json(updatedBlog);
    } catch (error) {
        next(error);
    }
});

module.exports = blogsRouter;
