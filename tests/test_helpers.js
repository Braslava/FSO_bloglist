const Blog = require("../models/blog");

const initialBlogs = [
    {
        title: "First blog",
        author: "Anne Apple",
        url: "www.awesomeblog.com",
        likes: 20,
    },
    {
        title: "Second blog",
        author: "John Pear",
        url: "www.theblog.com",
        likes: 4,
    },
];

// const initialUsers = [
//     {
//         username: "TestUser1",
//         name: "TestName1",
//         blogs: [],
//         id: "62dd329f466d1471bc719a8b",
//     },
//     {
//         username: "TestUser2",
//         name: "TestName2",
//         blogs: [],
//         id: "62dd339c9b199e552c672a81",
//     },
// ];

const nonExistingId = async () => {
    const blog = new Blog({
        title: "willremovethissoon",
        author: "Vickey Smith",
        url: "www.example.com",
        likes: 34,
    });
    await blog.save();
    await blog.remove();

    return blog._id.toString();
};

const blogsInDb = async () => {
    const blogs = await Blog.find({});
    return blogs.map((blog) => blog.toJSON());
};

module.exports = {
    initialBlogs,
    // initialUsers,
    nonExistingId,
    blogsInDb,
};
