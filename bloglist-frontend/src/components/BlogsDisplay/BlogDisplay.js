import Blog from "../Blog/Blog";

const BlogsDisplay = ({ blogs }) => {
    return (
        <section>
            <h2>blogs</h2>
            {blogs.map((blog) => (
                <Blog key={blog.title} blog={blog} />
            ))}
        </section>
    );
};

export default BlogsDisplay;
