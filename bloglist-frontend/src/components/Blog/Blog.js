import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import blogService from "../../services/blogs";

const Blog = ({ blog, onBlogStateChange }) => {
    const [detailsVisible, setDetailsVisible] = useState(false);

    const handleShowDetails = (e) => {
        setDetailsVisible((prevDetailsVisible) => !prevDetailsVisible);
    };

    const handleUpdateLikesClick = async (e) => {
        try {
            const newBlogObject = {
                ...blog,
                likes: blog.likes + 1,
            };
            console.log(newBlogObject);
            const response = await blogService.update(newBlogObject);
            onBlogStateChange();
            return response;
        } catch (error) {
            console.log(error);
        }
    };

    const handleRemoveClick = async (e) => {
        if (
            window.confirm(
                `Are you sure you want to delete ${blog.title} by ${blog.author}?`
            )
        ) {
            try {
                const response = await blogService.deleteBlog(blog.id);
                onBlogStateChange();
                return response;
            } catch (error) {
                console.log(error);
            }
        }
    };

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    maxWidth: "600px",
                    justifyContent: "space-between",
                    alignContent: "center",
                    border: "2px solid green",
                    marginBottom: "10px",
                    padding: "10px",
                }}
            >
                <Typography element="span">
                    {blog.title} by {blog.author}
                </Typography>
                <Button
                    variant="outlined"
                    onClick={handleShowDetails}
                    size="small"
                >
                    {detailsVisible ? "Hide details" : "Show details"}
                </Button>
            </Box>
            <Box
                display={!detailsVisible && "none"}
                sx={{
                    maxWidth: "600px",
                    border: "2px dotted green",
                    marginTop: "-12px",
                    marginBottom: "10px",
                    padding: "10px",
                }}
            >
                <Typography>URL: {blog.url}</Typography>
                <Typography element="span">Likes: {blog.likes}</Typography>
                <Box sx={{ display: "flex", gap: "10px" }}>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={handleUpdateLikesClick}
                    >
                        Like
                    </Button>
                    {/* show only if blog added by the current user */}
                    <Button
                        variant="contained"
                        color="warning"
                        size="small"
                        onClick={handleRemoveClick}
                    >
                        Remove
                    </Button>
                </Box>
            </Box>
        </>
    );
};

export default Blog;
