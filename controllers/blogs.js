const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
    const blogs = await Blog.find({});
    // console.log(blogs);
    response.json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
    const blog = await Blog.findById(request.params.id);
    // console.log(blog);
    if (blog) {
        response.json(blog);
    } else {
        response.status(404).end();
    }
});

blogsRouter.post("/", async (request, response) => {
    const blog = new Blog(request.body);
    // console.log(request.body);
    if (!request.body.likes) {
        blog.likes = 0;
    }
    if (!request.body.title || !request.body.url) {
        response.status(400);
        return response.json(blog);
    }
    await blog.save();
    response.status(201).json(blog);
});

blogsRouter.delete("/:id", async (request, response, next) => {
    try {
        await Blog.findByIdAndRemove(request.params.id);
        response.status(204).end();
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
