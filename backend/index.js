require('dotenv').config();
const express = require('express');
const cors = require("cors");
const helmet = require("helmet");

const { todoRouter } = require("./routes/todo");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(helmet());
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({extended: true}));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.listen(PORT, () => console.log(`Server is running at localhost:${PORT}`));
app.use("/api/todo", todoRouter);
app.use("/", (_, res) => {
    res.json({
        result: "API not found :(",
    });
});