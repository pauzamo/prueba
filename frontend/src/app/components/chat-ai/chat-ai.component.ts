import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { AiService, ChatMessage } from '../../services/ai.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../home/sections/navbar/navbar.component';
import { FooterComponent } from '../../home/sections/footer/footer.component';


@Component({
  standalone: true,
  selector: 'app-chat-ai',
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './chat-ai.component.html',
  styleUrls: ['./chat-ai.component.css'],
  
})
export class ChatAiComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  
  messages: ChatMessage[] = [];
  userInput: string = '';
  isLoading: boolean = false;
  error: string = '';
  
  suggestedPrompts = [
    '¿Cuáles son los libros más vendidos de 2024?',
    'Recomiéndame un libro de ciencia ficción',
    'Busco un libro de romance contemporáneo',
    '¿Qué libro me recomiendas para regalar?'
  ];

  constructor(private aiService: AiService) { }

  ngOnInit(): void {
    this.messages.push({
      role: 'assistant',
      content: '¡Hola! Soy tu asistente de BiblioApp. Estoy aquí para ayudarte a encontrar el libro perfecto. ¿Qué tipo de libro te gustaría explorar hoy?',
      timestamp: new Date()
    });
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  sendMessage(message?: string): void {
    const messageToSend = message || this.userInput.trim();
    
    if (!messageToSend) return;

    this.messages.push({
      role: 'user',
      content: messageToSend,
      timestamp: new Date()
    });

    this.userInput = '';
    this.isLoading = true;
    this.error = '';

    this.aiService.sendMessage(messageToSend, this.messages).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.messages.push({
            role: 'assistant',
            content: response.message,
            timestamp: new Date()
          });
        } else {
          this.error = response.message;
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.error = 'Error al conectar con el servidor. Por favor, intenta nuevamente.';
        console.error('Error:', err);
      }
    });
  }

  useSuggestedPrompt(prompt: string): void {
    this.sendMessage(prompt);
  }

  clearChat(): void {
    this.messages = [{
      role: 'assistant',
      content: '¡Hola! Soy tu asistente de BiblioApp. Estoy aquí para ayudarte a encontrar el libro perfecto. ¿Qué tipo de libro te gustaría explorar hoy?',
      timestamp: new Date()
    }];
    this.error = '';
  }

  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop = 
        this.messagesContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  formatMessage(text: string): string {
  return text
    // Negritas
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Cursivas
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Listas con guiones
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    // Envolver listas en <ul>
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    // Saltos de línea dobles = párrafos
    .replace(/\n\n/g, '</p><p>')
    // Saltos de línea simples
    .replace(/\n/g, '<br>')
    // Envolver en párrafo si no hay ya
    .replace(/^(?!<p>|<ul>)(.+)/gm, '<p>$1</p>')
    // Limpiar párrafos vacíos
    .replace(/<p><\/p>/g, '');
}
}