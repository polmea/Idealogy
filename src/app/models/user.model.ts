export type UserRole = 'buyer' | 'seller' | 'both';

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatar: string;
  role: UserRole;
  bio: string;
  totalEarnings: number;
  totalSpent: number;
  rating: number;
  reviewCount: number;
  joinedAt: Date;
  purchasedIdeaIds: string[];
  listedIdeaIds: string[];
}
