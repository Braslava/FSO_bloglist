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
            console.log(mostLikedBlog);
        }
    });
    return mostLikedBlog;
};

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
};
