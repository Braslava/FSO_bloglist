import { useState, useEffect, useRef } from "react";
import LoginForm from "./components/LoginForm/LoginForm";
import BlogsDisplay from "./components/BlogsDisplay/BlogDisplay";
import Notification from "./components/Notification/Notification";
import AddBlogForm from "./components/AddBlogForm/AddBlogForm";
import Togglable from "./components/Togglable/Togglable";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
    const [blogs, setBlogs] = useState([]);
    const [user, setUser] = useState(null);
    const [notificationText, setNotificationText] = useState(null);

    const addBlogFormRef = useRef();
    const getBlogs = () => {
        blogService.getAll().then((blogs) => setBlogs(blogs));
    }

    useEffect(() => {
        const loggedUserJSON =
            window.localStorage.getItem("loggedBlogListUser");
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON);
            setUser(user);
            blogService.setToken(user.token);
        }
    }, []);

    useEffect(() => {
        getBlogs();
    }, []);

    const onNotificationChnage = (message) => {
        setNotificationText(message);
        setTimeout(() => {
            setNotificationText(null);
        }, 5000);
    };

    const handleLogin = async (username, password) => {
        console.log(username, password);
        try {
            const user = await loginService.login({
                username,
                password,
            });
            console.log(user);
            window.localStorage.setItem(
                "loggedBlogListUser",
                JSON.stringify(user)
            );
            blogService.setToken(user.token);
            setUser(user);
        } catch (exception) {
            onNotificationChnage("Wrong credentials");
        }
    };

    const handleLogOut = () => {
        window.localStorage.removeItem("loggedBlogListUser");
        window.location.reload();
    };

    const updateBlogs = () => {
        getBlogs();
    };


    return (
        <Box sx={{ padding: 6, fontSize: "18px" }}>
            <Typography variant="h1" gutterBottom>
                Bloglist App
            </Typography>
            <Notification notification={notificationText} />
            {!user && <LoginForm handleLogin={handleLogin} />}
            {user && (
                <>
                    <Box sx={{ mb: 6 }}>
                        <p>Welcome back {user.name}</p>
                        <Button onClick={handleLogOut} variant="contained">
                            Log Out
                        </Button>
                    </Box>
                    <Togglable buttonLabel="Add Blog" ref={addBlogFormRef}>
                        <AddBlogForm
                            onAddNewBlog={(newBlog) => {
                                addBlogFormRef.current.toggleVisibility();
                                updateBlogs();
                            }}
                            createNotification={onNotificationChnage}
                        />
                    </Togglable>
                    <BlogsDisplay
                        blogs={blogs}
                        onBlogStateChange={updateBlogs}
                    />
                </>
            )}
        </Box>
    );
};

export default App;
