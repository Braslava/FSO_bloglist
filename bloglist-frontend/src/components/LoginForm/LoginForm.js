import { useState } from "react";
import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

const LoginForm = ({ handleLogin }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    return (
        <Box
            component="form"
            sx={{
                "& > :not(style)": {
                    m: 1,
                    width: "40ch",
                    // display: "flex",
                    // flexDirection: "column",
                },
            }}
            noValidate
            autoComplete="off"
            onSubmit={(e) => {
                e.preventDefault();
                handleLogin(username, password);
            }}
        >
            <TextField
                required
                id="login-username"
                label="Username"
                type="text"
                value={username}
                name="Username"
                onChange={({ target }) => setUsername(target.value)}
            />
            <TextField
                id="login-password"
                label="Password"
                type="password"
                autoComplete="current-password"
                variant="filled"
                value={password}
                name="Password"
                onChange={({ target }) => setPassword(target.value)}
            />
            <Stack spacing={2} direction="row">
                <Button variant="contained" type="submit">
                    Log in
                </Button>
            </Stack>
        </Box>
    );
};

LoginForm.propTypes = {
    handleLogin: PropTypes.func.isRequired,
};

export default LoginForm;
