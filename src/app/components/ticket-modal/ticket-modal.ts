import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-ticket-modal',
  standalone: true, // Si tu componente es Standalone
  imports: [CommonModule], // <-- Agregar CommonModule acá
  templateUrl: './ticket-modal.html',
  styleUrls: ['./ticket-modal.css']
})
export class TicketModalComponent {
  @Input() sale: any = null;
  @Output() close = new EventEmitter<void>();

  printTicket(): void {
    window.print();
  }

  closeModal(): void {
    this.close.emit();
  }
}