import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { CommunitySegmentModel } from '../models/communitySegment.model';
import { CommunityPostModel } from '../models/communityPost.model';
import { CommentModel } from '../models/comment.model';

// Load environment variables
dotenv.config();

// Sample community data
const sampleSegments = [
  {
    id: 'career-plateau',
    name: 'Career Plateau',
    description: 'Discuss strategies for overcoming career stagnation and finding new growth opportunities.',
    icon: 'career',
    color: '#4CAF50',
    isMatched: true,
    isActive: true
  },
  {
    id: 'technical-skills',
    name: 'Technical Skills',
    description: 'Share resources, ask questions, and discuss technical skills relevant to your field.',
    icon: 'skills',
    color: '#2196F3',
    isMatched: false,
    isActive: true
  },
  {
    id: 'work-life-balance',
    name: 'Work-Life Balance',
    description: 'Strategies for maintaining a healthy balance between professional and personal life.',
    icon: 'balance',
    color: '#9C27B0',
    isMatched: true,
    isActive: true
  },
  {
    id: 'interview-preparation',
    name: 'Interview Preparation',
    description: 'Tips, mock interview questions, and strategies for job interviews.',
    icon: 'interview',
    color: '#FF9800',
    isMatched: false,
    isActive: true
  }
];

const samplePosts = [
  {
    author: 'Sarah M.',
    question: 'How to approach a career change at 35?',
    details: 'I\'m considering a major career pivot from marketing to data science. Any advice on how to make this transition smoothly at my age without starting completely from the bottom?',
    segmentId: 'career-plateau',
    views: 145,
    likes: 12,
    bookmarks: 5,
    comments: 0,
    isAnonymous: false,
    isAnswered: false,
    isActive: true
  },
  {
    author: 'Mark T.',
    question: 'Resources for learning Python programming',
    details: 'Can anyone recommend some good resources for an absolute beginner to learn Python programming? I\'m specifically interested in data analysis applications.',
    segmentId: 'technical-skills',
    views: 238,
    likes: 8,
    bookmarks: 15,
    comments: 0,
    isAnswered: true,
    answer: 'For absolute beginners, I\'d recommend starting with \'Python Crash Course\' by Eric Matthes or the free \'Automate the Boring Stuff with Python\' by Al Sweigart. Once you have the basics down, you can move on to data-specific resources like \'Python for Data Analysis\' by Wes McKinney. Also, Codecademy and DataCamp have excellent interactive courses for Python with a data focus.',
    answeredBy: 'Alex Johnson',
    answererRole: 'Data Science Coach',
    isActive: true
  },
  {
    author: 'Anonymous',
    question: 'Dealing with burnout while working remotely',
    details: 'I\'ve been working remotely for the past year and I\'m starting to feel serious burnout. The lines between work and home have completely blurred. How are others managing to maintain boundaries?',
    segmentId: 'work-life-balance',
    views: 412,
    likes: 28,
    bookmarks: 17,
    comments: 0,
    isAnonymous: true,
    isAnswered: false,
    isActive: true
  }
];

async function initializeData() {
  try {
    // Connect to MongoDB
    const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/wingrox';
    await mongoose.connect(dbUri);
    console.log('Connected to MongoDB');

    // Check if data already exists
    const segmentsCount = await CommunitySegmentModel.countDocuments();
    const postsCount = await CommunityPostModel.countDocuments();
    
    console.log(`Found ${segmentsCount} segments and ${postsCount} posts`);
    
    if (segmentsCount > 0 && postsCount > 0) {
      console.log('Community data already exists. Skipping initialization.');
      await mongoose.connection.close();
      return;
    }

    // Create segments
    console.log('Creating community segments...');
    await CommunitySegmentModel.create(sampleSegments);
    console.log(`Created ${sampleSegments.length} segments`);

    // Create posts
    console.log('Creating community posts...');
    const createdPosts = await CommunityPostModel.create(samplePosts);
    console.log(`Created ${createdPosts.length} posts`);

    // Create sample comments
    const sampleComments = [
      {
        postId: createdPosts[0]._id,
        author: 'Emily R.',
        content: 'I made a similar transition at 37! My advice is to leverage your existing skills and show how they transfer. I highlighted my project management experience from marketing when applying for data roles. Also, build a portfolio of projects to demonstrate your new skills.',
        isAnonymous: false,
        likes: 7,
        isActive: true
      },
      {
        postId: createdPosts[0]._id,
        author: 'Michael K.',
        content: 'Don\'t underestimate the value of your marketing background in data science. Your understanding of customer behavior and campaign performance is actually quite valuable. Consider positions that bridge both worlds like marketing analytics as a stepping stone.',
        isAnonymous: false,
        likes: 5,
        isActive: true
      },
      {
        postId: createdPosts[2]._id,
        author: 'David W.',
        content: 'I\'ve been using strict time blocking to manage remote work. I set specific work hours, take scheduled breaks away from my desk, and have a shutdown ritual at the end of the day. It\'s also helpful to have a designated workspace that you can physically leave.',
        isAnonymous: false,
        likes: 12,
        isActive: true
      }
    ];

    // Create comments
    console.log('Creating comments...');
    await CommentModel.create(sampleComments);
    console.log(`Created ${sampleComments.length} comments`);

    // Update comment counts on posts
    for (const post of createdPosts) {
      const commentCount = await CommentModel.countDocuments({ postId: post._id, isActive: true });
      if (commentCount > 0) {
        await CommunityPostModel.findByIdAndUpdate(post._id, { comments: commentCount });
        console.log(`Updated post ${post._id} with ${commentCount} comments`);
      }
    }

    console.log('Community data initialization complete!');
  } catch (error) {
    console.error('Error initializing community data:', error);
  } finally {
    await mongoose.connection.close();
  }
}

// Run the initialization
initializeData();
