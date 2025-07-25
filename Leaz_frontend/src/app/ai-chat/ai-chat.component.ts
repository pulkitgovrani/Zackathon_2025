import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-ai-chat',
  templateUrl: './ai-chat.component.html',
  styleUrls: ['./ai-chat.component.scss'],
})
export class AiChatComponent {
  messages: { role: 'user' | 'ai'; content: string }[] = [];
  userInput = '';
  loading = false;

  constructor(private http: HttpClient) {}

  sendMessage() {
    if (!this.userInput.trim()) return;
    const message = this.userInput.trim();
    this.messages.push({ role: 'user', content: message });
    this.loading = true;
    this.http.post<any>('/api/ai-assistant/chat', { message }).subscribe(
      (res) => {
        const summary =
          res.aiResult && res.aiResult.action
            ? `Action: ${res.aiResult.action}, Binder: ${res.aiResult.binderName}`
            : '';
        this.messages.push({
          role: 'ai',
          content: summary || 'Action completed.',
        });
        this.loading = false;
      },
      (err) => {
        this.messages.push({
          role: 'ai',
          content: 'Sorry, something went wrong.',
        });
        this.loading = false;
      }
    );
    this.userInput = '';
  }
}
