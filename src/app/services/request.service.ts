import { Injectable, signal, inject } from '@angular/core';
import { IdeaRequest } from '../models/idea-request.model';
import { IdeaCategory } from '../models/idea.model';
import { AuthService } from './auth.service';

const MOCK_REQUESTS: IdeaRequest[] = [
  {
    id: 'req1',
    requesterId: 'user3',
    requesterName: 'Mike Torres',
    requesterAvatar: 'MT',
    title: 'B2B SaaS idea in the HR/Recruitment space',
    description:
      "Looking for AI-powered recruitment tools that solve bias in hiring or automate repetitive HR tasks. Need a complete idea with full monetization plan and technical roadmap.",
    category: 'business',
    budget: 500,
    status: 'open',
    responseCount: 3,
    createdAt: new Date('2025-05-28'),
  },
  {
    id: 'req2',
    requesterId: 'user1',
    requesterName: 'Alex Kim',
    requesterAvatar: 'AK',
    title: 'Creative fintech idea targeting Gen Z',
    description:
      "Something that gamifies saving or investing for people aged 18-25. Not another budgeting app — something truly novel. Budget is flexible for the right idea.",
    category: 'tech',
    budget: 350,
    status: 'open',
    responseCount: 5,
    createdAt: new Date('2025-06-01'),
  },
  {
    id: 'req3',
    requesterId: 'user3',
    requesterName: 'Mike Torres',
    requesterAvatar: 'MT',
    title: 'Health & Wellness app for corporate employees',
    description:
      'B2B wellness platform that can be sold to companies as an employee benefit. Must include both mental health and physical wellness components. Looking for detailed GTM strategy.',
    category: 'health',
    budget: 700,
    status: 'fulfilled',
    responseCount: 8,
    createdAt: new Date('2025-04-15'),
  },
  {
    id: 'req4',
    requesterId: 'user1',
    requesterName: 'Alex Kim',
    requesterAvatar: 'AK',
    title: 'Social commerce idea for independent creators',
    description:
      'Looking for a platform idea that helps independent creators monetize their audience in a new way beyond subscriptions and merch. Should leverage community dynamics.',
    category: 'creative',
    budget: 250,
    status: 'open',
    responseCount: 2,
    createdAt: new Date('2025-06-08'),
  },
];

@Injectable({ providedIn: 'root' })
export class RequestService {
  private authService = inject(AuthService);
  private _requests = signal<IdeaRequest[]>(MOCK_REQUESTS);
  readonly requests = this._requests.asReadonly();

  getAll(): IdeaRequest[] {
    return this._requests();
  }

  getOpen(): IdeaRequest[] {
    return this._requests().filter((r) => r.status === 'open');
  }

  createRequest(data: {
    title: string;
    description: string;
    category: IdeaCategory;
    budget: number;
  }): IdeaRequest | null {
    const user = this.authService.currentUser();
    if (!user) return null;
    const newRequest: IdeaRequest = {
      id: 'req_' + Date.now(),
      requesterId: user.id,
      requesterName: user.displayName,
      requesterAvatar: user.avatar,
      ...data,
      status: 'open',
      responseCount: 0,
      createdAt: new Date(),
    };
    this._requests.update((reqs) => [...reqs, newRequest]);
    return newRequest;
  }
}
