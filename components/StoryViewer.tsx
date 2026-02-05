
import React, { useState, useEffect } from 'react';
import { Story } from '../types';

interface StoryViewerProps {
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({ stories, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 5000; // 5 seconds per story
    const interval = 50; // Update every 50ms
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIndex < stories.length - 1) {
            setCurrentIndex(currentIndex + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex, stories.length, onClose]);

  const currentStory = stories[currentIndex];

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col">
      {/* Progress Bars */}
      <div className="flex gap-1 p-2">
        {stories.map((_, i) => (
          <div key={i} className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-50 ease-linear"
              style={{ width: i === currentIndex ? `${progress}%` : i < currentIndex ? '100%' : '0%' }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between p-4 text-white">
        <div className="flex items-center gap-3">
          <img src={currentStory.user.avatar} className="w-8 h-8 rounded-full border border-white" alt="" />
          <span className="font-bold text-sm">{currentStory.user.username}</span>
          <span className="text-gray-400 text-xs">12h</span>
        </div>
        <button onClick={onClose} className="p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Story Image */}
      <div className="flex-1 flex items-center justify-center p-2">
        <img 
          src={currentStory.imageUrl} 
          className="max-h-full max-w-full rounded-xl object-contain shadow-2xl" 
          alt="Story" 
        />
      </div>

      {/* Footer / Reply */}
      <div className="p-4 flex items-center gap-4">
        <input 
          type="text" 
          placeholder={`Reply to ${currentStory.user.username}...`}
          className="flex-1 bg-transparent border border-gray-500 rounded-full px-4 py-2 text-white text-sm focus:outline-none"
        />
        <button className="text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
};
