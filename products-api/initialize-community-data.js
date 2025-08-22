// Script to initialize community data (segments, posts, etc.) directly in MongoDB
const axios = require('axios');
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Update the API URL to match the running server
const API_URL = 'http://localhost:3001';
// Add a timeout to ensure API requests don't fail immediately
axios.defaults.timeout = 10000;

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
    description: 'Build and grow your own business', 
    isMatched: false 
  },
  { 
    id: 'personal-branding', 
    name: 'Personal Branding', 
    description: 'Develop your professional identity', 
    isMatched: false 
  },
  { 
    id: 'legacy', 
    name: 'Legacy Building', 
    description: 'Design your lasting impact', 
    isMatched: false 
  }
];

const samplePosts = [
  {
    author: 'Sarah J.',
    role: 'Marketing Director',
    question: 'How do I overcome the feeling of being stuck in my career progression?',
    answer: "This is a common feeling when you've mastered your current role but aren't seeing clear paths forward. First, identify whether you're seeking vertical advancement (promotion) or horizontal growth (new skills).\n\nFor vertical growth, have you clearly communicated your ambitions to decision-makers? Many professionals assume their work \"speaks for itself\" when in reality, intentional career conversations are necessary.\n\nFor horizontal growth, consider cross-functional projects that let you develop adjacent skills while demonstrating value. This creates new pathways that might not be visible from your current vantage point.",
    reflection: "When I felt plateaued at my previous company, I created a \"skunkworks\" project addressing a gap our clients were experiencing. This eventually became a new service offering and created a fresh growth path.",
    answeredBy: 'Dr. Michael Chen',
    answererRole: 'Career Psychologist & Executive Coach',
    likes: 47,
    bookmarks: 18,
    comments: 0,
    segmentId: 'career-plateau',
    isAnonymous: false,
    isAnswered: true
  },
  {
    author: 'Anonymous',
    question: "I feel like I'm at the ceiling of my current role, but I'm not sure if I'm ready for management. What are my options?",
    answer: "This crossroads is actually an opportunity to design your ideal next chapter. The traditional individual contributor → manager path isn't the only route to growth.\n\nConsider the expert path (deepening your technical or domain expertise to become a thought leader), the mentor path (coaching others while staying in your role), or the innovator path (solving new business problems using your specialized knowledge).\n\nMany organizations now recognize these alternative advancement tracks, but you may need to advocate for creating such a position if it doesn't exist yet.",
    answeredBy: 'Elena Rodriguez',
    answererRole: 'Organizational Development Consultant',
    likes: 36,
    bookmarks: 24,
    comments: 0,
    segmentId: 'career-plateau',
    isAnonymous: true,
    isAnswered: true
  },
  {
    author: 'Marcus T.',
    role: 'Software Engineer',
    question: "How can I deal with stress and prevent burnout when working on tight deadlines?",
    answer: "Burnout occurs when we experience prolonged periods of stress without recovery. The key is to integrate small recovery periods throughout your workflow.\n\nStart by using time-blocking techniques like Pomodoro (25 minutes focused work, 5 minutes rest) to create mental breaks. During high-intensity project phases, protect your physiological baseline: prioritize sleep quality, maintain physical movement, and stabilize blood sugar with regular, nutritious meals.\n\nMost importantly, communicate boundaries early. Frame them as methods to maintain your peak performance rather than limitations.",
    answeredBy: 'Dr. Jessica Lin',
    answererRole: 'Occupational Health Psychologist',
    likes: 52,
    bookmarks: 31,
    comments: 0,
    segmentId: 'burnout',
    isAnonymous: false,
    isAnswered: true
  },
  {
    author: 'Ryan K.',
    role: 'Team Lead',
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
    role: 'Product Manager',
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
    author: 'Christina Lee',
    content: 'The skunkworks project approach worked for me too! I identified a gap in our customer onboarding and created a new process that eventually became my new role.',
    postIndex: 0
  },
  {
    author: 'David Rodriguez',
    content: 'I chose the expert path over management and it was the best decision for me. I get to solve complex problems without the people management aspects I wasn\'t excited about.',
    postIndex: 1
  }
];

// Initialize data
async function initializeCommunityData() {
  try {
    console.log('🚀 Starting community data initialization...');
      // Check if API is running
    try {
      await axios.get('http://localhost:3001/health');
      console.log('✅ API is running');
    } catch (error) {
      console.error('❌ API is not running. Please make sure the API server is running on port 3001.');
      console.error('Error details:', error.message);
      process.exit(1);
    }

    // Add segments
    console.log('📊 Adding community segments...');    const segmentPromises = communitySegments.map(async (segment) => {
      try {
        await axios.post(`${API_URL}/api/community/segments`, segment);
        return { success: true, id: segment.id };
      } catch (error) {
        if (error.response && error.response.status === 400) {
          console.log(`  - Segment ${segment.id} already exists`);
          return { success: false, id: segment.id, reason: 'already exists' };
        }
        throw error;
      }
    });
    
    await Promise.all(segmentPromises);
    console.log('✅ Community segments added successfully');
    
    // Add posts
    console.log('📝 Adding sample posts...');
    const postResults = [];
      for (const post of samplePosts) {
      try {
        const response = await axios.post(`${API_URL}/api/community/posts`, post);
        postResults.push({ id: response.data.data._id, segmentId: post.segmentId });
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
        await axios.post(`${API_URL}/api/community/posts/${postId}/comments`, {
          author: comment.author,
          content: comment.content,
          isAnonymous: false
        });
        console.log(`  - Added comment by ${comment.author}`);
      } catch (error) {
        console.error(`❌ Failed to add comment by ${comment.author}`, error.message);
      }
    }
    
    console.log('✅ Community data initialization complete!');
    console.log('\n🎉 You can now visit http://localhost:3000/grow-with-community to see the community page');
    
  } catch (error) {
    console.error('❌ Error initializing community data:', error.message);
    process.exit(1);
  }
}

initializeCommunityData();
