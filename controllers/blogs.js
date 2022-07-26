const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
    const blogs = await Blog.find({});
    response.json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
    const blog = await Blog.findById(request.params.id).populate("user", {
        username: 1,
        name: 1,
    });
    if (blog) {
        response.json(blog);
    } else {
        response.status(404).end();
    }
});

blogsRouter.post("/", async (request, response) => {
    const user = request.user;
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
    const user = request.user;
    const idToDelete = request.params.id;

    try {
        const blog = await Blog.findById(idToDelete).populate("user", {
            username: 1,
            name: 1,
        });
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
