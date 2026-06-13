import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Idea } from '../../models/idea.model';
import { StarRating } from '../star-rating/star-rating';

@Component({
  selector: 'app-idea-card',
  standalone: true,
  imports: [RouterLink, StarRating],
  templateUrl: './idea-card.html',
  styleUrl: './idea-card.scss',
})
export class IdeaCard {
  idea = input.required<Idea>();
}
