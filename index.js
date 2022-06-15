const app = require("./app");
const http = require("http");
const config = require("./utils/config");
const logger = require("./utils/logger");


const cors = require("cors");
const mongoose = require("mongoose");

const server = http.createServer(app)

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number,
});

const Blog = mongoose.model("Blog", blogSchema);

const mongoUrl = config.MONGODB_URI;
mongoose.connect(mongoUrl);



app.get("/api/blogs", (request, response) => {
    Blog.find({}).then((blogs) => {
        response.json(blogs);
    });
});

app.post("/api/blogs", (request, response) => {
    const blog = new Blog(request.body);

    blog.save().then((result) => {
        response.status(201).json(result);
    });
});

const PORT = config.PORT;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
