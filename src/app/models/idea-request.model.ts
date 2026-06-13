import { IdeaCategory } from './idea.model';

export type RequestStatus = 'open' | 'fulfilled' | 'closed';

export interface IdeaRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterAvatar: string;
  title: string;
  description: string;
  category: IdeaCategory;
  budget: number;
  status: RequestStatus;
  responseCount: number;
  createdAt: Date;
}
