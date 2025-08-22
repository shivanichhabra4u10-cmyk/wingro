// Script to initialize community data (segments, posts, etc.) directly in MongoDB
const mongoose = require('mongoose');
const { Schema } = mongoose;

// MongoDB connection
const MONGODB_URI = 'mongodb://localhost:27017/wingrox';

// Define schemas
const CommunitySegmentSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  isMatched: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const CommunityPostSchema = new Schema({
  segmentId: { type: String, required: true },
  question: { type: String, required: true },
  details: { type: String },
  author: { type: String, required: true },
  authorRole: { type: String, required: true },
  isAnonymous: { type: Boolean, default: false },
  tags: [String],
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  bookmarks: { type: Number, default: 0 },
  isAnswered: { type: Boolean, default: false },
  answer: { type: String },
  answeredBy: { type: String },
  answererRole: { type: String },
  answererCoachId: { type: String },
  reflection: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const CommentSchema = new Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'CommunityPost', required: true },
  author: { type: String, required: true },
  content: { type: String, required: true },
  isAnonymous: { type: Boolean, default: false },
  likes: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Create models
const CommunitySegment = mongoose.model('CommunitySegment', CommunitySegmentSchema);
const CommunityPost = mongoose.model('CommunityPost', CommunityPostSchema);
const Comment = mongoose.model('Comment', CommentSchema);

// Sample data
const communitySegments = [
  { 
    id: 'career-plateau', 
    name: 'Career Plateau & Stagnation', 
    description: 'Overcome stagnation and move forward in your career', 
    isMatched: true 
  },
  { 
    id: 'burnout', 
    name: 'Burnout Recovery', 
    description: 'Tools for emotional resilience', 
    isMatched: false 
  },
  { 
    id: 'leadership', 
    name: 'Leadership Challenges', 
    description: 'Navigate complex leadership situations', 
    isMatched: true 
  },
  { 
    id: 'work-balance', 
    name: 'Work-Life Balance', 
    description: 'Find harmony between professional and personal life', 
    isMatched: false 
  },
  { 
    id: 'career-pivot', 
    name: 'Career Pivot', 
    description: 'Successfully transition to a new career path', 
    isMatched: true 
  },
  { 
    id: 'entrepreneurship', 
    name: 'Entrepreneurship', 
    description: 'Business ventures and startup journey', 
    isMatched: false 
  }
];

const samplePosts = [
  {
    author: 'John D.',
    authorRole: 'Mid-Level Manager',
    question: "I've been in the same role for 5 years, and I feel like I'm not growing. What strategies can I use to overcome this plateau?",
    details: "I've taken on additional responsibilities, but I'm not seeing opportunities for advancement. I'm passionate about my work but feeling stuck. Any advice on how to approach this situation?",
    segmentId: 'career-plateau',
    likes: 15,
    bookmarks: 8,
    comments: 2,
    isAnonymous: false,
    isAnswered: false
  },
  {
    author: 'Sarah L.',
    authorRole: 'Senior Developer',
    question: "How do you recognize burnout before it becomes severe, and what are the first steps to recovery?",
    details: "I've been working overtime for months on a critical project, and I'm starting to feel constant fatigue. I don't want to let my team down, but I'm concerned about my mental health.",
    segmentId: 'burnout',
    likes: 27,
    bookmarks: 14,
    comments: 1,
    isAnonymous: false,
    isAnswered: true,
    answer: "Burnout often manifests in decreased productivity, feelings of cynicism about your work, and physical symptoms like headaches or sleep disturbances. The first step is to acknowledge it and speak with your manager. Setting clear boundaries between work and personal time can help. Consider taking a few days off completely disconnected from work. Long-term, you may need to negotiate workload adjustments or delegate tasks.",
    answeredBy: "Dr. Emma Chen",
    answererRole: "Organizational Psychologist"
  },
  {
    author: 'Ryan K.',
    authorRole: 'Team Lead',
    question: "I recently became a team lead but have no formal leadership training. How do I build credibility with my team?",
    segmentId: 'leadership',
    likes: 8,
    bookmarks: 3,
    comments: 0,
    isAnonymous: false,
    isAnswered: false
  },
  {
    author: 'Sophia M.',
    authorRole: 'Product Manager',
    question: "I'm interested in starting a side business while maintaining my current job. Any advice on managing both effectively?",
    segmentId: 'entrepreneurship',
    likes: 12,
    bookmarks: 7,
    comments: 0,
    isAnonymous: false,
    isAnswered: false
  }
];

const sampleComments = [
  {
    author: 'James Wilson',
    content: 'This really resonated with me. I faced a similar situation and found that directly speaking with my manager about growth opportunities opened several doors.',
    postIndex: 0
  },
  {
    author: 'Maria Rodriguez',
    content: 'Have you considered lateral moves within the company? Sometimes changing departments can provide new challenges and skills while positioning you for future promotions.',
    postIndex: 0
  },
  {
    author: 'Lisa Chang',
    content: 'I went through severe burnout last year. What helped me most was working with a therapist who specializes in workplace stress. Don\'t underestimate the importance of professional support.',
    postIndex: 1
  }
];

// Initialize community data function
async function initializeCommunityData() {
  console.log('🚀 Starting community data initialization...');
  
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`✅ Connected to MongoDB: ${MONGODB_URI}`);

    // Add segments
    console.log('📊 Adding community segments...');
    const segmentResults = [];
    
    for (const segment of communitySegments) {
      try {
        // Check if segment exists
        const existingSegment = await CommunitySegment.findOne({ id: segment.id });
        if (existingSegment) {
          console.log(`  - Segment ${segment.id} already exists`);
          segmentResults.push({ id: existingSegment._id, segmentId: segment.id });
          continue;
        }
        
        // Create segment
        const newSegment = await CommunitySegment.create(segment);
        segmentResults.push({ id: newSegment._id, segmentId: segment.id });
        console.log(`  - Added segment: "${segment.name}"`);
      } catch (error) {
        console.error(`❌ Failed to add segment: ${segment.name}`, error.message);
      }
    }
    
    console.log('✅ Community segments added successfully');
    
    // Add posts
    console.log('📝 Adding sample posts...');
    const postResults = [];
    
    for (const post of samplePosts) {
      try {
        // Check if post exists (by question)
        const existingPost = await CommunityPost.findOne({ 
          question: post.question, 
          segmentId: post.segmentId 
        });
        
        if (existingPost) {
          console.log(`  - Post "${post.question.substring(0, 30)}..." already exists`);
          postResults.push({ id: existingPost._id, segmentId: post.segmentId });
          continue;
        }
        
        // Create post
        const newPost = await CommunityPost.create(post);
        postResults.push({ id: newPost._id, segmentId: post.segmentId });
        console.log(`  - Added post: "${post.question.substring(0, 30)}..."`);
      } catch (error) {
        console.error(`❌ Failed to add post: ${post.question.substring(0, 30)}...`, error.message);
      }
    }
    
    // Add comments
    console.log('💬 Adding sample comments...');
    for (let i = 0; i < sampleComments.length; i++) {
      const comment = sampleComments[i];
      const postId = postResults[comment.postIndex].id;
      
      try {
        // Check if comment exists
        const existingComment = await Comment.findOne({
          postId,
          content: comment.content,
          author: comment.author
        });
        
        if (existingComment) {
          console.log(`  - Comment by ${comment.author} already exists`);
          continue;
        }
        
        // Create comment
        await Comment.create({
          postId,
          author: comment.author,
          content: comment.content,
          isAnonymous: false
        });
        
        // Update comment count on post
        await CommunityPost.findByIdAndUpdate(postId, { $inc: { comments: 1 } });
        
        console.log(`  - Added comment by ${comment.author}`);
      } catch (error) {
        console.error(`❌ Failed to add comment by ${comment.author}`, error.message);
      }
    }
    
    console.log('✅ Community data initialization complete!');
    console.log('\n🎉 You can now visit http://localhost:3000/grow-with-community to see the community page');
    
    // Close the MongoDB connection
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('❌ Error initializing community data:', error.message);
    process.exit(1);
  }
}

initializeCommunityData();
