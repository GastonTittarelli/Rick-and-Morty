import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlertMessage, MessageService } from './service/messages.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'mi-proyecto-angular';
  alert$!: Observable<AlertMessage | null>;

  constructor(private messageService: MessageService) {
    this.alert$ = this.messageService.alert$;
  }
}
