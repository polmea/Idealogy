import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { IdeaService } from '../../services/idea.service';
import { ReviewService } from '../../services/review.service';
import { AuthService } from '../../services/auth.service';
import { StarRating } from '../../components/star-rating/star-rating';
import { Idea } from '../../models/idea.model';
import { Review } from '../../models/review.model';

@Component({
  selector: 'app-idea-detail',
  standalone: true,
  imports: [RouterLink, DatePipe, ReactiveFormsModule, StarRating],
  templateUrl: './idea-detail.html',
  styleUrl: './idea-detail.scss',
})
export class IdeaDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private ideaService = inject(IdeaService);
  private reviewService = inject(ReviewService);
  readonly auth = inject(AuthService);
  private fb = inject(FormBuilder);

  idea = signal<Idea | null>(null);
  reviews = signal<Review[]>([]);
  showPurchaseConfirm = signal(false);
  purchaseSuccess = signal(false);
  reviewStars = signal(5);

  reviewForm = this.fb.group({
    comment: ['', [Validators.required, Validators.minLength(20)]],
  });

  hasPurchased = computed(() => {
    const i = this.idea();
    return i ? this.ideaService.hasPurchased(i.id) : false;
  });

  isOwnIdea = computed(() => {
    const i = this.idea();
    return i ? this.ideaService.isOwnIdea(i.id) : false;
  });

  hasReviewed = computed(() => {
    const i = this.idea();
    return i ? this.reviewService.hasReviewed(i.id) : false;
  });

  canReview = computed(
    () => this.hasPurchased() && !this.hasReviewed() && !this.isOwnIdea()
  );

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    const found = this.ideaService.getById(id);
    if (!found) {
      this.router.navigate(['/']);
      return;
    }
    this.idea.set(found);
    this.reviews.set(this.reviewService.getByIdeaId(id));
  }

  setReviewStar(n: number): void {
    this.reviewStars.set(n);
  }

  confirmPurchase(): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url },
      });
      return;
    }
    this.showPurchaseConfirm.set(true);
  }

  executePurchase(): void {
    const idea = this.idea();
    if (!idea) return;
    const ok = this.ideaService.purchaseIdea(idea.id);
    if (ok) {
      this.idea.set(this.ideaService.getById(idea.id) ?? idea);
      this.purchaseSuccess.set(true);
      this.showPurchaseConfirm.set(false);
    }
  }

  submitReview(): void {
    if (this.reviewForm.invalid) return;
    const idea = this.idea();
    if (!idea) return;
    const comment = this.reviewForm.value.comment ?? '';
    const newReview = this.reviewService.addReview(idea.id, this.reviewStars(), comment);
    if (newReview) {
      this.reviews.update((r) => [...r, newReview]);
      this.idea.set(this.ideaService.getById(idea.id) ?? idea);
      this.reviewForm.reset();
      this.reviewStars.set(5);
    }
  }

  get sellerInfo() {
    const idea = this.idea();
    if (!idea) return null;
    return this.auth.getUserById(idea.sellerId);
  }
}
