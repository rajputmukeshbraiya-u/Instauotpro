
import React, { useState } from 'react';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [liked, setLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post.likes);

  const toggleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  return (
    <div className="bg-white border-b border-gray-200 mb-2 md:border md:rounded-lg md:mb-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <img 
            src={post.user.avatar} 
            className="w-8 h-8 rounded-full object-cover border border-gray-100"
            alt={post.user.username}
          />
          <div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold hover:underline cursor-pointer">{post.user.username}</span>
              {post.user.isVerified && (
                <svg className="w-4 h-4 text-blue-500 fill-current" viewBox="0 0 24 24">
                  <path d="M10.5 2.5a2.5 2.5 0 0 1 3 0l1.1 1a2.5 2.5 0 0 0 2 1h1.4a2.5 2.5 0 0 1 2.5 2.5v1.4a2.5 2.5 0 0 0 1 2l1 1.1a2.5 2.5 0 0 1 0 3l-1 1.1a2.5 2.5 0 0 0-1 2v1.4a2.5 2.5 0 0 1-2.5 2.5h-1.4a2.5 2.5 0 0 0-2 1l-1.1 1a2.5 2.5 0 0 1-3 0l-1.1-1a2.5 2.5 0 0 0-2-1H6.5A2.5 2.5 0 0 1 4 17.6v-1.4a2.5 2.5 0 0 0-1-2l-1-1.1a2.5 2.5 0 0 1 0-3l1-1.1a2.5 2.5 0 0 0 1-2V6.5A2.5 2.5 0 0 1 6.5 4h1.4a2.5 2.5 0 0 0 2-1zM11 15.5l5-5-1.4-1.4-3.6 3.6-1.6-1.6L8 12.5l3 3z"/>
                </svg>
              )}
            </div>
            <p className="text-xs text-gray-500">Original Audio</p>
          </div>
        </div>
        <button className="text-gray-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
        </button>
      </div>

      {/* Media */}
      <div className="relative aspect-square bg-gray-100 flex items-center justify-center" onDoubleClick={toggleLike}>
        {post.videoUrl ? (
          <video 
            src={post.videoUrl} 
            className="w-full h-full object-cover" 
            autoPlay 
            muted 
            loop 
            playsInline
          />
        ) : (
          <img 
            src={post.imageUrl} 
            className="w-full h-full object-cover" 
            alt="Post content"
          />
        )}
      </div>

      {/* Interactions */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <button onClick={toggleLike} className={liked ? "text-red-500" : "text-gray-700"}>
              <svg className={`w-7 h-7 ${liked ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <button className="text-gray-700">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
            <button className="text-gray-700">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <button className="text-gray-700">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-bold">{likeCount.toLocaleString()} likes</p>
          <p className="text-sm">
            <span className="font-bold mr-2">{post.user.username}</span>
            {post.caption}
          </p>
          <button className="text-sm text-gray-500">View all {post.comments} comments</button>
          <p className="text-[10px] text-gray-400 uppercase">{post.timestamp}</p>
        </div>
      </div>
    </div>
  );
};
