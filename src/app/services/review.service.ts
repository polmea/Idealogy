import { Injectable, signal, inject } from '@angular/core';
import { Review } from '../models/review.model';
import { IdeaService } from './idea.service';
import { AuthService } from './auth.service';

const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev1',
    ideaId: 'idea1',
    buyerId: 'user3',
    buyerName: 'Mike Torres',
    buyerAvatar: 'MT',
    rating: 5,
    comment:
      'Brilliant and incredibly detailed. The full blueprint was handed directly to a dev team and they got started immediately. Worth every penny.',
    createdAt: new Date('2025-03-20'),
  },
  {
    id: 'rev2',
    ideaId: 'idea3',
    buyerId: 'user1',
    buyerName: 'Alex Kim',
    buyerAvatar: 'AK',
    rating: 5,
    comment:
      "Sara's ideas always come with solid GTM strategies. The UNESCO partnership angle was something I hadn't considered — genius.",
    createdAt: new Date('2025-03-12'),
  },
  {
    id: 'rev3',
    ideaId: 'idea4',
    buyerId: 'user3',
    buyerName: 'Mike Torres',
    buyerAvatar: 'MT',
    rating: 4,
    comment:
      'Great concept backed by real market research. The insurance partnership framework was the highlight. Slightly pricey but justified.',
    createdAt: new Date('2025-02-01'),
  },
  {
    id: 'rev4',
    ideaId: 'idea7',
    buyerId: 'user1',
    buyerName: 'Alex Kim',
    buyerAvatar: 'AK',
    rating: 4,
    comment:
      'Solid Web3 idea with clear technical specs. The smart contract architecture section saved weeks of research.',
    createdAt: new Date('2025-02-18'),
  },
];

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private ideaService = inject(IdeaService);
  private authService = inject(AuthService);
  private _reviews = signal<Review[]>(MOCK_REVIEWS);
  readonly reviews = this._reviews.asReadonly();

  getByIdeaId(ideaId: string): Review[] {
    return this._reviews().filter((r) => r.ideaId === ideaId);
  }

  hasReviewed(ideaId: string): boolean {
    const user = this.authService.currentUser();
    if (!user) return false;
    return this._reviews().some(
      (r) => r.ideaId === ideaId && r.buyerId === user.id
    );
  }

  addReview(
    ideaId: string,
    rating: number,
    comment: string
  ): Review | null {
    const user = this.authService.currentUser();
    if (!user) return null;
    if (!this.ideaService.hasPurchased(ideaId)) return null;
    if (this.hasReviewed(ideaId)) return null;

    const newReview: Review = {
      id: 'rev_' + Date.now(),
      ideaId,
      buyerId: user.id,
      buyerName: user.displayName,
      buyerAvatar: user.avatar,
      rating,
      comment,
      createdAt: new Date(),
    };
    this._reviews.update((reviews) => [...reviews, newReview]);

    const allForIdea = [...this.getByIdeaId(ideaId), newReview];
    const avg =
      allForIdea.reduce((sum, r) => sum + r.rating, 0) / allForIdea.length;
    this.ideaService.updateRating(
      ideaId,
      Math.round(avg * 10) / 10,
      allForIdea.length
    );

    return newReview;
  }
}
