
import React from 'react';
import { Story } from '../types';

interface StoryBarProps {
  stories: Story[];
  onStoryClick: (index: number) => void;
}

export const StoryBar: React.FC<StoryBarProps> = ({ stories, onStoryClick }) => {
  return (
    <div className="flex gap-4 overflow-x-auto p-4 bg-white border-b border-gray-200 hide-scrollbar">
      <div className="flex flex-col items-center gap-1 shrink-0">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-2 border-gray-200 p-0.5 relative group cursor-pointer">
            <img 
              src="https://picsum.photos/seed/myuser/100/100" 
              className="w-full h-full rounded-full object-cover"
              alt="My Story"
            />
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-blue-500 border-2 border-white rounded-full flex items-center justify-center text-white font-bold text-sm">
              +
            </div>
          </div>
          <span className="text-xs text-gray-500 mt-1">Your Story</span>
        </div>
      </div>
      
      {stories.map((story, index) => (
        <div key={story.id} className="flex flex-col items-center gap-1 shrink-0" onClick={() => onStoryClick(index)}>
          <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 cursor-pointer hover:scale-105 transition-transform">
            <div className="w-full h-full rounded-full border-2 border-white overflow-hidden">
              <img 
                src={story.imageUrl} 
                className="w-full h-full object-cover"
                alt={story.user.username}
              />
            </div>
          </div>
          <span className="text-xs text-gray-700 truncate w-16 text-center">
            {story.user.username}
          </span>
        </div>
      ))}
    </div>
  );
};
