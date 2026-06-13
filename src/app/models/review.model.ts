export interface Review {
  id: string;
  ideaId: string;
  buyerId: string;
  buyerName: string;
  buyerAvatar: string;
  rating: number;
  comment: string;
  createdAt: Date;
}
