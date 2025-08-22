import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '../components/Button';
import SegmentButton from '../components/SegmentButton';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { community, CommunitySegment, CommunityPost, Comment } from '../services/api';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../context/AuthContext';

export interface NewPostData {
  author: string;
  role?: string;
  question: string;
  details?: string;
  segmentId: string;
  views: number;
  likes: number;
  bookmarks: number;
  comments: number;
  isAnonymous: boolean;
}


const GrowWithCommunity: React.FC = () => {
  // State declarations (move to top)
  const [question, setQuestion] = useState<string>(() => localStorage.getItem('communityQuestionDraft') || '');
  const [questionDetails, setQuestionDetails] = useState<string>(() => localStorage.getItem('communityQuestionDetailsDraft') || '');
  // Save draft to localStorage on change
  useEffect(() => {
    localStorage.setItem('communityQuestionDraft', question);
  }, [question]);

  useEffect(() => {
    localStorage.setItem('communityQuestionDetailsDraft', questionDetails);
  }, [questionDetails]);
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<string>('most-viewed');
  const [communitySegments, setCommunitySegments] = useState<CommunitySegment[]>([]);
  const [feedPosts, setFeedPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState({ segments: true, posts: true });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSegmentName, setActiveSegmentName] = useState<string>('Career Plateau & Stagnation');
  const [comments, setComments] = useState<{[key: string]: Comment[]}>({});
  const [showComments, setShowComments] = useState<{[key: string]: boolean}>({});
  const [newComment, setNewComment] = useState<{[key: string]: string}>({});
  const [coachReplyMode, setCoachReplyMode] = useState<{[key: string]: boolean}>({});
  const [coachAnswer, setCoachAnswer] = useState<{[key: string]: string}>({});
  const [coachReflection, setCoachReflection] = useState<{[key: string]: string}>({});
  const questionInputRef = useRef<HTMLTextAreaElement>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, hasMore: true, loading: false });
  const [expandedContent, setExpandedContent] = useState<{ type: 'question' | 'answer' | 'title', content: string } | null>(null);
  const navigate = useNavigate();
  const { user, loading: authLoading, isAdmin } = useAuth();

  // Fetch posts for active segment and filter
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(prev => ({ ...prev, posts: true }));
      try {
        // You may need to adjust the API call below to match your backend
        const posts = await community.getPosts({
          segmentId: activeSegmentName,
          sort: activeFilter,
          search: searchTerm,
          page: pagination.page,
          limit: pagination.limit
        });
        setFeedPosts(posts);
      } catch (err) {
        toast.error('Failed to load posts.');
      } finally {
        setIsLoading(prev => ({ ...prev, posts: false }));
      }
    };
    fetchPosts();
  }, [activeSegmentName, activeFilter, searchTerm, pagination.page]);

  // Fetch community segments on mount
  useEffect(() => {
    const fetchSegments = async () => {
      setIsLoading(prev => ({ ...prev, segments: true }));
      try {
        const segments = await community.getSegments();
        setCommunitySegments(segments);
      } catch (err) {
        toast.error('Failed to load community segments.');
      } finally {
        setIsLoading(prev => ({ ...prev, segments: false }));
      }
    };
    fetchSegments();
  }, []);


  // Handler to submit a question
  const handleSubmitQuestion = async () => {
    if (!question.trim()) return;
    if (!user && !authLoading) {
      toast.info('Please log in to post a question.');
      navigate('/login', { state: { from: '/grow-with-community' } });
      return;
    }
    setIsSubmitting(true);
    try {
      await community.createPost({
        author: user?.name || 'Anonymous',
        question: question.trim(),
        details: questionDetails.trim(),
        segmentId: activeSegmentName,
        isAnonymous,
        views: 0,
        likes: 0,
        bookmarks: 0,
        comments: 0,
        isActive: true,
        isAnswered: false
      });
  setQuestion('');
  setQuestionDetails('');
  localStorage.removeItem('communityQuestionDraft');
  localStorage.removeItem('communityQuestionDetailsDraft');
      toast.success('Question posted successfully!');
    } catch (err) {
      toast.error('Failed to post question.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler to like a post
  const handleLikePost = async (postId: string) => {
    try {
      const updatedPost = await community.likePost(postId);
      setFeedPosts(prev => 
        prev.map(post => 
          post._id === postId ? { ...post, likes: updatedPost.likes } : post
        )
      );
    } catch (err) {
      console.error(`Error liking post ${postId}:`, err);
    }
  };

  // Handler to bookmark a post
  const handleBookmarkPost = async (postId: string) => {
    try {
      const updatedPost = await community.bookmarkPost(postId);
      setFeedPosts(prev => 
        prev.map(post => 
          post._id === postId ? { ...post, bookmarks: updatedPost.bookmarks } : post
        )
      );
    } catch (err) {
      console.error(`Error bookmarking post ${postId}:`, err);
    }
  };

  // Handler to toggle comments visibility
  const toggleComments = async (postId: string) => {
    if (showComments[postId]) {
      setShowComments(prev => ({ ...prev, [postId]: false }));
    } else {
      if (!comments[postId]) {
        // Implement loadComments or handle comments loading here
      } else {
        setShowComments(prev => ({ ...prev, [postId]: true }));
      }
    }
  };

  // Handler to add a new comment
  const handleAddComment = async (postId: string) => {
    const commentText = newComment[postId];
    if (!commentText || commentText.trim() === '') return;
    if (!user && !authLoading) {
      toast.info("Please log in to add comments.");
      navigate('/login', { state: { from: '/grow-with-community' } });
      return;
    }
    try {
      const comment = await community.addComment(postId, {
        author: user?.name || 'Guest User',
        content: commentText.trim(),
        isAnonymous: false,
        likes: 0,
        isActive: true
      });
      setComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), comment]
      }));
      setNewComment(prev => ({ ...prev, [postId]: '' }));
      setFeedPosts(prev => 
        prev.map(post => 
          post._id === postId ? { ...post, comments: post.comments + 1 } : post
        )
      );
      toast.success('Comment added successfully.');
    } catch (err) {
      console.error(`Error adding comment to post ${postId}:`, err);
      toast.error('Failed to add comment. Please try again.');
    }
  };

  // Handler for coach to answer a post
  const handleCoachAnswer = async (postId: string) => {
    if (!coachAnswer[postId] || coachAnswer[postId].trim() === '') return;
    if (user?.role === 'user') {
      toast.error("Only coaches and admins can provide official answers.");
      return;
    }
    try {
      setIsSubmitting(true);
      const updatedPost = await community.answerPost(postId, {
        answer: coachAnswer[postId].trim(),
        answeredBy: user?.name || 'Coach',
        answererRole: user?.role || 'Coach',
        answererCoachId: user?.id,
        reflection: coachReflection[postId]?.trim()
      });
      setFeedPosts(prev => 
        prev.map(post => 
          post._id === postId ? { 
            ...post, 
            isAnswered: true,
            answer: updatedPost.answer,
            answeredBy: updatedPost.answeredBy,
            answererRole: updatedPost.answererRole,
            reflection: updatedPost.reflection
          } : post
        )
      );
      setCoachReplyMode(prev => ({ ...prev, [postId]: false }));
      setCoachAnswer(prev => ({ ...prev, [postId]: '' }));
      setCoachReflection(prev => ({ ...prev, [postId]: '' }));
      toast.success('Your answer has been posted successfully!');
    } catch (err) {
      console.error(`Error answering post ${postId}:`, err);
      toast.error('Failed to submit your answer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format comment date
  const formatCommentDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  // Load more posts when scrolling
  const loadMorePosts = () => {
    if (pagination.loading || !pagination.hasMore) return;
    setPagination(prev => ({ 
      ...prev, 
      page: prev.page + 1,
      loading: true 
    }));
  };

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPagination({
      page: 1,
      limit: 10,
      hasMore: true,
      loading: false
    });
  };
  return (
    <div className="flex flex-col space-y-12 pb-16 min-h-screen bg-gray-50 relative overflow-hidden">
      {/* ...existing code... */}
      {/* Header section with blue gradient background */}
      <section className="relative rounded-xl overflow-hidden mb-8 shadow-lg">
        <div className="bg-gradient-to-r from-blue-900 to-indigo-800 p-8 md:p-12 text-white">
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-400">
              WinGroX Community
            </h1>
            <h2 className="text-xl md:text-2xl font-semibold mb-5 text-blue-100">
              Connect, share insights, and grow with others on similar journeys
            </h2>
          </div>
        </div>
      </section>
      {/* Segment filter row above all sections */}
      <div className="w-full flex flex-col items-center py-8 bg-white rounded-2xl shadow-lg mx-auto mt-8">
        <div className="flex flex-row flex-wrap gap-4 justify-center w-full">
          {communitySegments.map((segment) => (
            <SegmentButton
              key={segment.id}
              active={activeSegmentName === segment.id}
              onClick={() => setActiveSegmentName(segment.id)}
            >
              {segment.name}
            </SegmentButton>
          ))}
          <Button
            variant="secondary"
            size="md"
            className="ml-2"
            onClick={() => setActiveSegmentName('')}
            disabled={activeSegmentName === ''}
          >
            Clear
          </Button>
        </div>
      </div>
      {/* Main grid and feed */}
      <div className="p-4 w-full mx-auto">
        <main className="bg-gradient-to-b from-gray-50 to-blue-50 rounded-xl p-6 shadow-lg w-full">
          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 p-4 bg-white rounded-xl shadow">
            <div className="flex flex-row gap-2">
              <Button
                variant={activeFilter === 'most-liked' ? 'primary' : 'secondary'}
                size="sm"
                className={activeFilter === 'most-liked' ? 'border-cyan-500' : 'border-blue-200'}
                onClick={() => setActiveFilter('most-liked')}
              >
                Most Liked
              </Button>
              <Button
                variant={activeFilter === 'most-viewed' ? 'primary' : 'secondary'}
                size="sm"
                className={activeFilter === 'most-viewed' ? 'border-cyan-500' : 'border-blue-200'}
                onClick={() => setActiveFilter('most-viewed')}
              >
                Most Viewed
              </Button>
              <Button
                variant={activeFilter === 'newest' ? 'primary' : 'secondary'}
                size="sm"
                className={activeFilter === 'newest' ? 'border-cyan-500' : 'border-blue-200'}
                onClick={() => setActiveFilter('newest')}
              >
                Newest
              </Button>
            </div>
            <input
              type="text"
              className="w-full md:w-64 px-4 py-2 rounded-full border border-blue-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-base"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          {/* Ask Question Box */}
          <div className="bg-white rounded-2xl p-8 mb-8 shadow-xl flex flex-col gap-6 w-full mx-auto" style={{width: '100%', maxWidth: '100%', minWidth: '100%'}}>
            <h3 className="font-extrabold text-2xl mb-2 text-blue-900">Ask Your Question</h3>
            <textarea 
              ref={questionInputRef}
              className="w-full p-4 border border-gray-300 rounded-xl mb-4 min-h-[80px] text-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="What's your biggest challenge right now? Our coaches are here to help..."
              value={question}
              onChange={e => setQuestion(e.target.value)}
              disabled={isSubmitting}
            ></textarea>
            <textarea 
              className="w-full p-4 border border-gray-300 rounded-xl mb-4 text-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Add more details to your question (optional)"
              value={questionDetails}
              onChange={e => setQuestionDetails(e.target.value)}
              disabled={isSubmitting}
            ></textarea>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="askAnonymous" 
                  checked={isAnonymous}
                  onChange={() => setIsAnonymous(!isAnonymous)}
                  className="h-5 w-5 accent-cyan-500"
                  disabled={isSubmitting}
                />
                <label htmlFor="askAnonymous" className="text-base font-medium text-gray-700">Ask anonymously</label>
              </div>
              <Button
                variant="primary"
                size="lg"
                onClick={handleSubmitQuestion}
                isLoading={isSubmitting}
                disabled={isSubmitting || question.trim() === ''}
                className="w-full sm:w-auto"
              >
                Post Question
              </Button>
            </div>
          </div>
          {/* Feed Content - Q&A Posts */}
          <div className="space-y-8">
            {isLoading.posts && pagination.page === 1 ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : feedPosts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="mb-4">No posts in this segment yet.</p>
                <p>Be the first to ask a question!</p>
              </div>
            ) : (
              feedPosts.map((post) => (
                <div key={post._id} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <p className="font-bold text-lg text-blue-900 mb-2 break-words overflow-hidden max-h-16 relative w-full" style={{ wordBreak: 'break-word', maxWidth: '100%' }}>
                    {post.question && post.question.length > 120 ? (
                      <span>
                        {post.question.slice(0, 120)}...
                        <Button
                          variant="outline"
                          size="sm"
                          className="ml-2"
                          onClick={() => setExpandedContent({ type: 'title', content: post.question ?? "" })}
                        >Read More</Button>
                      </span>
                    ) : post.question}
                  </p>
                  <p className="text-gray-600 break-words overflow-hidden max-h-24 relative w-full" style={{ wordBreak: 'break-word', maxWidth: '100%' }}>
                    {post.details && post.details.length > 300 ? (
                      <div>
                        {post.details.slice(0, 300)}...
                        <Button
                          variant="outline"
                          size="sm"
                          className="ml-2"
                          onClick={() => setExpandedContent({ type: 'question', content: post.details ?? "" })}
                        >Read More</Button>
                      </div>
                    ) : post.details}
                  </p>
                  {post.answer && (
                    <div className="bg-blue-50 p-4 rounded-lg my-3">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="bg-blue-100 text-blue-800 font-bold h-8 w-8 rounded-full flex items-center justify-center text-sm">
                          {post.answeredBy?.charAt(0) || 'C'}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{post.answeredBy}</p>
                          <p className="text-xs text-gray-500">{post.answererRole}</p>
                        </div>
                      </div>
                      <div className="whitespace-pre-wrap text-gray-800 leading-relaxed break-words overflow-hidden max-h-32 relative w-full" style={{ wordBreak: 'break-word', maxWidth: '100%' }}>
                        {post.answer.length > 400 ? (
                          <div>
                            {post.answer.slice(0, 400)}...
                            <Button
                              variant="outline"
                              size="sm"
                              className="ml-2"
                              onClick={() => setExpandedContent({ type: 'answer', content: post.answer ?? "" })}
                            >Read More</Button>
                          </div>
                        ) : post.answer}
                      </div>
                    </div>
                  )}
                  {post.reflection && (
                    <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r my-4 italic">
                      <p className="text-sm text-gray-500 mb-1">Key Reflection:</p>
                      {post.reflection}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100">
                    <Button variant="primary" size="md" className="flex items-center gap-2" onClick={() => handleLikePost(post._id!)}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                      </svg>
                      <span>{post.likes}</span>
                    </Button>
                    <Button variant="primary" size="md" className="flex items-center gap-2" onClick={() => handleBookmarkPost(post._id!)}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                      </svg>
                      <span>{post.bookmarks}</span>
                    </Button>
                    <Button variant="primary" size="md" className="flex items-center gap-2" onClick={() => toggleComments(post._id!)}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                      </svg>
                      <span>{post.comments}</span>
                    </Button>
                    {user && !post.isAnswered && (
                      <Button variant="primary" size="lg" className="flex items-center gap-2 ml-auto" onClick={() => setCoachReplyMode((prev: any) => ({ ...prev, [post._id!]: !prev[post._id!] }))}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path>
                        </svg>
                        Coach Reply
                      </Button>
                    )}
                  </div>
                  {coachReplyMode[post._id!] && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium mb-2">Coach Answer</h4>
                      <textarea
                        className="w-full p-3 border border-gray-300 rounded-lg mb-3 min-h-[120px]"
                        placeholder="Provide your expert guidance and advice..."
                        value={coachAnswer[post._id!] || ''}
                        onChange={(e) => setCoachAnswer((prev: any) => ({ ...prev, [post._id!]: e.target.value }))}
                      ></textarea>
                      <h4 className="font-medium mb-2">Key Reflection (Optional)</h4>
                      <textarea
                        className="w-full p-3 border border-gray-300 rounded-lg mb-3"
                        placeholder="Add a key reflection or takeaway from this question..."
                        value={coachReflection[post._id!] || ''}
                        onChange={(e) => setCoachReflection((prev: any) => ({ ...prev, [post._id!]: e.target.value }))}
                      ></textarea>
                      <div className="flex justify-end gap-3">
                        <Button variant="secondary" size="lg" onClick={() => setCoachReplyMode((prev: any) => ({ ...prev, [post._id!]: false }))}>
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          size="lg"
                          onClick={() => handleCoachAnswer(post._id!)}
                          isLoading={isSubmitting}
                          disabled={!coachAnswer[post._id!] || coachAnswer[post._id!].trim() === '' || isSubmitting}
                        >
                          Submit Answer
                        </Button>
                      </div>
                    </div>
                  )}
                  {showComments[post._id!] && (
                    <div className="mt-4 pl-4 border-l-2 border-gray-200">
                      <h4 className="font-medium mb-2">Comments</h4>
                      {comments[post._id!] && comments[post._id!].length > 0 ? (
                        <div className="space-y-3 mb-4">
                          {comments[post._id!].map((comment: any) => (
                            <div key={comment._id} className="bg-gradient-to-b from-white to-blue-50 p-3 rounded-lg">
                              <div className="flex justify-between items-center mb-1">
                                <div className="flex items-center">
                                  <span className="font-medium text-sm">{comment.author}</span>
                                </div>
                                <span className="text-xs text-gray-500">
                                  {comment.createdAt && formatCommentDate(comment.createdAt)}
                                </span>
                              </div>
                              <p className="text-gray-800 text-sm">{comment.content}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm mb-3">No comments yet.</p>
                      )}
                      <div className="flex gap-2 mt-2">
                        <input
                          type="text"
                          className="flex-1 border border-gray-300 rounded-lg p-2 text-sm"
                          placeholder={user ? "Add a comment..." : "Log in to comment..."}
                          value={newComment[post._id!] || ''}
                          onChange={(e) => setNewComment((prev: any) => ({ ...prev, [post._id!]: e.target.value }))}
                          disabled={!user}
                        />
                        <Button
                          variant="primary"
                          size="lg"
                          onClick={() => handleAddComment(post._id!)}
                          disabled={!user || !newComment[post._id!] || newComment[post._id!].trim() === ''}
                        >
                          Post
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </main>
      </div>
      {/* Expanded Content Modal for Read More */}
      {expandedContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
              onClick={() => setExpandedContent(null)}
              title="Close"
            >×</button>
            <h2 className="font-bold text-2xl mb-4 text-blue-900">
              {expandedContent.type === 'title' && 'Full Question Title'}
              {expandedContent.type === 'question' && 'Full Question Details'}
              {expandedContent.type === 'answer' && 'Full Coach Answer'}
            </h2>
            <div className="whitespace-pre-wrap text-lg text-gray-800 break-words">
              {expandedContent.content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default GrowWithCommunity;

