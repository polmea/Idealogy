import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { IdeaRequest } from '../../models/idea-request.model';

@Component({
  selector: 'app-request-card',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './request-card.html',
  styleUrl: './request-card.scss',
})
export class RequestCard {
  request = input.required<IdeaRequest>();
}
