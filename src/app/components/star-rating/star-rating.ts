import { Component, input } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  template: `
    <div class="stars">
      @for (n of [1, 2, 3, 4, 5]; track n) {
        <span class="star" [class.filled]="n <= Math.round(rating())">★</span>
      }
      @if (showCount() && count() > 0) {
        <span class="rating-val">{{ rating() }}</span>
        <span class="rating-count">({{ count() }})</span>
      }
    </div>
  `,
  styles: [
    `
      .stars {
        display: flex;
        align-items: center;
        gap: 1px;
      }
      .star {
        color: #2a2a4a;
        font-size: 0.8rem;
        line-height: 1;
      }
      .star.filled {
        color: #f59e0b;
      }
      .rating-val {
        font-size: 0.75rem;
        font-weight: 600;
        color: #f0f0ff;
        margin-left: 4px;
      }
      .rating-count {
        font-size: 0.7rem;
        color: #8b90a8;
        margin-left: 1px;
      }
    `,
  ],
})
export class StarRating {
  rating = input<number>(0);
  count = input<number>(0);
  showCount = input<boolean>(true);
  protected Math = Math;
}
