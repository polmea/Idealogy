import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  name = signal('');
  email = signal('');
  message = signal('');
  submitted = signal(false);
  error = signal('');

  onSubmit(): void {
    if (!this.name().trim() || !this.email().trim() || !this.message().trim()) {
      this.error.set('Please fill in all fields before sending your message.');
      return;
    }

    this.error.set('');
    this.submitted.set(true);
    this.name.set('');
    this.email.set('');
    this.message.set('');
  }

  onNameInput(event: Event): void {
    this.name.set((event.target as HTMLInputElement).value);
  }

  onEmailInput(event: Event): void {
    this.email.set((event.target as HTMLInputElement).value);
  }

  onMessageInput(event: Event): void {
    this.message.set((event.target as HTMLTextAreaElement).value);
  }
}
