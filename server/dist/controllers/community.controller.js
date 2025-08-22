"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityController = void 0;
const communitySegment_model_1 = require("../models/communitySegment.model");
const communityPost_model_1 = require("../models/communityPost.model");
const comment_model_1 = require("../models/comment.model");
class CommunityController {
    // Segments
    getSegments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const segments = yield communitySegment_model_1.CommunitySegmentModel.find({ isActive: true });
                res.status(200).json({
                    success: true,
                    count: segments.length,
                    data: segments
                });
            }
            catch (error) {
                console.error('Error fetching community segments:', error);
                res.status(500).json({
                    success: false,
                    error: 'Server Error'
                });
            }
        });
    }
    getSegmentById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const segment = yield communitySegment_model_1.CommunitySegmentModel.findById(req.params.id);
                if (!segment) {
                    res.status(404).json({
                        success: false,
                        error: 'Segment not found'
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    data: segment
                });
            }
            catch (error) {
                console.error(`Error fetching segment ${req.params.id}:`, error);
                res.status(500).json({
                    success: false,
                    error: 'Server Error'
                });
            }
        });
    }
    createSegment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const segment = yield communitySegment_model_1.CommunitySegmentModel.create(req.body);
                res.status(201).json({
                    success: true,
                    data: segment
                });
            }
            catch (error) {
                console.error('Error creating segment:', error);
                res.status(500).json({
                    success: false,
                    error: 'Server Error'
                });
            }
        });
    }
    updateSegment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const segment = yield communitySegment_model_1.CommunitySegmentModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
                if (!segment) {
                    res.status(404).json({
                        success: false,
                        error: 'Segment not found'
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    data: segment
                });
            }
            catch (error) {
                console.error(`Error updating segment ${req.params.id}:`, error);
                res.status(500).json({
                    success: false,
                    error: 'Server Error'
                });
            }
        });
    }
    deleteSegment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const segment = yield communitySegment_model_1.CommunitySegmentModel.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
                if (!segment) {
                    res.status(404).json({
                        success: false,
                        error: 'Segment not found'
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    data: segment
                });
            }
            catch (error) {
                console.error(`Error deleting segment ${req.params.id}:`, error);
                res.status(500).json({
                    success: false,
                    error: 'Server Error'
                });
            }
        });
    }
    // Posts
    getPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filter = { isActive: true };
                // Filter by segment if provided
                if (req.query.segmentId) {
                    filter.segmentId = req.query.segmentId;
                }
                // Filter by answered status if provided
                if (req.query.answered !== undefined) {
                    filter.isAnswered = req.query.answered === 'true';
                }
                let query = communityPost_model_1.CommunityPostModel.find(filter);
                // Apply sorting if provided
                const sortParam = req.query.sort || 'newest';
                const sortOptions = {
                    'newest': { createdAt: -1 },
                    'oldest': { createdAt: 1 },
                    'most-commented': { comments: -1 },
                    'most-viewed': { views: -1 },
                    'most-liked': { likes: -1 }
                };
                query = query.sort(sortOptions[sortParam] || { createdAt: -1 });
                // Apply limit if provided
                if (req.query.limit) {
                    const limit = parseInt(req.query.limit);
                    if (!isNaN(limit) && limit > 0) {
                        query = query.limit(limit);
                    }
                }
                const posts = yield query.exec();
                res.status(200).json({
                    success: true,
                    count: posts.length,
                    data: posts
                });
            }
            catch (error) {
                console.error('Error fetching community posts:', error);
                res.status(500).json({
                    success: false,
                    error: 'Server Error'
                });
            }
        });
    }
    getPostById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield communityPost_model_1.CommunityPostModel.findById(req.params.id);
                if (!post) {
                    res.status(404).json({
                        success: false,
                        error: 'Post not found'
                    });
                    return;
                }
                // Increment view count
                post.views += 1;
                yield post.save();
                res.status(200).json({
                    success: true,
                    data: post
                });
            }
            catch (error) {
                console.error(`Error fetching post ${req.params.id}:`, error);
                res.status(500).json({
                    success: false,
                    error: 'Server Error'
                });
            }
        });
    }
    createPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield communityPost_model_1.CommunityPostModel.create(req.body);
                res.status(201).json({
                    success: true,
                    data: post
                });
            }
            catch (error) {
                console.error('Error creating post:', error);
                res.status(500).json({
                    success: false,
                    error: 'Server Error'
                });
            }
        });
    }
    updatePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield communityPost_model_1.CommunityPostModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
                if (!post) {
                    res.status(404).json({
                        success: false,
                        error: 'Post not found'
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    data: post
                });
            }
            catch (error) {
                console.error(`Error updating post ${req.params.id}:`, error);
                res.status(500).json({
                    success: false,
                    error: 'Server Error'
                });
            }
        });
    }
    deletePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield communityPost_model_1.CommunityPostModel.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
                if (!post) {
                    res.status(404).json({
                        success: false,
                        error: 'Post not found'
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    data: post
                });
            }
            catch (error) {
                console.error(`Error deleting post ${req.params.id}:`, error);
                res.status(500).json({
                    success: false,
                    error: 'Server Error'
                });
            }
        });
    }
    likePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield communityPost_model_1.CommunityPostModel.findById(req.params.id);
                if (!post) {
                    res.status(404).json({
                        success: false,
                        error: 'Post not found'
                    });
                    return;
                }
                post.likes += 1;
                yield post.save();
                res.status(200).json({
                    success: true,
                    data: post
                });
            }
            catch (error) {
                console.error(`Error liking post ${req.params.id}:`, error);
                res.status(500).json({
                    success: false,
                    error: 'Server Error'
                });
            }
        });
    }
    bookmarkPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield communityPost_model_1.CommunityPostModel.findById(req.params.id);
                if (!post) {
                    res.status(404).json({
                        success: false,
                        error: 'Post not found'
                    });
                    return;
                }
                post.bookmarks += 1;
                yield post.save();
                res.status(200).json({
                    success: true,
                    data: post
                });
            }
            catch (error) {
                console.error(`Error bookmarking post ${req.params.id}:`, error);
                res.status(500).json({
                    success: false,
                    error: 'Server Error'
                });
            }
        });
    }
    // Comments
    getComments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comments = yield comment_model_1.CommentModel.find({
                    postId: req.params.id,
                    isActive: true
                }).sort({ createdAt: -1 });
                res.status(200).json({
                    success: true,
                    count: comments.length,
                    data: comments
                });
            }
            catch (error) {
                console.error(`Error fetching comments for post ${req.params.id}:`, error);
                res.status(500).json({
                    success: false,
                    error: 'Server Error'
                });
            }
        });
    }
    addComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield communityPost_model_1.CommunityPostModel.findById(req.params.id);
                if (!post) {
                    res.status(404).json({
                        success: false,
                        error: 'Post not found'
                    });
                    return;
                }
                const comment = yield comment_model_1.CommentModel.create(Object.assign({ postId: req.params.id }, req.body));
                // Increment comment count on post
                post.comments += 1;
                yield post.save();
                res.status(201).json({
                    success: true,
                    data: comment
                });
            }
            catch (error) {
                console.error(`Error adding comment to post ${req.params.id}:`, error);
                res.status(500).json({
                    success: false,
                    error: 'Server Error'
                });
            }
        });
    }
    likeComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comment = yield comment_model_1.CommentModel.findById(req.params.commentId);
                if (!comment || comment.postId.toString() !== req.params.id) {
                    res.status(404).json({
                        success: false,
                        error: 'Comment not found'
                    });
                    return;
                }
                comment.likes += 1;
                yield comment.save();
                res.status(200).json({
                    success: true,
                    data: comment
                });
            }
            catch (error) {
                console.error(`Error liking comment ${req.params.commentId}:`, error);
                res.status(500).json({
                    success: false,
                    error: 'Server Error'
                });
            }
        });
    }
    deleteComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comment = yield comment_model_1.CommentModel.findOneAndUpdate({
                    _id: req.params.commentId,
                    postId: req.params.id
                }, { isActive: false }, { new: true });
                if (!comment) {
                    res.status(404).json({
                        success: false,
                        error: 'Comment not found'
                    });
                    return;
                }
                // Decrement comment count on post
                const post = yield communityPost_model_1.CommunityPostModel.findById(req.params.id);
                if (post) {
                    post.comments = Math.max(0, post.comments - 1);
                    yield post.save();
                }
                res.status(200).json({
                    success: true,
                    data: comment
                });
            }
            catch (error) {
                console.error(`Error deleting comment ${req.params.commentId}:`, error);
                res.status(500).json({
                    success: false,
                    error: 'Server Error'
                });
            }
        });
    }
    replyToComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if the comment exists
                const parentComment = yield comment_model_1.CommentModel.findOne({
                    _id: req.params.commentId,
                    postId: req.params.id
                });
                if (!parentComment) {
                    res.status(404).json({
                        success: false,
                        error: 'Parent comment not found'
                    });
                    return;
                }
                // Create the reply as a new comment
                const reply = yield comment_model_1.CommentModel.create(Object.assign({ postId: req.params.id }, req.body));
                // Increment comment count on post
                const post = yield communityPost_model_1.CommunityPostModel.findById(req.params.id);
                if (post) {
                    post.comments += 1;
                    yield post.save();
                }
                res.status(201).json({
                    success: true,
                    data: reply
                });
            }
            catch (error) {
                console.error(`Error replying to comment ${req.params.commentId}:`, error);
                res.status(500).json({
                    success: false,
                    error: 'Server Error'
                });
            }
        });
    }
}
exports.CommunityController = CommunityController;
