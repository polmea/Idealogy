import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

export const MOCK_USERS: User[] = [
  {
    id: 'user1',
    email: 'alex@example.com',
    displayName: 'Alex Kim',
    avatar: 'AK',
    role: 'both',
    bio: 'Serial entrepreneur & ideator. I generate ideas faster than I can execute them.',
    totalEarnings: 2340,
    totalSpent: 890,
    rating: 4.8,
    reviewCount: 12,
    joinedAt: new Date('2024-01-15'),
    purchasedIdeaIds: ['idea3', 'idea7'],
    listedIdeaIds: ['idea1', 'idea2', 'idea5', 'idea8', 'idea10', 'idea12'],
  },
  {
    id: 'user2',
    email: 'sara@example.com',
    displayName: 'Sara Chen',
    avatar: 'SC',
    role: 'seller',
    bio: 'Creative strategist & UX thinker. Specializing in EdTech and social impact ideas.',
    totalEarnings: 1580,
    totalSpent: 0,
    rating: 4.6,
    reviewCount: 8,
    joinedAt: new Date('2024-03-22'),
    purchasedIdeaIds: [],
    listedIdeaIds: ['idea3', 'idea4', 'idea6', 'idea7', 'idea9', 'idea11'],
  },
  {
    id: 'user3',
    email: 'mike@example.com',
    displayName: 'Mike Torres',
    avatar: 'MT',
    role: 'buyer',
    bio: 'Startup investor looking for the next big thing. Always on the hunt for innovative ideas.',
    totalEarnings: 0,
    totalSpent: 1250,
    rating: 4.9,
    reviewCount: 5,
    joinedAt: new Date('2024-06-10'),
    purchasedIdeaIds: ['idea1', 'idea4'],
    listedIdeaIds: [],
  },
];

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);
  private _currentUser = signal<User | null>(this.loadUser());
  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoggedIn = computed(() => this._currentUser() !== null);

  private loadUser(): User | null {
    const id = localStorage.getItem('idealogy_user');
    if (!id) return null;
    return MOCK_USERS.find((u) => u.id === id) ?? null;
  }

  getMockUsers(): User[] {
    return MOCK_USERS;
  }

  login(userId: string): void {
    const user = MOCK_USERS.find((u) => u.id === userId);
    if (user) {
      localStorage.setItem('idealogy_user', userId);
      this._currentUser.set({ ...user });
    }
  }

  loginByEmail(email: string): boolean {
    const user = MOCK_USERS.find((u) => u.email === email);
    if (user) {
      localStorage.setItem('idealogy_user', user.id);
      this._currentUser.set({ ...user });
      return true;
    }
    return false;
  }

  register(data: {
    displayName: string;
    email: string;
    role: 'buyer' | 'seller' | 'both';
  }): User {
    const initials = data.displayName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    const newUser: User = {
      id: 'user_' + Date.now(),
      email: data.email,
      displayName: data.displayName,
      avatar: initials,
      role: data.role,
      bio: '',
      totalEarnings: 0,
      totalSpent: 0,
      rating: 0,
      reviewCount: 0,
      joinedAt: new Date(),
      purchasedIdeaIds: [],
      listedIdeaIds: [],
    };
    MOCK_USERS.push(newUser);
    localStorage.setItem('idealogy_user', newUser.id);
    this._currentUser.set(newUser);
    return newUser;
  }

  logout(): void {
    localStorage.removeItem('idealogy_user');
    this._currentUser.set(null);
    this.router.navigate(['/']);
  }

  updateCurrentUser(updates: Partial<User>): void {
    const user = this._currentUser();
    if (user) {
      const updated = { ...user, ...updates };
      const idx = MOCK_USERS.findIndex((u) => u.id === user.id);
      if (idx !== -1) MOCK_USERS[idx] = updated;
      this._currentUser.set(updated);
    }
  }

  getUserById(id: string): User | undefined {
    return MOCK_USERS.find((u) => u.id === id);
  }
}
