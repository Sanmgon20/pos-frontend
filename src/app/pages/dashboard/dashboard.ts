import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface ItemTicket {
  id: number;
  sku: number;
  name: string;
  price: number;
  cantidad: number;
  subtotal: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent {
  private readonly API_URL = 'http://localhost:3000/products';
  
  terminoBusqueda: string = '';
  ticket: ItemTicket[] = [];
  errorMessage: string = '';

  // Control del modal de pago QR
  mostrarModalQR: boolean = false;
  qrUrl: string = '';

  constructor(private http: HttpClient) {}

  agregarProducto() {
    if (!this.terminoBusqueda.trim()) return;

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<any>(`${this.API_URL}/${this.terminoBusqueda.trim()}`, { headers }).subscribe({
      next: (res) => {
        this.errorMessage = '';
        const producto = res.data || res;
        this.insertarEnTicket(producto);
        this.terminoBusqueda = '';
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Producto no encontrado';
      }
    });
  }

  private insertarEnTicket(productoRaw: any) {
    const producto = productoRaw.data ? productoRaw.data : productoRaw;

    const productoId = Number(producto.id);
    const precioNum = Number(producto.price) || 0;

    const index = this.ticket.findIndex(item => item.id === productoId);

    if (index !== -1) {
      this.ticket[index].cantidad += 1;
      this.ticket[index].subtotal = this.ticket[index].cantidad * this.ticket[index].price;
    } else {
      this.ticket.push({
        id: productoId,
        sku: producto.sku,
        name: producto.name,
        price: precioNum,
        cantidad: 1,
        subtotal: precioNum
      });
    }
  }

  quitarItem(index: number) {
    this.ticket.splice(index, 1);
  }

  get totalVenta(): number {
    return this.ticket.reduce((sum, item) => sum + item.subtotal, 0);
  }

  // --- SECCIÓN COBROS ---

  abrirPagoQR() {
    if (this.ticket.length === 0) return;

    // Link de cobro o Alias de Mercado Pago
    const mercadoPagoLink = 'j'//'link.mercadopago.com.ar/sanmgon'; 
    
    // Generación dinámica del QR
    this.qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(mercadoPagoLink)}`;
    this.mostrarModalQR = true;
  }

  cerrarModalQR() {
    this.mostrarModalQR = false;
  }

  confirmarVenta() {
    // Limpiamos el ticket al finalizar el cobro
    this.ticket = [];
    this.mostrarModalQR = false;
  }
}