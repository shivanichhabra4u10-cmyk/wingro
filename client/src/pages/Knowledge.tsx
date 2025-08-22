import React from 'react';
import { Link } from 'react-router-dom';

const Knowledge: React.FC = () => {
  const featuredArticles = [
    {
      id: 1,
      title: "The Science Behind Growth Intelligence",
      excerpt: "How AI and psychology combine to create systematic growth pathways",
      category: "Research",
      readTime: "8 min read",
      image: "data-science"
    },
    {
      id: 2,
      title: "From Random Growth to Engineered Success",
      excerpt: "Why traditional approaches fail and how intelligence-driven growth succeeds",
      category: "Strategy",
      readTime: "5 min read",
      image: "strategy"
    },
    {
      id: 3,
      title: "The 5 Most Common Growth Blockers for Startups",
      excerpt: "Predictable challenges and how to overcome them systematically",
      category: "Startups",
      readTime: "6 min read",
      image: "startup"
    }
  ];

  const categories = [
    { name: "Personal Growth", count: 18, icon: "🌱" },
    { name: "Career Development", count: 26, icon: "🚀" },
    { name: "Startup Success", count: 24, icon: "💼" },
    { name: "Leadership", count: 19, icon: "🏆" },
    { name: "Growth Science", count: 12, icon: "🧪" },
    { name: "Case Studies", count: 8, icon: "📊" }
  ];

  return (
    <div className="flex flex-col space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative rounded-xl overflow-hidden mb-8 shadow-lg">
        <div className="bg-gradient-to-r from-blue-900 to-indigo-800 p-8 md:p-12 text-white">
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-400">
              Knowledge Center
            </h1>
            <p className="text-lg md:text-xl mb-8 text-blue-100">
              Research-backed insights and frameworks to accelerate your growth journey
            </p>
          </div>
          {/* Visual elements */}
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-500/30 blur-3xl"></div>
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 blur-3xl"></div>
        </div>
      </section>

      {/* Featured Articles Section */}
      <section className="bg-white rounded-xl p-8 shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Featured Articles</h2>
          <div className="mt-4 md:mt-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Search knowledge base..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredArticles.map((article) => (
            <div key={article.id} className="bg-gradient-to-b from-white to-gray-50 rounded-xl shadow overflow-hidden hover:shadow-lg transition-all">
              <div className={`h-48 bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white`}>
                <div className="text-6xl">{article.image === "data-science" ? "📊" : article.image === "strategy" ? "🧠" : "🚀"}</div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-cyan-700 font-medium px-3 py-1 bg-cyan-50 rounded-full">
                    {article.category}
                  </span>
                  <span className="text-xs text-gray-500">{article.readTime}</span>
                </div>
                <h3 className="font-bold text-xl mb-2 text-gray-800">{article.title}</h3>
                <p className="text-gray-600 mb-4">{article.excerpt}</p>
                <Link 
                  to={`/knowledge/${article.id}`}
                  className="text-cyan-600 font-medium hover:text-cyan-800 flex items-center"
                >
                  Read Article
                  <svg 
                    className="ml-1 h-4 w-4" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link 
            to="/knowledge/articles"
            className="inline-block px-6 py-2 border border-cyan-600 text-cyan-700 font-medium rounded-lg hover:bg-cyan-50 transition-all"
          >
            View All Articles
          </Link>
        </div>
      </section>

      {/* Categories and Resources Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Categories */}
        <section className="bg-white rounded-xl p-6 shadow-lg md:col-span-1">
          <h2 className="text-xl font-bold mb-6 text-gray-800">Knowledge Categories</h2>
          
          <div className="space-y-4">
            {categories.map((category) => (
              <Link 
                key={category.name}
                to={`/knowledge/category/${category.name.toLowerCase().replace(/\s/g, '-')}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-all"
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{category.icon}</span>
                  <span className="font-medium text-gray-700">{category.name}</span>
                </div>
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                  {category.count}
                </span>
              </Link>
            ))}
          </div>
        </section>
        
        {/* Resources */}
        <section className="bg-gradient-to-r from-gray-900 to-blue-900 rounded-xl p-6 text-white shadow-lg md:col-span-2">
          <h2 className="text-xl font-bold mb-6 text-cyan-400">Growth Resources</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-gray-800/60 to-blue-900/60 backdrop-blur-sm p-4 rounded-lg hover:shadow-lg transition-all">
              <div className="text-3xl mb-3">📚</div>
              <h3 className="font-bold text-lg mb-2 text-cyan-400">Growth Frameworks Library</h3>
              <p className="text-blue-100 text-sm mb-4">
                Access our collection of proven frameworks for different growth challenges and scenarios.
              </p>
              <Link 
                to="/knowledge/frameworks"
                className="text-cyan-300 text-sm font-medium hover:text-cyan-200 flex items-center"
              >
                Access Library
                <svg 
                  className="ml-1 h-4 w-4" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800/60 to-blue-900/60 backdrop-blur-sm p-4 rounded-lg hover:shadow-lg transition-all">
              <div className="text-3xl mb-3">🧪</div>
              <h3 className="font-bold text-lg mb-2 text-cyan-400">Growth Labs Research</h3>
              <p className="text-blue-100 text-sm mb-4">
                Explore our latest research findings on growth intelligence and success patterns.
              </p>
              <Link 
                to="/knowledge/research"
                className="text-cyan-300 text-sm font-medium hover:text-cyan-200 flex items-center"
              >
                View Research
                <svg 
                  className="ml-1 h-4 w-4" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800/60 to-blue-900/60 backdrop-blur-sm p-4 rounded-lg hover:shadow-lg transition-all">
              <div className="text-3xl mb-3">🎓</div>
              <h3 className="font-bold text-lg mb-2 text-cyan-400">Growth Academy</h3>
              <p className="text-blue-100 text-sm mb-4">
                Free courses and workshops on growth intelligence methodologies and applications.
              </p>
              <Link 
                to="/knowledge/academy"
                className="text-cyan-300 text-sm font-medium hover:text-cyan-200 flex items-center"
              >
                Start Learning
                <svg 
                  className="ml-1 h-4 w-4" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800/60 to-blue-900/60 backdrop-blur-sm p-4 rounded-lg hover:shadow-lg transition-all">
              <div className="text-3xl mb-3">🎙️</div>
              <h3 className="font-bold text-lg mb-2 text-cyan-400">Growth Intelligence Podcast</h3>
              <p className="text-blue-100 text-sm mb-4">
                Weekly discussions with growth experts, founders, and transformation leaders.
              </p>
              <Link 
                to="/knowledge/podcast"
                className="text-cyan-300 text-sm font-medium hover:text-cyan-200 flex items-center"
              >
                Listen Now
                <svg 
                  className="ml-1 h-4 w-4" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </div>
      
      {/* Newsletter Section */}
      <section className="bg-gradient-to-b from-white to-blue-50 rounded-xl p-8 shadow-lg">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">Stay Updated</h2>
          <p className="text-gray-600 mb-6">
            Subscribe to our weekly Growth Intelligence digest for the latest insights, frameworks, and research findings
          </p>
          
          <div className="flex flex-col sm:flex-row gap-2 mb-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <button
              className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium rounded-lg hover:shadow-lg transition-all"
            >
              Subscribe
            </button>
          </div>
          
          <p className="text-xs text-gray-500">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-white rounded-xl p-8 shadow-lg text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">Ready to Apply This Knowledge?</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Move beyond theory and start your practical growth journey with our intelligence-driven tools
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">          <Link
            to="/products"
            className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-700 text-white font-medium rounded-lg shadow hover:shadow-lg transition-all"
          >
            Explore Solutions
          </Link>
          <Link
            to="/products"
            className="px-8 py-3 border border-blue-600 text-blue-700 font-medium rounded-lg hover:bg-blue-50 transition-all"
          >
            View Our Products
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Knowledge;
