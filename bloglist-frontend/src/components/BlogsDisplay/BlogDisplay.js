import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import Blog from "../Blog/Blog";

const BlogsDisplay = ({ blogs, onBlogStateChange }) => {
    const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes);
    // items.sort((a, b) => a.value - b.value);
    return (
        <Box sx={{ mt: 6 }}>
            <Typography variant="h2" gutterBottom>
                Blogs
            </Typography>
            {console.log(blogs)}
            {sortedBlogs.map((blog) => (
                <Blog
                    key={blog.title}
                    blog={blog}
                    onBlogStateChange={onBlogStateChange}
                />
            ))}
        </Box>
    );
};

export default BlogsDisplay;
