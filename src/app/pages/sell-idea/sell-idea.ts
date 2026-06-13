import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { IdeaService } from '../../services/idea.service';
import { AuthService } from '../../services/auth.service';
import { IdeaCategory } from '../../models/idea.model';

const EMOJI_OPTIONS = ['💡', '🚀', '🎯', '🧠', '💼', '🌿', '🎨', '🏥', '📚', '🔮', '⚡', '🌐', '🎵', '🍳', '🌙'];

@Component({
  selector: 'app-sell-idea',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './sell-idea.html',
  styleUrl: './sell-idea.scss',
})
export class SellIdea {
  private fb = inject(FormBuilder);
  private ideaService = inject(IdeaService);
  private authService = inject(AuthService);
  private router = inject(Router);

  emojiOptions = EMOJI_OPTIONS;
  selectedEmoji = signal('💡');
  submitted = signal(false);

  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
    category: ['tech' as IdeaCategory, Validators.required],
    price: [99, [Validators.required, Validators.min(1), Validators.max(9999)]],
    previewDescription: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(300)]],
    fullDescription: ['', [Validators.required, Validators.minLength(100)]],
    tags: ['', Validators.required],
  });

  constructor() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/sell' } });
    }
  }

  selectEmoji(emoji: string): void {
    this.selectedEmoji.set(emoji);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const user = this.authService.currentUser()!;
    const val = this.form.value;
    const tags = (val.tags ?? '')
      .split(',')
      .map((t: string) => t.trim())
      .filter((t: string) => t.length > 0);

    const newIdea = this.ideaService.createIdea({
      title: val.title!,
      category: val.category as IdeaCategory,
      price: val.price!,
      previewDescription: val.previewDescription!,
      fullDescription: val.fullDescription!,
      tags,
      sellerId: user.id,
      sellerName: user.displayName,
      sellerAvatar: user.avatar,
      coverEmoji: this.selectedEmoji(),
    });

    this.submitted.set(true);
    setTimeout(() => this.router.navigate(['/ideas', newIdea.id]), 1500);
  }

  hasError(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }
}
