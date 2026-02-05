
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Logo } from './components/Logo';
import { StoryBar } from './components/StoryBar';
import { PostCard } from './components/PostCard';
import { CreateModal } from './components/CreateModal';
import { StoryViewer } from './components/StoryViewer';
import { User, Post, Story, AppTab } from './types';
import { GeminiService } from './services/geminiService';

const MOCK_STORIES: Story[] = [
  { id: '1', user: { id: 'u1', username: 'leo_travels', fullName: 'Leo', avatar: 'https://picsum.photos/seed/u1/100/100' }, imageUrl: 'https://picsum.photos/seed/s1/400/700' },
  { id: '2', user: { id: 'u2', username: 'marta_cooks', fullName: 'Marta', avatar: 'https://picsum.photos/seed/u2/100/100' }, imageUrl: 'https://picsum.photos/seed/s2/400/700' },
  { id: '3', user: { id: 'u3', username: 'tech_guru', fullName: 'Dev', avatar: 'https://picsum.photos/seed/u3/100/100' }, imageUrl: 'https://picsum.photos/seed/s3/400/700' },
  { id: '4', user: { id: 'u4', username: 'nature_pics', fullName: 'Sarah', avatar: 'https://picsum.photos/seed/u4/100/100' }, imageUrl: 'https://picsum.photos/seed/s4/400/700' },
  { id: '5', user: { id: 'u5', username: 'gym_freak', fullName: 'Jack', avatar: 'https://picsum.photos/seed/u5/100/100' }, imageUrl: 'https://picsum.photos/seed/s5/400/700' },
];

