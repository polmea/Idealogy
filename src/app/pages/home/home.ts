import { Component, computed, inject, signal } from '@angular/core';
import { IdeaService } from '../../services/idea.service';
import { IdeaCard } from '../../components/idea-card/idea-card';
import { IdeaCategory } from '../../models/idea.model';

const CATEGORIES: { label: string; value: IdeaCategory | 'all'; emoji: string }[] = [
  { label: 'All', value: 'all', emoji: '✨' },
  { label: 'Tech', value: 'tech', emoji: '⚡' },
  { label: 'Business', value: 'business', emoji: '💼' },
  { label: 'Creative', value: 'creative', emoji: '🎨' },
  { label: 'Social', value: 'social', emoji: '🌐' },
  { label: 'Education', value: 'education', emoji: '📚' },
  { label: 'Health', value: 'health', emoji: '💊' },
  { label: 'Other', value: 'other', emoji: '🔮' },
];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IdeaCard],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private ideaService = inject(IdeaService);

  searchTerm = signal('');
  selectedCategory = signal<IdeaCategory | 'all'>('all');
  sortBy = signal<'latest' | 'price-asc' | 'price-desc' | 'rating'>('latest');
  showAvailableOnly = signal(false);

  categories = CATEGORIES;

  filteredIdeas = computed(() =>
    this.ideaService.search(
      this.searchTerm(),
      this.selectedCategory(),
      this.sortBy(),
      !this.showAvailableOnly()
    )
  );

  stats = computed(() => {
    const ideas = this.ideaService.ideas();
    return {
      total: ideas.length,
      available: ideas.filter((i) => i.status === 'available').length,
      sold: ideas.filter((i) => i.status === 'sold').length,
    };
  });

  onSearch(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  selectCategory(cat: IdeaCategory | 'all'): void {
    this.selectedCategory.set(cat);
  }

  onSortChange(event: Event): void {
    this.sortBy.set(
      (event.target as HTMLSelectElement).value as
        | 'latest'
        | 'price-asc'
        | 'price-desc'
        | 'rating'
    );
  }
}
