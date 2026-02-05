
export interface User {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  isVerified?: boolean;
}

export interface Post {
  id: string;
  user: User;
  imageUrl: string;
  videoUrl?: string;
  caption: string;
  likes: number;
  comments: number;
  timestamp: string;
  isLiked?: boolean;
}

export interface Story {
  id: string;
  user: User;
  imageUrl: string;
  isViewed?: boolean;
}

export enum AppTab {
  HOME = 'home',
  SEARCH = 'search',
  CREATE = 'create',
  REELS = 'reels',
  PROFILE = 'profile'
}
