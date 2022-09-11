import { useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import blogService from "../../services/blogs";

const AddBlogForm = ({ onAddNewBlog, createNotification }) => {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [url, setUrl] = useState("");

    const handleCreateBlog = async (e) => {
        e.preventDefault();

        try {
            const newBlogObject = {
                title,
                author,
                url,
            };
            console.log(newBlogObject);
            const response = await blogService.create(newBlogObject);
            onAddNewBlog(newBlogObject);
            createNotification(
                `Added blog ${newBlogObject.title} by ${newBlogObject.author}`
            );
            return response;
        } catch (error) {
            console.log(error);
            createNotification(error.message);
        }
    };

    return (
        <Box
            sx={{
                "& > :not(style)": {
                    margin: "35px 0",
                },
            }}
        >
            <Typography variant="h3">Add a new blog</Typography>

            <Stack
                noValidate
                autoComplete="off"
                component="form"
                spacing={1}
                sx={{
                    "& > :not(style)": {
                        width: "35ch",
                        display: "flex",
                        flexDirection: "column",
                    },
                }}
                onSubmit={handleCreateBlog}
            >
                <label htmlFor="title">
                    Title
                    <input
                        id="title"
                        type="text"
                        value={title}
                        name="Username"
                        onChange={({ target }) => setTitle(target.value)}
                    />
                </label>
                <label htmlFor="title">
                    Author
                    <input
                        id="auhtor"
                        type="text"
                        value={author}
                        name="Author"
                        onChange={({ target }) => setAuthor(target.value)}
                    />
                </label>
                <label htmlFor="url">
                    URL
                    <input
                        id="url"
                        type="url"
                        value={url}
                        name="Url"
                        onChange={({ target }) => setUrl(target.value)}
                    />
                </label>
                <Box>
                    <Button variant="contained" type="submit" color="secondary">
                        Add a blog
                    </Button>
                </Box>
            </Stack>
        </Box>
    );
};

export default AddBlogForm;
