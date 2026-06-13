import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RequestService } from '../../services/request.service';
import { AuthService } from '../../services/auth.service';
import { RequestCard } from '../../components/request-card/request-card';
import { IdeaCategory } from '../../models/idea.model';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, RequestCard],
  templateUrl: './requests.html',
  styleUrl: './requests.scss',
})
export class Requests {
  requestService = inject(RequestService);
  auth = inject(AuthService);
  private fb = inject(FormBuilder);

  showForm = signal(false);
  filterStatus = signal<'all' | 'open' | 'fulfilled'>('open');

  filteredRequests = computed(() => {
    const all = this.requestService.requests();
    const f = this.filterStatus();
    if (f === 'all') return all;
    return all.filter((r) => r.status === f);
  });

  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(10)]],
    description: ['', [Validators.required, Validators.minLength(30)]],
    category: ['tech' as IdeaCategory, Validators.required],
    budget: [200, [Validators.required, Validators.min(1)]],
  });

  toggleForm(): void {
    this.showForm.update((v) => !v);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const val = this.form.value;
    this.requestService.createRequest({
      title: val.title!,
      description: val.description!,
      category: val.category as IdeaCategory,
      budget: val.budget!,
    });
    this.form.reset({ category: 'tech', budget: 200 });
    this.showForm.set(false);
    this.filterStatus.set('open');
  }

  hasError(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }
}
