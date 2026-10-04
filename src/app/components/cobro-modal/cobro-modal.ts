import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cobro-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cobro-modal.html',
  styleUrl:'./cobro-modal.css'
})
export class CobroModalComponent {
  // Input: Recibimos el total de la venta desde la pantalla del carrito
  totalAPagar = input.required<number>();

  // Eventos de salida: Confirmación o Cancelación
  cobroConfirmado = output<{ montoIngresado: number; vuelto: number }>();
  cancelado = output<void>();

  // Estado local del input
  montoIngresado = signal<number | null>(null);

  // Cálculo automático de la diferencia
  // Si el valor es positivo -> es vuelto a favor del cliente
  // Si el valor es negativo -> es dinero faltante
  diferencia = computed(() => {
    const pago = this.montoIngresado() ?? 0;
    return pago - this.totalAPagar();
  });

  // Helper para saber si el pago cubre el total
  pagoSuficiente = computed(() => {
    return (this.montoIngresado() ?? 0) >= this.totalAPagar();
  });

  confirmar() {
    if (this.pagoSuficiente()) {
      this.cobroConfirmado.emit({
        montoIngresado: this.montoIngresado()!,
        vuelto: this.diferencia()
      });
    }
  }

  cancelar() {
    this.cancelado.emit();
  }
}