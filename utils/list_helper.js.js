const _ = require("lodash");

const dummy = (blogs) => {
    return 1;
};

const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item.likes;
    };

    return blogs.reduce(reducer, 0);
};

const favouriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return null;
    }
    let mostLikedBlog = blogs[0];
    blogs.forEach((blog) => {
        if (blog.likes > mostLikedBlog.likes) {
            mostLikedBlog = blog;
            // console.log(mostLikedBlog);
        }
    });
    return mostLikedBlog;
};

// const max = data.reduce(function(prev, current) {
//   return (prev.y > current.y) ? prev : current
// })

// a function that receives an array of blogs as a parameter and returns the author who has the largest amount of blogs. 
const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return null;
    }
    // creates and object with {index: author} pairs 
    const authors = _.mapValues(blogs, "author");
    console.log(authors);
    const authorWithMostBlogs = _(authors).countBy().entries().maxBy(_.last);
    console.log(authorWithMostBlogs);

    return { author: authorWithMostBlogs[0], blogs: authorWithMostBlogs[1] };
};

// a function called mostLikes that receives an array of blogs as its parameter and returns the author, whose blog posts have the largest amount of likes. 
// If there are many top bloggers, then it is enough to show any one of them.

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return null;
    }
    // creates and object with {index: author} pairs 
    const authors = _.mapValues(blogs, "author");
    console.log(authors);
    const authorWithMostBlogs = _(authors).countBy().entries().maxBy(_.last);
    console.log(authorWithMostBlogs);

    return { author: authorWithMostBlogs[0], blogs: authorWithMostBlogs[1] };
};


module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    mostBlogs,
};
