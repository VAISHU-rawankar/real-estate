import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  CalendarIcon, 
  ClockIcon, 
  ArrowLeftIcon,
  ShareIcon,
  BookmarkIcon,
  ChatBubbleLeftEllipsisIcon
} from '@heroicons/react/24/outline';
import { BLOG_POSTS } from '@/data/blogData';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [scrollProgress, setScrollProgress] = React.useState(0);
  
  const post = BLOG_POSTS.find(p => p.slug === slug) || BLOG_POSTS[0];
  const relatedPosts = BLOG_POSTS.filter(p => p.slug !== slug).slice(0, 3);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [slug]);

  return (
    <>
      <Helmet>
        <title>{post.title} — RealEstate Pro</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>

      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-[100] bg-gray-100">
        <motion.div 
          className="h-full bg-[#000000]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="bg-white min-h-screen">
        {/* ─── Premium Hero Section ──────────────────────────────────────── */}
        <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            src={post.image} 
            className="absolute inset-0 w-full h-full object-cover" 
            alt={post.title} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          
          <div className="absolute inset-0 flex flex-col justify-end pb-20 px-4 md:px-12">
            <div className="max-w-4xl mx-auto w-full">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span className="inline-block bg-white text-black text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-widest mb-6 shadow-2xl">
                  {post.category}
                </span>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-8">
                  {post.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 text-white/90">
                  <div className="flex items-center gap-3">
                    <img src={post.author?.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200'} className="w-12 h-12 rounded-full border-2 border-white/20 object-cover" alt="" />
                    <div>
                      <p className="text-[14px] font-bold">{post.author?.name || 'Contributor'}</p>
                      <p className="text-[11px] text-white/60 uppercase tracking-wider">{post.author?.role || 'Expert'}</p>
                    </div>
                  </div>
                  <div className="h-8 w-px bg-white/20 hidden md:block" />
                  <div className="flex items-center gap-2 text-[13px] font-medium">
                    <CalendarIcon className="w-4 h-4 opacity-70" />
                    {post.date}
                  </div>
                  <div className="flex items-center gap-2 text-[13px] font-medium">
                    <ClockIcon className="w-4 h-4 opacity-70" />
                    {post.readTime}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          <button 
            onClick={() => navigate('/blog')}
            className="absolute top-28 left-8 p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white hover:text-black transition-all group active:scale-95"
          >
            <ArrowLeftIcon className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          </button>
        </div>

        {/* ─── Article Content ─────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 md:px-12 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Main Content */}
            <motion.article 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="lg:col-span-8"
            >
              <div 
                className="prose prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:text-[#111111] prose-p:text-gray-600 prose-p:leading-relaxed prose-blockquote:border-l-[#000000] prose-blockquote:bg-gray-50 prose-blockquote:py-6 prose-blockquote:px-8 prose-blockquote:rounded-r-2xl prose-blockquote:italic"
                dangerouslySetInnerHTML={{ __html: post.content || `<p>${post.excerpt}</p><p>Full content coming soon...</p>` }}
              />

              <div className="mt-20 pt-10 border-t border-gray-100 flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <span className="text-[12px] font-bold text-[#111111] uppercase tracking-widest">Share:</span>
                  <div className="flex gap-3">
                    <button className="p-2.5 rounded-full border border-gray-100 text-gray-400 hover:bg-[#000000] hover:text-white hover:border-[#000000] transition-all">
                      <ShareIcon className="w-5 h-5" />
                    </button>
                    <button className="p-2.5 rounded-full border border-gray-100 text-gray-400 hover:bg-[#000000] hover:text-white hover:border-[#000000] transition-all">
                      <BookmarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {['#RealEstate', '#MarketTrends', '#Investment'].map(tag => (
                    <span key={tag} className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 py-1 bg-gray-50 rounded-lg hover:bg-[#000000] hover:text-white transition-all cursor-pointer">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Author Bio Card */}
              <div className="mt-16 p-8 md:p-10 bg-gray-50 rounded-[32px] flex flex-col md:flex-row items-center md:items-start gap-8 border border-gray-100">
                <img src={post.author?.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200'} className="w-24 h-24 rounded-3xl object-cover shadow-lg" alt="" />
                <div className="text-center md:text-left">
                  <h3 className="text-xl font-bold text-[#111111] mb-2">{post.author?.name || 'Contributor'}</h3>
                  <p className="text-sm text-gray-500 mb-6 font-medium italic">
                    {post.author?.bio || 'Expert in real estate market dynamics and urban development with a passion for helping people find their perfect space.'}
                  </p>
                  <button className="text-[#000000] text-[12px] font-bold uppercase tracking-widest hover:underline">
                    View Author Profile
                  </button>
                </div>
              </div>
            </motion.article>

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-12">
              {/* Sidebar Action Card */}
              <div className="bg-[#111111] rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <h3 className="text-2xl font-display font-bold mb-4 relative z-10 uppercase tracking-tight">Need a Property?</h3>
                <p className="text-gray-400 text-sm mb-8 relative z-10 leading-relaxed">
                  Browse through our handpicked collection of premium properties today.
                </p>
                <Link 
                  to="/properties" 
                  className="block w-full bg-white text-[#111111] text-center py-4 rounded-2xl font-bold text-[13px] uppercase tracking-widest transition-all shadow-lg active:scale-95"
                >
                  Explore Listings
                </Link>
              </div>

              {/* Newsletter Small */}
              <div className="border border-gray-100 rounded-[32px] p-8">
                <h3 className="text-xl font-bold text-[#111111] mb-4 uppercase tracking-tight text-[16px]">Newsletter</h3>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                  Join 10k+ subscribers for weekly market updates.
                </p>
                <div className="space-y-3">
                  <input 
                    type="email" 
                    placeholder="Email address" 
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 outline-none focus:bg-white focus:border-black transition-all text-sm font-medium"
                  />
                  <button className="w-full bg-[#111111] text-white py-4 rounded-2xl font-bold text-[12px] uppercase tracking-widest hover:bg-black transition-all">
                    Subscribe
                  </button>
                </div>
              </div>

              {/* Trending Posts */}
              <div>
                <h3 className="text-xl font-bold text-[#111111] mb-8 uppercase tracking-tight text-[16px]">Trending Now</h3>
                <div className="space-y-6">
                  {relatedPosts.map(p => (
                    <Link key={p.slug} to={`/blog/${p.slug}`} className="flex gap-4 group">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 shadow-sm">
                        <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h4 className="text-[14px] font-bold text-[#111111] leading-tight mb-2 group-hover:text-black transition-colors">
                          {p.title}
                        </h4>
                        <span className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">{p.date}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>

          </div>
        </div>

        {/* ─── Related Articles Grid ───────────────────────────────────────── */}
        <div className="bg-gray-50 py-24 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 md:px-12">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-display font-bold text-[#111111] uppercase tracking-tight">More to Read</h2>
              <Link to="/blog" className="text-black text-[12px] font-bold uppercase tracking-widest hover:underline">
                View All Blogs
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {BLOG_POSTS.slice(0, 3).map((article, idx) => (
                <motion.div 
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => navigate(`/blog/${article.slug}`)}
                  className="group cursor-pointer bg-white p-4 rounded-[32px] shadow-sm hover:shadow-2xl transition-all"
                >
                  <div className="aspect-[4/3] rounded-[24px] overflow-hidden mb-6 shadow-md">
                    <img src={article.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                  </div>
                  <div className="px-2 pb-4">
                    <span className="text-black text-[10px] font-bold uppercase tracking-[0.2em] mb-3 block opacity-40">
                      {article.category}
                    </span>
                    <h3 className="text-[18px] font-bold text-[#111111] mb-4 leading-snug group-hover:text-black transition-colors">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-4 text-[12px] text-gray-400 font-medium">
                      <span>{article.date}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

