import { useState } from "react";
import blogService from "../../services/blogs";

const AddBlogForm = ({onAddNewBlog}) => {
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
            onAddNewBlog();
            return response;
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <section>
            <h2>Add a new blog</h2>
            <form
                onSubmit={handleCreateBlog}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    maxWidth: "300px",
                }}
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
                <button type="submit">Add a blog</button>
            </form>
        </section>
    );
};

export default AddBlogForm;
