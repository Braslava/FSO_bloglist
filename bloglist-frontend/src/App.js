import { useState, useEffect } from "react";
import LoginForm from "./components/LoginForm/LoginForm";
import BlogsDisplay from "./components/BlogsDisplay/BlogDisplay";
import Notification from "./components/Notification/Notification";
import AddBlogForm from "./components/AddBlogForm/AddBlogForm";

import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
    const [blogs, setBlogs] = useState([]);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        const loggedUserJSON =
            window.localStorage.getItem("loggedBlogListUser");
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON);
            setUser(user);
            blogService.setToken(user.token);
        }
    }, []);

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const user = await loginService.login({
                username,
                password,
            });
            window.localStorage.setItem(
                "loggedBlogListUser",
                JSON.stringify(user)
            );
            blogService.setToken(user.token);
            setUser(user);
            setUsername("");
            setPassword("");
        } catch (exception) {
            setErrorMessage("Wrong credentials");
            setTimeout(() => {
                setErrorMessage(null);
            }, 5000);
        }
    };

    const handleLogOut = () => {
        window.localStorage.removeItem("loggedBlogListUser");
        window.location.reload();
    };

    useEffect(() => {
        blogService.getAll().then((blogs) => setBlogs(blogs));
    }, []);

    return (
        <div style={{ padding: 40, fontSize: "18px" }}>
            <h1>BLOGLIST APP</h1>
            <Notification notificationText={errorMessage} />
            {!user && (
                <LoginForm
                    username={username}
                    setUsername={setUsername}
                    handleLogin={handleLogin}
                    password={password}
                    setPassword={setPassword}
                />
            )}
            {user && (
                <>
                    <p>Welcome back {user.name}</p>
                    <button onClick={handleLogOut}>Log Out</button>
                    <AddBlogForm
                        onAddNewBlog={(newBlog) =>
                            setBlogs((prevblogs) => [...prevblogs, newBlog])
                        }
                    />
                    <BlogsDisplay blogs={blogs} />
                </>
            )}
        </div>
    );
};

export default App;
