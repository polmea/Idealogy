export type IdeaCategory =
  | 'tech'
  | 'business'
  | 'creative'
  | 'social'
  | 'education'
  | 'health'
  | 'other';

export type IdeaStatus = 'available' | 'sold' | 'reserved';

export interface Idea {
  id: string;
  title: string;
  category: IdeaCategory;
  price: number;
  previewDescription: string;
  fullDescription: string;
  tags: string[];
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  buyerId?: string;
  status: IdeaStatus;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  coverEmoji: string;
  viewCount: number;
}
