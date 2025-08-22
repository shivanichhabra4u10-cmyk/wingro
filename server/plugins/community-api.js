/**
 * Community API Module
 * 
 * This module adds all necessary community-related endpoints to an Express application,
 * including proper MongoDB integration and route handlers for all required endpoints:
 * - /api/community/segments
 * - /emergency/community/segments
 * - /community/segments
 * - /api/community/posts
 * - /emergency/community/posts
 * - /community/posts
 */

const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Define schemas - use existing models if available
const CommunityPostSchema = new mongoose.Schema({
  author: { type: String, required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId },
  role: { type: String },
  question: { type: String, required: true },
  details: { type: String },
  segmentId: { type: String, required: true },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  bookmarks: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  isAnonymous: { type: Boolean, default: false },
  isAnswered: { type: Boolean, default: false },
  answer: { type: String },
  answeredBy: { type: String },
  answererRole: { type: String },
  answererCoachId: { type: mongoose.Schema.Types.ObjectId },
  reflection: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const SegmentSchema = new mongoose.Schema({
  _id: String,
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: String,
  color: String,
  postCount: { type: Number, default: 0 }
});

const CommentSchema = new mongoose.Schema({
  postId: { type: String, required: true },
  author: { type: String, required: true },
  content: { type: String, required: true },
  isAnonymous: { type: Boolean, default: false },
  likes: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Sample data for fallback
const segments = [
  {
    _id: "career-plateau",
    name: "Career Plateau",
    description: "Discussions and advice for professionals feeling stuck in their career growth.",
    icon: "chart-line-stagnant",
    color: "#e57373",
    postCount: 25
  },
  {
    _id: "career-change",
    name: "Career Change",
    description: "Support and guidance for those looking to pivot to a new career path.",
    icon: "refresh-circle", 
    color: "#64b5f6",
    postCount: 18
  },
  {
    _id: "skill-development",
    name: "Skill Development",
    description: "Resources and discussions on acquiring new skills and competencies.",
    icon: "school",
    color: "#81c784",
    postCount: 30
  },
  {
    _id: "work-life-balance",
    name: "Work-Life Balance",
    description: "Strategies for maintaining a healthy balance between professional and personal life.",
    icon: "balance-scale",
    color: "#ffb74d",
    postCount: 22
  }
];

const posts = [
  {
    _id: "post1",
    segmentId: "career-plateau",
    question: "How do I overcome feeling stuck in my current role?",
    details: "I've been in the same position for 3 years with no promotion in sight. What strategies can help me progress?",
    author: "Alex Johnson",
    role: "Software Developer",
    isAnonymous: false,
    tags: ["promotion", "growth", "career-development"],
    views: 120,
    likes: 15,
    bookmarks: 8,
    commentCount: 7,
    createdAt: "2025-06-01T10:30:00Z",
    isAnswered: true,
    answer: "Consider having a direct conversation with your manager about your career aspirations. Create a personal development plan that outlines the skills and experiences you need for the next role. Also, look for opportunities to take on stretching assignments that showcase your abilities beyond your current role.",
    answeredBy: "Maya Rodriguez",
    answererRole: "Career Coach",
    answererCoachId: "coach1"
  },
  {
    _id: "post2",
    segmentId: "career-plateau",
    question: "Should I change companies to advance my career?",
    details: "I'm considering moving to another company to get a promotion and salary increase. Is this a good strategy?",
    author: "Taylor Smith",
    role: "Marketing Specialist",
    isAnonymous: true,
    tags: ["job-change", "promotion", "salary-negotiation"],
    views: 95,
    likes: 12,
    bookmarks: 6,
    commentCount: 5,
    createdAt: "2025-06-05T14:20:00Z",
    isAnswered: false
  },
  {
    _id: "post3",
    segmentId: "career-change",
    question: "How to transition from finance to tech?",
    details: "I have 8 years of experience in financial analysis but want to move into data science. Where should I start?",
    author: "Jordan Lee",
    role: "Financial Analyst",
    isAnonymous: false,
    tags: ["career-transition", "tech", "data-science"],
    views: 150,
    likes: 22,
    bookmarks: 18,
    commentCount: 12,
    createdAt: "2025-06-02T09:15:00Z",
    isAnswered: true,
    answer: "Start by building a foundation in programming (Python is recommended for data science) and statistics. There are many online courses that can help you learn these skills while still working your current job. Create projects that demonstrate your ability to apply data science to financial problems - this creates a natural bridge between your existing expertise and your target field.",
    answeredBy: "Chris Wong",
    answererRole: "Career Coach",
    answererCoachId: "coach3"
  }
];

// Data storage - for persistence when MongoDB isn't available
const DATA_DIR = path.join(__dirname, 'data');
const COMMUNITY_FILE = path.join(DATA_DIR, 'community-data.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize data file if it doesn't exist
if (!fs.existsSync(COMMUNITY_FILE)) {
  const initialData = {
    segments: segments,
    posts: posts
  };
  fs.writeFileSync(COMMUNITY_FILE, JSON.stringify(initialData, null, 2));
}

// Helper functions for file-based data
const readCommunityData = () => {
  try {
    const data = fs.readFileSync(COMMUNITY_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading community data:', error);
    return { segments: [], posts: [] };
  }
};

const writeCommunityData = (data) => {
  try {
    fs.writeFileSync(COMMUNITY_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing community data:', error);
    return false;
  }
};

/**
 * Adds community API routes to an Express application
 * @param {Express} app - The Express application
 */
module.exports = function(app) {
  console.log('Setting up community API routes...');
  
  // Create models if they don't exist
  let CommunityPost, Segment, Comment;
  
  try {
    CommunityPost = mongoose.model('CommunityPost');
  } catch (e) {
    CommunityPost = mongoose.model('CommunityPost', CommunityPostSchema);
  }
  
  try {
    Segment = mongoose.model('Segment');
  } catch (e) {
    Segment = mongoose.model('Segment', SegmentSchema);
  }
  
  try {
    Comment = mongoose.model('Comment');
  } catch (e) {
    Comment = mongoose.model('Comment', CommentSchema);
  }
  
  // Initialize segments in MongoDB if connected
  const initializeSegments = async () => {
    if (mongoose.connection.readyState === 1) {
      try {
        const count = await Segment.countDocuments();
        if (count === 0) {
          console.log('No segments found in database, initializing with sample data');
          await Segment.insertMany(segments);
          console.log('Sample segments initialized in database');
        }
      } catch (err) {
        console.error('Error initializing segments:', err);
      }
    }
  };
  
  // Initialize data if MongoDB is connected
  initializeSegments();

  // Helper function to get segments from DB or file
  const getSegments = async () => {
    try {
      if (mongoose.connection.readyState === 1) {
        const dbSegments = await Segment.find({});
        if (dbSegments && dbSegments.length > 0) {
          return {
            success: true,
            source: 'mongodb',
            count: dbSegments.length,
            data: dbSegments
          };
        }
      }
      
      const fileData = readCommunityData();
      return {
        success: true,
        source: 'file',
        count: fileData.segments.length,
        data: fileData.segments
      };
    } catch (error) {
      console.error('Error getting segments:', error);
      const fileData = readCommunityData();
      return {
        success: true,
        source: 'file-fallback',
        count: fileData.segments.length,
        data: fileData.segments
      };
    }
  };
  
  // Helper function to get posts from DB or file
  const getPosts = async (filter = {}, sort = {}, limit = 10, page = 1, search = '') => {
    try {
      const skip = (page - 1) * limit;
      
      if (mongoose.connection.readyState === 1) {
        const query = { isActive: true, ...filter };
        
        // Add search functionality
        if (search) {
          query.$or = [
            { question: { $regex: search, $options: 'i' } },
            { details: { $regex: search, $options: 'i' } }
          ];
        }
        
        const [posts, total] = await Promise.all([
          CommunityPost.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean(),
          CommunityPost.countDocuments(query)
        ]);
        
        if (posts && posts.length > 0) {
          return {
            success: true,
            source: 'mongodb',
            count: posts.length,
            total: total,
            page: page,
            totalPages: Math.ceil(total / limit),
            hasMore: skip + posts.length < total,
            data: posts
          };
        }
      }
      
      // Fall back to file-based data
      let fileData = readCommunityData();
      let filteredPosts = fileData.posts;
      
      // Apply filters
      if (filter.segmentId) {
        filteredPosts = filteredPosts.filter(p => p.segmentId === filter.segmentId);
      }
      
      if (filter.isAnswered !== undefined) {
        filteredPosts = filteredPosts.filter(p => p.isAnswered === filter.isAnswered);
      }
      
      // Apply search
      if (search) {
        const searchLower = search.toLowerCase();
        filteredPosts = filteredPosts.filter(p => 
          p.question.toLowerCase().includes(searchLower) || 
          p.details.toLowerCase().includes(searchLower)
        );
      }
      
      // Apply sorting
      const sortField = Object.keys(sort)[0] || 'createdAt';
      const sortOrder = sort[sortField] || -1;
      filteredPosts = filteredPosts.sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        
        if (!aVal && !bVal) return 0;
        if (!aVal) return sortOrder === 1 ? -1 : 1;
        if (!bVal) return sortOrder === 1 ? 1 : -1;
        
        if (sortOrder === 1) {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
      
      // Apply pagination
      const total = filteredPosts.length;
      filteredPosts = filteredPosts.slice(skip, skip + limit);
      
      return {
        success: true,
        source: 'file',
        count: filteredPosts.length,
        total: total,
        page: page,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + filteredPosts.length < total,
        data: filteredPosts
      };
    } catch (error) {
      console.error('Error getting posts:', error);
      return {
        success: false,
        error: 'Failed to fetch posts',
        message: error.message
      };
    }
  };

  //----------------------------------------------
  // DEFINE ROUTES
  //----------------------------------------------
  
  // Segments endpoints - All variations for compatibility
  const segmentsEndpoints = [
    '/api/community/segments',
    '/community/segments',
    '/emergency/community/segments'
  ];
  
  segmentsEndpoints.forEach(endpoint => {
    app.get(endpoint, async (req, res) => {
      console.log(`[ENDPOINT] Serving segments from ${endpoint}`);
      const response = await getSegments();
      res.json(response);
    });
  });
  
  // Posts endpoints - All variations for compatibility
  const postsEndpoints = [
    '/api/community/posts',
    '/community/posts',
    '/emergency/community/posts'
  ];
  
  postsEndpoints.forEach(endpoint => {
    app.get(endpoint, async (req, res) => {
      console.log(`[ENDPOINT] Serving posts from ${endpoint}`, req.query);
      
      const segmentId = req.query.segmentId;
      const answered = req.query.answered === 'true' ? true : 
                     req.query.answered === 'false' ? false : undefined;
      const search = req.query.search || '';
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      
      // Build filter
      const filter = { isActive: true };
      if (segmentId) filter.segmentId = segmentId;
      if (answered !== undefined) filter.isAnswered = answered;
      
      // Determine sort order
      const sortParam = req.query.sort || 'newest';
      const sortOptions = {
        'newest': { createdAt: -1 },
        'oldest': { createdAt: 1 },
        'most-commented': { comments: -1 },
        'most-viewed': { views: -1 },
        'most-liked': { likes: -1 }
      };
      
      const sort = sortOptions[sortParam] || { createdAt: -1 };
      
      const response = await getPosts(filter, sort, limit, page, search);
      res.json(response);
    });
  });
  
  // Single post endpoint
  const singlePostEndpoints = [
    '/api/community/posts/:id',
    '/community/posts/:id',
    '/emergency/community/posts/:id'
  ];
  
  singlePostEndpoints.forEach(endpoint => {
    app.get(endpoint, async (req, res) => {
      const postId = req.params.id;
      console.log(`[ENDPOINT] Getting post ${postId} from ${endpoint}`);
      
      try {
        let post;
        
        if (mongoose.connection.readyState === 1) {
          post = await CommunityPost.findById(postId);
          if (post) {
            // Increment views
            post.views += 1;
            await post.save();
            
            return res.json({
              success: true,
              source: 'mongodb',
              data: post
            });
          }
        }
        
        // Fall back to file-based data
        const fileData = readCommunityData();
        post = fileData.posts.find(p => p._id === postId);
        
        if (!post) {
          return res.status(404).json({
            success: false,
            error: 'Post not found'
          });
        }
        
        // Increment views in file-based data
        post.views += 1;
        writeCommunityData(fileData);
        
        res.json({
          success: true,
          source: 'file',
          data: post
        });
      } catch (error) {
        console.error(`Error getting post ${postId}:`, error);
        res.status(500).json({
          success: false,
          error: 'Failed to fetch post',
          message: error.message
        });
      }
    });
  });
  
  // Create post endpoint
  const createPostEndpoints = [
    '/api/community/posts',
    '/community/posts',
    '/emergency/community/posts'
  ];
  
  createPostEndpoints.forEach(endpoint => {
    app.post(endpoint, async (req, res) => {
      console.log(`[ENDPOINT] Creating post from ${endpoint}`, req.body);
      
      try {
        if (mongoose.connection.readyState === 1) {
          const post = new CommunityPost({
            ...req.body,
            isActive: true
          });
          
          const savedPost = await post.save();
          
          // Update segment post count
          await Segment.findByIdAndUpdate(
            req.body.segmentId,
            { $inc: { postCount: 1 } },
            { upsert: true }
          );
          
          return res.status(201).json({
            success: true,
            source: 'mongodb',
            data: savedPost
          });
        }
        
        // Fall back to file-based data
        const fileData = readCommunityData();
        const newPost = {
          _id: `post${Date.now()}`,
          ...req.body,
          views: 0,
          likes: 0,
          bookmarks: 0,
          commentCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isActive: true
        };
        
        fileData.posts.push(newPost);
        
        // Update segment post count
        const segmentIndex = fileData.segments.findIndex(s => s._id === req.body.segmentId);
        if (segmentIndex !== -1) {
          fileData.segments[segmentIndex].postCount += 1;
        }
        
        writeCommunityData(fileData);
        
        res.status(201).json({
          success: true,
          source: 'file',
          data: newPost
        });
      } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({
          success: false,
          error: 'Failed to create post',
          message: error.message
        });
      }
    });
  });
  
  // Comments endpoints
  const commentEndpoints = [
    '/api/community/posts/:id/comments',
    '/community/posts/:id/comments',
    '/emergency/community/posts/:id/comments'
  ];
  
  commentEndpoints.forEach(endpoint => {
    // Get comments
    app.get(endpoint, async (req, res) => {
      const postId = req.params.id;
      console.log(`[ENDPOINT] Getting comments for post ${postId} from ${endpoint}`);
      
      try {
        if (mongoose.connection.readyState === 1) {
          const comments = await Comment.find({
            postId: postId,
            isActive: true
          }).sort({ createdAt: -1 });
          
          return res.json({
            success: true,
            source: 'mongodb',
            count: comments.length,
            data: comments
          });
        }
        
        // Fall back to empty comments for now
        res.json({
          success: true,
          source: 'file',
          count: 0,
          data: []
        });
      } catch (error) {
        console.error(`Error getting comments for post ${postId}:`, error);
        res.status(500).json({
          success: false,
          error: 'Failed to fetch comments',
          message: error.message
        });
      }
    });
    
    // Add comment
    app.post(endpoint, async (req, res) => {
      const postId = req.params.id;
      console.log(`[ENDPOINT] Adding comment to post ${postId} from ${endpoint}`, req.body);
      
      try {
        if (mongoose.connection.readyState === 1) {
          // Create comment
          const comment = new Comment({
            postId: postId,
            ...req.body,
            isActive: true
          });
          
          const savedComment = await comment.save();
          
          // Update post comment count
          await CommunityPost.findByIdAndUpdate(
            postId,
            { $inc: { comments: 1 } }
          );
          
          return res.status(201).json({
            success: true,
            source: 'mongodb',
            data: savedComment
          });
        }
        
        // Fall back to file-based data
        const fileData = readCommunityData();
        const newComment = {
          _id: `comment${Date.now()}`,
          postId: postId,
          ...req.body,
          likes: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isActive: true
        };
        
        // Update post comment count
        const postIndex = fileData.posts.findIndex(p => p._id === postId);
        if (postIndex !== -1) {
          fileData.posts[postIndex].commentCount = (fileData.posts[postIndex].commentCount || 0) + 1;
        }
        
        // Add comment to file data structure
        if (!fileData.comments) fileData.comments = [];
        fileData.comments.push(newComment);
        
        writeCommunityData(fileData);
        
        res.status(201).json({
          success: true,
          source: 'file',
          data: newComment
        });
      } catch (error) {
        console.error(`Error adding comment to post ${postId}:`, error);
        res.status(500).json({
          success: false,
          error: 'Failed to add comment',
          message: error.message
        });
      }
    });
  });
  
  console.log('Community API routes setup complete!');
  return {
    // Exported methods and data can be used elsewhere if needed
    getSegments,
    getPosts
  };
};
