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

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return null;
    }

    const authors = _.mapValues(blogs, "author");

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
