import { Request, Response } from 'express';
import { CommunitySegmentModel } from '../models/communitySegment.model';
import { CommunityPostModel } from '../models/communityPost.model';
import { CommentModel } from '../models/comment.model';
import mongoose from 'mongoose';

export class CommunityController {
  // Segments
  async getSegments(req: Request, res: Response): Promise<void> {
    try {
      const segments = await CommunitySegmentModel.find({ isActive: true });
      
      res.status(200).json({
        success: true,
        count: segments.length,
        data: segments
      });
    } catch (error) {
      console.error('Error fetching community segments:', error);
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
  
  async getSegmentById(req: Request, res: Response): Promise<void> {
    try {
      const segment = await CommunitySegmentModel.findById(req.params.id);
      
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
    } catch (error) {
      console.error(`Error fetching segment ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
  
  async createSegment(req: Request, res: Response): Promise<void> {
    try {
      const segment = await CommunitySegmentModel.create(req.body);
      
      res.status(201).json({
        success: true,
        data: segment
      });
    } catch (error) {
      console.error('Error creating segment:', error);
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
  
  async updateSegment(req: Request, res: Response): Promise<void> {
    try {
      const segment = await CommunitySegmentModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      
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
    } catch (error) {
      console.error(`Error updating segment ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
  
  async deleteSegment(req: Request, res: Response): Promise<void> {
    try {
      const segment = await CommunitySegmentModel.findByIdAndUpdate(
        req.params.id,
        { isActive: false },
        { new: true }
      );
      
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
    } catch (error) {
      console.error(`Error deleting segment ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
  
  // Posts
  async getPosts(req: Request, res: Response): Promise<void> {
    try {
      const filter: any = { isActive: true };
      
      // Filter by segment if provided
      if (req.query.segmentId) {
        filter.segmentId = req.query.segmentId;
      }
      
      // Filter by answered status if provided
      if (req.query.answered !== undefined) {
        filter.isAnswered = req.query.answered === 'true';
      }
      
      let query = CommunityPostModel.find(filter);
      
      // Apply sorting if provided
      const sortParam = req.query.sort || 'newest';
      const sortOptions: Record<string, string | { [key: string]: 1 | -1 | 'asc' | 'desc' }> = {
        'newest': { createdAt: -1 },
        'oldest': { createdAt: 1 },
        'most-commented': { comments: -1 },
        'most-viewed': { views: -1 },
        'most-liked': { likes: -1 }
      };
      
      query = query.sort(sortOptions[sortParam as string] || { createdAt: -1 });
      
      // Apply limit if provided
      if (req.query.limit) {
        const limit = parseInt(req.query.limit as string);
        if (!isNaN(limit) && limit > 0) {
          query = query.limit(limit);
        }
      }
      
      const posts = await query.exec();
      
      res.status(200).json({
        success: true,
        count: posts.length,
        data: posts
      });
    } catch (error) {
      console.error('Error fetching community posts:', error);
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
  
  async getPostById(req: Request, res: Response): Promise<void> {
    try {
      const post = await CommunityPostModel.findById(req.params.id);
      
      if (!post) {
        res.status(404).json({
          success: false,
          error: 'Post not found'
        });
        return;
      }
      
      // Increment view count
      post.views += 1;
      await post.save();
      
      res.status(200).json({
        success: true,
        data: post
      });
    } catch (error) {
      console.error(`Error fetching post ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
  
  async createPost(req: Request, res: Response): Promise<void> {
    try {
      const post = await CommunityPostModel.create(req.body);
      
      res.status(201).json({
        success: true,
        data: post
      });
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
  
  async updatePost(req: Request, res: Response): Promise<void> {
    try {
      const post = await CommunityPostModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      
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
    } catch (error) {
      console.error(`Error updating post ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
  
  async deletePost(req: Request, res: Response): Promise<void> {
    try {
      const post = await CommunityPostModel.findByIdAndUpdate(
        req.params.id,
        { isActive: false },
        { new: true }
      );
      
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
    } catch (error) {
      console.error(`Error deleting post ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
  
  async likePost(req: Request, res: Response): Promise<void> {
    try {
      const post = await CommunityPostModel.findById(req.params.id);
      
      if (!post) {
        res.status(404).json({
          success: false,
          error: 'Post not found'
        });
        return;
      }
      
      post.likes += 1;
      await post.save();
      
      res.status(200).json({
        success: true,
        data: post
      });
    } catch (error) {
      console.error(`Error liking post ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
  
  async bookmarkPost(req: Request, res: Response): Promise<void> {
    try {
      const post = await CommunityPostModel.findById(req.params.id);
      
      if (!post) {
        res.status(404).json({
          success: false,
          error: 'Post not found'
        });
        return;
      }
      
      post.bookmarks += 1;
      await post.save();
      
      res.status(200).json({
        success: true,
        data: post
      });
    } catch (error) {
      console.error(`Error bookmarking post ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
  
  // Comments
  async getComments(req: Request, res: Response): Promise<void> {
    try {
      const comments = await CommentModel.find({
        postId: req.params.id,
        isActive: true
      }).sort({ createdAt: -1 });
      
      res.status(200).json({
        success: true,
        count: comments.length,
        data: comments
      });
    } catch (error) {
      console.error(`Error fetching comments for post ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
  
  async addComment(req: Request, res: Response): Promise<void> {
    try {
      const post = await CommunityPostModel.findById(req.params.id);
      
      if (!post) {
        res.status(404).json({
          success: false,
          error: 'Post not found'
        });
        return;
      }
      
      const comment = await CommentModel.create({
        postId: req.params.id,
        ...req.body
      });
      
      // Increment comment count on post
      post.comments += 1;
      await post.save();
      
      res.status(201).json({
        success: true,
        data: comment
      });
    } catch (error) {
      console.error(`Error adding comment to post ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
  
  async likeComment(req: Request, res: Response): Promise<void> {
    try {
      const comment = await CommentModel.findById(req.params.commentId);
      
      if (!comment || comment.postId.toString() !== req.params.id) {
        res.status(404).json({
          success: false,
          error: 'Comment not found'
        });
        return;
      }
      
      comment.likes += 1;
      await comment.save();
      
      res.status(200).json({
        success: true,
        data: comment
      });
    } catch (error) {
      console.error(`Error liking comment ${req.params.commentId}:`, error);
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
  
  async deleteComment(req: Request, res: Response): Promise<void> {
    try {
      const comment = await CommentModel.findOneAndUpdate(
        {
          _id: req.params.commentId,
          postId: req.params.id
        },
        { isActive: false },
        { new: true }
      );
      
      if (!comment) {
        res.status(404).json({
          success: false,
          error: 'Comment not found'
        });
        return;
      }
      
      // Decrement comment count on post
      const post = await CommunityPostModel.findById(req.params.id);
      if (post) {
        post.comments = Math.max(0, post.comments - 1);
        await post.save();
      }
      
      res.status(200).json({
        success: true,
        data: comment
      });
    } catch (error) {
      console.error(`Error deleting comment ${req.params.commentId}:`, error);
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
  
  async replyToComment(req: Request, res: Response): Promise<void> {
    try {
      // Check if the comment exists
      const parentComment = await CommentModel.findOne({
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
      const reply = await CommentModel.create({
        postId: req.params.id,
        ...req.body
      });
      
      // Increment comment count on post
      const post = await CommunityPostModel.findById(req.params.id);
      if (post) {
        post.comments += 1;
        await post.save();
      }
      
      res.status(201).json({
        success: true,
        data: reply
      });
    } catch (error) {
      console.error(`Error replying to comment ${req.params.commentId}:`, error);
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
}
