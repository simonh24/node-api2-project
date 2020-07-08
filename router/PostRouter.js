const express = require('express');

const Posts = require('../data/db.js');

const router = express.Router();

router.post("/", (req, res) => {
    if (!req.body.title || !req.body.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
    } else {
        Posts.insert(req.body)
            .then(data => {
                // res.status(201).json({...req.body, id: data.id});
                Posts.findById(data.id)
                    .then(p => {
                        res.status(201).json(p);
                    })
            })
            .catch(data => {
                res.status(500).json({ error: "There was an error while saving the post to the database" });
            })
    }
});

router.post("/:id/comments", (req, res) => {
    if (!req.body.text) {
        res.status(400).json({ errorMessage: "Please provide text for the comment." });
    } else {
        Posts.findById(req.params.id)
            .then(data => {
                if (data.length === 0) {
                    res.status(404).json({ message: "The post with the specified ID does not exist." });
                } else {
                    Posts.insertComment({ ...req.body, post_id: req.params.id })
                        .then(com => {
                            res.status(201).json({ ...req.body, post_id: req.params.id });
                        })
                        .catch(com => {
                            console.log("hi");
                            res.status(500).json({ error: "There was an error while saving the comment to the database." });
                        })
                }
            })
            .catch(data => {
                res.status(500).json({ error: "There was an error while saving the comment to the database." });
            })
    }
});

router.get("/", (req, res) => {
    Posts.find()
        .then(data => res.status(200).json(data))
        .catch(data => res.status(500).json({ error: "The posts information could not be retrieved." }))
});

router.get("/:id", (req, res) => {
    Posts.findById(req.params.id)
        .then(data => {
            if (data.length === 0) {
                res.status(404).json({ message: "The post with the specified ID does not exist. " });
            } else {
                res.status(200).json(data);
            }
        })
        .catch(data => res.status(500).json({ error: "The post information could not be retrieved." }))
});

router.get("/:id/comments", (req, res) => {
    Posts.findById(req.params.id)
        .then(data => {
            if (data.length === 0) {
                res.status(404).json({ error: "The post with the specified ID does not exist." });
            } else {
                Posts.findPostComments(req.params.id)
                    .then(com => {
                        if (com.length === 0) {
                            res.status(404).json({ message: "The comments of this post with the specified ID does not exist." });
                        } else {
                            res.status(200).json(com);
                        }
                    })
                    .catch(err => {
                        res.status(500).json({ error: "The comments information could not be retrieved." });
                    })
            }
        })
        .catch(data => {
            res.status(500).json({ error: "The post information could not be retrieved." });
        })
});

router.delete("/:id", (req, res) => {
    Posts.findById(req.params.id)
        .then(data => {
            if (data.length === 0) {
                res.status(404).json({ message: "The post with the specified ID does not exist." });
            } else {
                Posts.remove(req.params.id)
                    .then(rem => {
                        res.status(200).json(`Post with the id ${req.params.id} has been removed.`);
                    })
                    .catch(data => {
                        res.status(500).json({ error: "The post could not be removed" });
                    })
            }
        })
        .catch(data => {
            res.status(500).json({ error: "The post information could not be retrieved." });
        })
});

router.put("/:id", (req, res) => {
    if (!req.body.title || !req.body.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
    } else {
        Posts.findById(req.params.id)
            .then(data => {
                if (data.length === 0) {
                    res.status(404).json({ message: "The post with the specified ID does not exist." });
                } else {
                    Posts.update(req.params.id, req.body)
                        .then(post => {
                            // res.status(201).json({...req.body, id: data.id});
                            Posts.findById(req.params.id)
                                .then(p => {
                                    res.status(201).json(p);
                                })
                        })
                        .catch(upd => {
                            res.status(500).json({ error: "The post information could not be modified." })
                        })
                }
            })
            .catch(data => {
                res.status(500).json({ error: "The post information could not be retrieved." });
            })
    }
});

module.exports = router;