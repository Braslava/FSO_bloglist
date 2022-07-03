const morgan = require("morgan");
//app.use(morgan("tiny"));
morgan.token("body", function (req, res) {
    return JSON.stringify(req.body);
});

const morganConfig = morgan(
    ":method :url :status :res[content-length] - :response-time ms :body"
);

const errorHandler = (error, req, res, next) => {
   // console.error(error.message);

    if (error.name === "CastError") {
        return res.status(400).send({ error: "malformatted input" });
    } else if (error.name === "ValidationError") {
        return res.status(400).json({ error: error.message });
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
};
