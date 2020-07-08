const express = require('express');

const router = require("./router/PostRouter");

const server = express();

server.use(express.json());

server.use('/api/posts', router);

server.get("/", (req, res) => {
    res.status(200).json("<h1>testing tings</h1>");
});

server.listen(8000, () => console.log(`server running on port 8000`));
