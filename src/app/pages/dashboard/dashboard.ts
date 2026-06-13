import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IdeaService } from '../../services/idea.service';
import { AuthService } from '../../services/auth.service';
import { RequestService } from '../../services/request.service';
import { IdeaCard } from '../../components/idea-card/idea-card';
import { RequestCard } from '../../components/request-card/request-card';
import { DatePipe } from '@angular/common';

type DashTab = 'overview' | 'listings' | 'purchases' | 'requests';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, IdeaCard, RequestCard, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  auth = inject(AuthService);
  private ideaService = inject(IdeaService);
  private requestService = inject(RequestService);
  private router = inject(Router);

  activeTab = signal<DashTab>('overview');

  constructor() {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/dashboard' } });
    }
  }

  myListings = computed(() => {
    const user = this.auth.currentUser();
    if (!user) return [];
    return this.ideaService.getBySellerId(user.id);
  });

  myPurchases = computed(() => {
    const user = this.auth.currentUser();
    if (!user) return [];
    return user.purchasedIdeaIds
      .map((id) => this.ideaService.getById(id))
      .filter((i) => i !== undefined);
  });

  myRequests = computed(() => {
    const user = this.auth.currentUser();
    if (!user) return [];
    return this.requestService
      .getAll()
      .filter((r) => r.requesterId === user.id);
  });

  availableListings = computed(() =>
    this.myListings().filter((i) => i.status === 'available')
  );

  soldListings = computed(() =>
    this.myListings().filter((i) => i.status === 'sold')
  );

  setTab(tab: DashTab): void {
    this.activeTab.set(tab);
  }
}
