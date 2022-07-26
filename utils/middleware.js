const morgan = require("morgan");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

//app.use(morgan("tiny"));
morgan.token("body", function (req, res) {
    return JSON.stringify(req.body);
});

const morganConfig = morgan(
    ":method :url :status :res[content-length] - :response-time ms :body"
);

const tokenExtractor = (request, response, next) => {
    const authorization = request.get("authorization");
    if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
        request.token = authorization.substring(7);
    } else {
        request.token = null;
    }
    next();
};

const userExtracor = async (request, response, next) => {
    console.log(request.method);
    if (request.method === "GET") {
        next();
        return;
    }
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    if (!decodedToken.id) {
        return response.status(401).json({ error: "token missing or invalid" });
    }
    const user = await User.findById(decodedToken.id);
    request.user = user || null;
    next();
};

const errorHandler = (error, req, res, next) => {
    if (error.name === "CastError") {
        return res.status(400).send({ error: "malformatted input" });
    } else if (error.name === "ValidationError") {
        return res.status(400).json({ error: error.message });
    } else if (error.name === "JsonWebTokenError") {
        return response.status(401).json({
            error: "invalid token",
        });
    } else if (error.name === "TokenExpiredError") {
        return response.status(401).json({
            error: "token expired",
        });
    }
    next(error);
};

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: "unknown endpoint" });
};

module.exports = {
    morganConfig,
    errorHandler,
    unknownEndpoint,
    tokenExtractor,
    userExtracor,
};