const INITIAL_POSTS: Post[] = [
  {
    id: 'p1',
    user: { id: 'u1', username: 'leo_travels', fullName: 'Leo', avatar: 'https://picsum.photos/seed/u1/100/100', isVerified: true },
    imageUrl: 'https://picsum.photos/seed/scenic/800/800',
    caption: 'Lost in the beauty of the Alps! 🏔️ #travel #mountains',
    likes: 12543,
    comments: 89,
    timestamp: '2 hours ago'
  },
  {
    id: 'p2',
    user: { id: 'u2', username: 'marta_cooks', fullName: 'Marta', avatar: 'https://picsum.photos/seed/u2/100/100' },
    imageUrl: 'https://picsum.photos/seed/food/800/800',
    caption: 'Homemade pasta night! 🍝 What is your favorite dish?',
    likes: 842,
    comments: 45,
    timestamp: '5 hours ago'
  }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.HOME);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [exploreImages, setExploreImages] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setExploreImages([...Array(18)].map((_, i) => `https://picsum.photos/seed/exp${i}/400/400`));
  }, []);

  const fetchMorePosts = useCallback(async () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    
    try {
      if (activeTab === AppTab.HOME) {
        const metadataBatch = await GeminiService.generatePostMetadataBatch(3);
        const newPosts: Post[] = metadataBatch.map((meta: any, idx: number) => ({
          id: `ai-${Date.now()}-${idx}`,
          user: {
            id: `ai-u-${idx}`,
            username: meta.username,
            fullName: meta.fullName,
            avatar: `https://picsum.photos/seed/${meta.username}/100/100`,
            isVerified: meta.isVerified
          },
          imageUrl: `https://picsum.photos/seed/${encodeURIComponent(meta.imagePrompt)}/800/800`,
          caption: meta.caption,
          likes: Math.floor(Math.random() * 5000),
          comments: Math.floor(Math.random() * 200),
          timestamp: 'Just now'
        }));
        setPosts(prev => [...prev, ...newPosts]);
      } else if (activeTab === AppTab.SEARCH) {
        const nextStart = exploreImages.length;
        const moreImages = [...Array(12)].map((_, i) => `https://picsum.photos/seed/exp${nextStart + i}/400/400`);
        setExploreImages(prev => [...prev, ...moreImages]);
      }
    } catch (err) {
      console.error("Error fetching content:", err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [activeTab, isLoadingMore, exploreImages.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          fetchMorePosts();
        }
      },
      { threshold: 1.0 }
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [fetchMorePosts, isLoadingMore]);

  const handleNewPost = (newPost: Post) => {
    setPosts(prev => [newPost, ...prev]);
    setActiveTab(AppTab.HOME);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredPosts = posts.filter(p => 
    p.caption.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.HOME:
        return (
          <div className="max-w-screen-md mx-auto">
            <StoryBar stories={MOCK_STORIES} onStoryClick={setActiveStoryIndex} />
            <div className="pb-20 pt-2">
              {filteredPosts.map(post => <PostCard key={post.id} post={post} />)}
              <div ref={observerTarget} className="h-20 flex items-center justify-center">
                {isLoadingMore && <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />}
              </div>
            </div>
          </div>
        );
      case AppTab.SEARCH:
        return (
          <div className="max-w-screen-md mx-auto">
            <div className="p-4">
              <div className="relative">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search posts or creators..."
                  className="w-full bg-gray-100 border-none rounded-xl py-2 pl-10 pr-4 focus:ring-2 focus:ring-pink-500 outline-none"
                />
                <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <div className="p-1 grid grid-cols-3 gap-1">
              {exploreImages.map((src, i) => (
                <div key={i} className="aspect-square bg-gray-200 overflow-hidden cursor-pointer hover:opacity-90">
                  <img src={src} className="w-full h-full object-cover" alt="Explore" />
                </div>
              ))}
            </div>
            <div ref={observerTarget} className="h-20" />
          </div>
        );
      case AppTab.REELS:
        return (
          <div className="h-[calc(100vh-120px)] bg-black flex flex-col items-center overflow-y-scroll snap-y snap-mandatory hide-scrollbar">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="min-w-full h-full snap-start relative flex items-center justify-center bg-gray-900 shrink-0">
                <video 
                  src={i % 2 === 0 ? "https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-light-dancing-and-enjoying-music-4405-large.mp4" : "https://assets.mixkit.co/videos/preview/mixkit-fireworks-on-the-sky-during-new-year-13000-large.mp4"}
                  className="w-full h-full object-cover"
                  autoPlay={i === 0}
                  muted
                  loop
                  playsInline
                />
                <div className="absolute bottom-10 left-4 right-16 text-white drop-shadow-lg">
                   <div className="flex items-center gap-2 mb-2">
                     <div className="w-8 h-8 rounded-full bg-white/20 p-0.5"><div className="w-full h-full rounded-full bg-gray-500"/></div>
                     <span className="font-bold">Creator_AI_{i}</span>
                     <button className="text-xs font-bold border border-white px-2 py-0.5 rounded">Follow</button>
                   </div>
                   <p className="text-sm">Unlimited scrolling AI reels! #instaout #veo</p>
                </div>
                <div className="absolute bottom-20 right-4 flex flex-col gap-6 text-white">
                  <div className="flex flex-col items-center gap-1">
                    <button className="p-2 bg-white/10 rounded-full hover:bg-white/20">❤️</button>
                    <span className="text-xs font-bold">12k</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <button className="p-2 bg-white/10 rounded-full hover:bg-white/20">💬</button>
                    <span className="text-xs font-bold">124</span>
                  </div>
                  <button className="p-2 bg-white/10 rounded-full hover:bg-white/20">✈️</button>
                </div>
              </div>
            ))}
          </div>
        );
      case AppTab.PROFILE:
        return (
          <div className="p-4 max-w-screen-md mx-auto">
            <div className="flex items-center gap-6 mb-8 px-4">
              <div className="w-20 h-20 md:w-32 md:h-32 rounded-full instagram-gradient p-0.5">
                <div className="w-full h-full rounded-full border-4 border-white overflow-hidden">
                  <img src="https://picsum.photos/seed/me/200/200" className="w-full h-full object-cover" alt="Profile" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-medium mb-4">insta_pro_user</h2>
                <div className="flex gap-4 md:gap-8 text-sm">
                  <div><span className="font-bold">{posts.length}</span> posts</div>
                  <div><span className="font-bold">1.2k</span> followers</div>
                  <div><span className="font-bold">342</span> following</div>
                </div>
              </div>
            </div>
            <div className="border-t pt-2 grid grid-cols-3 gap-0.5">
               {posts.map(p => (
                 <div key={p.id} className="aspect-square bg-gray-100"><img src={p.imageUrl} className="w-full h-full object-cover" alt=""/></div>
               ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pb-16 md:pb-0 bg-gray-50">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 h-16 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-4 text-gray-700">
           <button><svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg></button>
           <button><svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg></button>
        </div>
      </header>

      <main>{renderContent()}</main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-gray-200 h-16 px-6 z-50 flex items-center justify-between">
        <button onClick={() => setActiveTab(AppTab.HOME)} className={`transition-all ${activeTab === AppTab.HOME ? 'text-black scale-110' : 'text-gray-400'}`}>
          <svg className="w-7 h-7" fill={activeTab === AppTab.HOME ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
        </button>
        <button onClick={() => setActiveTab(AppTab.SEARCH)} className={`transition-all ${activeTab === AppTab.SEARCH ? 'text-black scale-110' : 'text-gray-400'}`}>
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </button>
        <button onClick={() => setIsCreateOpen(true)} className="hover:scale-110 transition-transform">
          <div className="w-10 h-10 rounded-xl instagram-gradient flex items-center justify-center text-white shadow-lg"><svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" /></svg></div>
        </button>
        <button onClick={() => setActiveTab(AppTab.REELS)} className={`transition-all ${activeTab === AppTab.REELS ? 'text-black scale-110' : 'text-gray-400'}`}>
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </button>
        <button onClick={() => setActiveTab(AppTab.PROFILE)} className={`w-7 h-7 rounded-full border-2 transition-all ${activeTab === AppTab.PROFILE ? 'border-black scale-110' : 'border-transparent'}`}>
          <img src="https://picsum.photos/seed/me/100/100" className="w-full h-full rounded-full object-cover" alt="" />
        </button>
      </nav>

      <CreateModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onPostCreated={handleNewPost} />
      {activeStoryIndex !== null && (
        <StoryViewer 
          stories={MOCK_STORIES} 
          initialIndex={activeStoryIndex} 
          onClose={() => setActiveStoryIndex(null)} 
        />
      )}
    </div>
  );
};

export default App;
