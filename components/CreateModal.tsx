
import React, { useState } from 'react';
import { GeminiService } from '../services/geminiService';

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (post: any) => void;
}

export const CreateModal: React.FC<CreateModalProps> = ({ isOpen, onClose, onPostCreated }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [type, setType] = useState<'image' | 'video'>('image');

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setStatus('Gemini is brainstorming...');

    try {
      if (type === 'image') {
        setStatus('Generating AI artwork...');
        const imageUrl = await GeminiService.generatePostImage(prompt);
        if (imageUrl) {
          const caption = await GeminiService.generateCaption(prompt);
          onPostCreated({
            id: Date.now().toString(),
            user: {
              id: 'curr-user',
              username: 'ai_artist_pro',
              fullName: 'AI Creator',
              avatar: 'https://picsum.photos/seed/ai/100/100',
              isVerified: true
            },
            imageUrl,
            caption,
            likes: 0,
            comments: 0,
            timestamp: 'Just now'
          });
          onClose();
        }
      } else {
        setStatus('Veo is rendering your AI Reel (this may take a minute)...');
        const videoUrl = await GeminiService.generateReel(prompt);
        if (videoUrl) {
          const caption = await GeminiService.generateCaption(prompt);
          onPostCreated({
            id: Date.now().toString(),
            user: {
              id: 'curr-user',
              username: 'ai_director',
              fullName: 'AI Director',
              avatar: 'https://picsum.photos/seed/movie/100/100',
              isVerified: true
            },
            imageUrl: '',
            videoUrl,
            caption,
            likes: 0,
            comments: 0,
            timestamp: 'Just now'
          });
          onClose();
        }
      }
    } catch (err) {
      console.error(err);
      setStatus('Something went wrong. Try again!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold">Create with InstaOut AI</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="flex gap-2 mb-6">
            <button 
              onClick={() => setType('image')}
              className={`flex-1 py-3 rounded-xl font-medium transition-all ${type === 'image' ? 'instagram-gradient text-white shadow-lg' : 'bg-gray-100 text-gray-600'}`}
            >
              AI Post
            </button>
            <button 
              onClick={() => setType('video')}
              className={`flex-1 py-3 rounded-xl font-medium transition-all ${type === 'video' ? 'instagram-gradient text-white shadow-lg' : 'bg-gray-100 text-gray-600'}`}
            >
              AI Reel
            </button>
          </div>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={type === 'image' ? "Describe the image you want Gemini to create..." : "Describe the video scene you want Veo to generate..."}
            className="w-full h-32 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none resize-none mb-4"
            disabled={loading}
          />

          {loading && (
            <div className="mb-4 p-4 bg-blue-50 text-blue-700 rounded-xl text-sm flex items-center gap-3 animate-pulse">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              {status}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading || !prompt}
            className={`w-full py-4 rounded-xl font-bold text-lg text-white transition-all shadow-xl ${loading || !prompt ? 'bg-gray-400' : 'instagram-gradient hover:scale-[1.02] active:scale-[0.98]'}`}
          >
            {loading ? 'Processing...' : 'Generate Now'}
          </button>
          
          <p className="mt-4 text-[10px] text-gray-400 text-center uppercase tracking-widest">
            Powered by Gemini 2.5 & Veo 3.1
          </p>
        </div>
      </div>
    </div>
  );
};
