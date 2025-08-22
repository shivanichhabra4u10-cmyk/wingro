// initialize-community-data.js
const axios = require('axios');
const mongoose = require('mongoose');

const apiBase = 'http://localhost:3001';
const mongoUri = 'mongodb://localhost:27017/wingrox';

// Sample community data
const sampleSegments = [
  {
    name: "Career Development",
    description: "Discuss career growth, job changes, promotions, and professional development strategies.",
    icon: "career",
    color: "#4CAF50",
    isActive: true
  },
  {
    name: "Technical Skills",
    description: "Share resources, ask questions, and discuss technical skills relevant to your field.",
    icon: "skills",
    color: "#2196F3",
    isActive: true
  },
  {
    name: "Work-Life Balance",
    description: "Strategies for maintaining a healthy balance between professional and personal life.",
    icon: "balance",
    color: "#9C27B0",
    isActive: true
  },
  {
    name: "Interview Preparation",
    description: "Tips, mock interview questions, and strategies for job interviews.",
    icon: "interview",
    color: "#FF9800",
    isActive: true
  }
];

const samplePosts = [
  {
    title: "How to approach a career change at 35?",
    content: "I'm considering a major career pivot from marketing to data science. Any advice on how to make this transition smoothly at my age without starting completely from the bottom?",
    author: "Sarah M.",
    isAnonymous: false,
    segmentId: "", // Will be filled with actual segment ID
    likes: 12,
    bookmarks: 5,
    isAnswered: false,
    isActive: true
  },
  {
    title: "Resources for learning Python programming",
    content: "Can anyone recommend some good resources for an absolute beginner to learn Python programming? I'm specifically interested in data analysis applications.",
    author: "Mark T.",
    isAnonymous: false,
    segmentId: "", // Will be filled with actual segment ID
    likes: 8,
    bookmarks: 15,
    isAnswered: true,
    answer: "For absolute beginners, I'd recommend starting with 'Python Crash Course' by Eric Matthes or the free 'Automate the Boring Stuff with Python' by Al Sweigart. Once you have the basics down, you can move on to data-specific resources like 'Python for Data Analysis' by Wes McKinney. Also, Codecademy and DataCamp have excellent interactive courses for Python with a data focus.",
    answeredBy: "Alex Johnson",
    answererRole: "Data Science Coach",
    isActive: true
  },
  {
    title: "Dealing with burnout while working remotely",
    content: "I've been working remotely for the past year and I'm starting to feel serious burnout. The lines between work and home have completely blurred. How are others managing to maintain boundaries?",
    author: "Jamie L.",
    isAnonymous: true,
    segmentId: "", // Will be filled with actual segment ID
    likes: 28,
    bookmarks: 17,
    isAnswered: false,
    isActive: true
  }
];

const sampleComments = [
  {
    author: "Emily R.",
    content: "I made a similar transition at 37! My advice is to leverage your existing skills and show how they transfer. I highlighted my project management experience from marketing when applying for data roles. Also, build a portfolio of projects to demonstrate your new skills.",
    isAnonymous: false,
    likes: 7,
    isActive: true
  },
  {
    author: "Michael K.",
    content: "Don't underestimate the value of your marketing background in data science. Your understanding of customer behavior and campaign performance is actually quite valuable. Consider positions that bridge both worlds like marketing analytics as a stepping stone.",
    isAnonymous: false,
    likes: 5,
    isActive: true
  },
  {
    author: "David W.",
    content: "I've been using strict time blocking to manage remote work. I set specific work hours, take scheduled breaks away from my desk, and have a shutdown ritual at the end of the day. It's also helpful to have a designated workspace that you can physically leave.",
    isAnonymous: false,
    likes: 12,
    isActive: true
  }
];

// Mongoose schemas
const segmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: String,
  color: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  isAnonymous: { type: Boolean, default: false },
  segmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Segment', required: true },
  likes: { type: Number, default: 0 },
  bookmarks: { type: Number, default: 0 },
  isAnswered: { type: Boolean, default: false },
  answer: String,
  answeredBy: String,
  answererRole: String,
  answererCoachId: mongoose.Schema.Types.ObjectId,
  reflection: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const commentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  author: { type: String, required: true },
  content: { type: String, required: true },
  isAnonymous: { type: Boolean, default: false },
  likes: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Models
const Segment = mongoose.model('Segment', segmentSchema);
const Post = mongoose.model('Post', postSchema);
const Comment = mongoose.model('Comment', commentSchema);

// Initialize data
async function initializeData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB!');

    // Check if data already exists
    const segmentsCount = await Segment.countDocuments();
    const postsCount = await Post.countDocuments();
    
    console.log(`Found ${segmentsCount} segments and ${postsCount} posts`);
    
    if (segmentsCount > 0 && postsCount > 0) {
      console.log('Community data already exists. Skipping initialization.');
      await mongoose.connection.close();
      return;
    }
    
    // Create segments
    console.log('Creating community segments...');
    const createdSegments = await Segment.create(sampleSegments);
    console.log(`Created ${createdSegments.length} segments`);
    
    // Assign segment IDs to posts
    samplePosts[0].segmentId = createdSegments[0]._id; // Career Development
    samplePosts[1].segmentId = createdSegments[1]._id; // Technical Skills
    samplePosts[2].segmentId = createdSegments[2]._id; // Work-Life Balance
    
    // Create posts
    console.log('Creating community posts...');
    const createdPosts = await Post.create(samplePosts);
    console.log(`Created ${createdPosts.length} posts`);
    
    // Assign post IDs to comments
    sampleComments[0].postId = createdPosts[0]._id; // Career change post
    sampleComments[1].postId = createdPosts[0]._id; // Career change post
    sampleComments[2].postId = createdPosts[2]._id; // Burnout post
    
    // Create comments
    console.log('Creating comments...');
    const createdComments = await Comment.create(sampleComments);
    console.log(`Created ${createdComments.length} comments`);
    
    console.log('Community data initialization complete!');
  } catch (error) {
    console.error('Error initializing community data:', error);
  } finally {
    await mongoose.connection.close();
  }
}

// Initialize data
initializeData();
