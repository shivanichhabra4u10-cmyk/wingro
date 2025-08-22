"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const community_controller_1 = require("../controllers/community.controller");
const auth_1 = require("../middleware/auth");
const roleRequired_1 = require("../middleware/roleRequired");
const router = (0, express_1.Router)();
const communityController = new community_controller_1.CommunityController();
// Log request information for debugging
router.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] Community API Request: ${req.method} ${req.originalUrl}`);
    next();
});
// Public routes
// GET - get all segments
router.get('/segments', communityController.getSegments);
// GET - get segment by ID
router.get('/segments/:id', communityController.getSegmentById);
// GET - get all posts or filtered by segment
router.get('/posts', communityController.getPosts);
// GET - get post by ID
router.get('/posts/:id', communityController.getPostById);
// GET - get comments for a post
router.get('/posts/:id/comments', communityController.getComments);
// Protected routes (require authentication)
// POST - create new segment
router.post('/segments', auth_1.validateJWT, communityController.createSegment);
// PUT - update segment
router.put('/segments/:id', auth_1.validateJWT, communityController.updateSegment);
// DELETE - delete segment
router.delete('/segments/:id', auth_1.validateJWT, communityController.deleteSegment);
// POST - create new post
router.post('/posts', auth_1.validateJWT, communityController.createPost);
// PUT - update post
router.put('/posts/:id', auth_1.validateJWT, communityController.updatePost);
// DELETE - delete post
router.delete('/posts/:id', auth_1.validateJWT, communityController.deletePost);
// POST - like a post
router.post('/posts/:id/like', communityController.likePost);
// POST - bookmark a post
router.post('/posts/:id/bookmark', communityController.bookmarkPost);
// POST - add comment to post (coach, admin, user)
router.post('/posts/:id/comments', auth_1.validateJWT, (0, roleRequired_1.roleRequired)(['coach', 'admin', 'user']), communityController.addComment);
// POST - like a comment
router.post('/posts/:id/comments/:commentId/like', communityController.likeComment);
// DELETE - delete comment
router.delete('/posts/:id/comments/:commentId', auth_1.validateJWT, communityController.deleteComment);
// POST - reply to a comment (coach, admin)
router.post('/posts/:id/comments/:commentId/replies', auth_1.validateJWT, (0, roleRequired_1.roleRequired)(['coach', 'admin']), communityController.replyToComment);
exports.default = router;
