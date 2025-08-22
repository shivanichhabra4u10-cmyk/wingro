import { Router } from 'express';
import { CommunityController } from '../controllers/community.controller';
import { validateJWT } from '../middleware/auth';
import { roleRequired } from '../middleware/roleRequired';

const router = Router();
const communityController = new CommunityController();

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
router.post('/segments', validateJWT, communityController.createSegment);

// PUT - update segment
router.put('/segments/:id', validateJWT, communityController.updateSegment);

// DELETE - delete segment
router.delete('/segments/:id', validateJWT, communityController.deleteSegment);

// POST - create new post
router.post('/posts', validateJWT, communityController.createPost);

// PUT - update post
router.put('/posts/:id', validateJWT, communityController.updatePost);

// DELETE - delete post
router.delete('/posts/:id', validateJWT, communityController.deletePost);

// POST - like a post
router.post('/posts/:id/like', communityController.likePost);

// POST - bookmark a post
router.post('/posts/:id/bookmark', communityController.bookmarkPost);

// POST - add comment to post (coach, admin, user)
router.post('/posts/:id/comments', validateJWT, roleRequired(['coach', 'admin', 'user']), communityController.addComment);

// POST - like a comment
router.post('/posts/:id/comments/:commentId/like', communityController.likeComment);

// DELETE - delete comment
router.delete('/posts/:id/comments/:commentId', validateJWT, communityController.deleteComment);

// POST - reply to a comment (coach, admin)
router.post('/posts/:id/comments/:commentId/replies', validateJWT, roleRequired(['coach', 'admin']), communityController.replyToComment);

export default router;
