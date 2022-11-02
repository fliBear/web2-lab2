const express = require("express");
const injectionRouter = require("./routes/sql-injection.js");
const csrfRouter = require("./routes/csrf.js");
const cors = require("cors");
var cookieParser = require("cookie-parser");
const session = require("express-session");
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(
    cors({
        origin: [process.env.CLIENT],
        credentials: true,
        exposedHeaders: ["set-cookie"],
    })
);
app.use(cookieParser());
app.use(
    session({
        secret: "some-secret",
        cookie: {
            maxAge: 600000,
            secure: false,
        },
        saveUninitialized: true,
        resave: false,
    })
);

app.use("/injection", injectionRouter);
app.use("/csrf", csrfRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`);
});
