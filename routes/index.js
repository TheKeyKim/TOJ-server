const express = require('express');
const userRounter = require('./user.js');
const solvedRouter = require('./solved.js');
const problemRouter = require('./problem.js');

const router = express.Router();


// information about user
router.use("/api/user", userRounter);
// information about what problem was solved by user
router.use("/api/solved", solvedRouter);
// api for scoring algorithm
router.use("/api/problem", problemRouter);

// TODO - problem_router

module.exports = router;