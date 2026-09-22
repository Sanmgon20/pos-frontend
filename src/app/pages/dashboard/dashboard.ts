import { Component, inject, OnInit,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export interface ItemTicket {
  id: number;
  sku: string;
  name: string;
  cantidad: number;
  price: number;
  subtotal: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);
  private readonly cdr = inject(ChangeDetectorRef);

  private readonly API_PRODUCTS = 'http://localhost:3000/products';

  // Variables del estado del POS
  terminoBusqueda = '';
  errorMessage = '';
  ticket: ItemTicket[] = [];

  // Variables para modales
  mostrarModalCrearProducto = false;
  mostrarModalQR = false;
  mostrarModalEfectivo = false;
  qrUrl = '';

  ngOnInit(): void {
    // Verificación de sesión al iniciar
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/login']);
    }
  }

  // --- GETTERS PARA ROL Y DATOS DEL USUARIO ---
  get usuario() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  get esAdmin(): boolean {
    return this.usuario?.rol === 'ADMIN';
  }

  // --- CÁLCULO DEL TOTAL ---
  get totalVenta(): number {
    return this.ticket.reduce((acc, item) => acc + item.subtotal, 0);
  }

  // --- LÓGICA DE AGREGAR PRODUCTOS CON BBDD (NestJS + TypeORM) ---
  agregarProducto(): void {
    const termino = this.terminoBusqueda.trim();

    if (!termino) {
      this.errorMessage = 'Ingrese SKU, ID o Nombre del producto.';
      return;
    }

    this.errorMessage = '';

    // 1. Si el producto ya está en el ticket actual, incrementamos la cantidad localmente
    const itemExistente = this.ticket.find(
      i => String(i.sku).toLowerCase() === termino.toLowerCase() || 
           i.name.toLowerCase() === termino.toLowerCase()
    );

    if (itemExistente) {
      itemExistente.cantidad += 1;
      itemExistente.subtotal = itemExistente.cantidad * itemExistente.price;
      this.terminoBusqueda = '';
      return;
    }

    // 2. Si no está en el ticket, consultamos al endpoint @Get(':termino') de NestJS
    this.http.get<any>(`${this.API_PRODUCTS}/${encodeURIComponent(termino)}`).subscribe({
      next: (res) => {
        // Desenvolvemos 'data' en caso de venir mediante un interceptor/response wrapper
        const producto = res.data ? res.data : res;

        if (!producto) {
          this.errorMessage = `Producto "${termino}" no encontrado.`;
          return;
        }

        // Insertamos en el ticket usando los campos de la entidad de SQLite
        const precio = Number(producto.price);

        const nuevoItem: ItemTicket = {
          id: producto.id,
          sku: String(producto.sku),
          name: producto.name,
          cantidad: 1,
          price: precio,
          subtotal: precio
        };

        this.ticket.push(nuevoItem);
        this.terminoBusqueda = ''; // Limpiamos el input
        this.cdr.detectChanges();
      },
      error: (err) => {
        if (err.status === 404) {
          this.errorMessage = `El producto "${termino}" no existe o está inactivo.`;
        } else {
          this.errorMessage = 'Error al consultar el servidor.';
        }
      }
    });
  }

  quitarItem(index: number): void {
    this.ticket.splice(index, 1);
  }

  // --- ACCIONES ADMIN Y PAGO ---
  abrirModalCrearProducto(): void {
    console.log('Abrir modal de nuevo producto');
  }

  abrirPagoEfectivo(): void {
    this.mostrarModalEfectivo = true;
  }

  cerrarModalEfectivo(): void {
    this.mostrarModalEfectivo = false;
  }

  abrirPagoQR(): void {
    this.mostrarModalQR = true;
  }

  cerrarModalQR(): void {
    this.mostrarModalQR = false;
  }

  confirmarVenta(): void {
    alert('Venta realizada con éxito');
    this.ticket = [];
    this.cerrarModalQR();
    this.cerrarModalEfectivo();
  }

  confirmarVentaEfectivo(event: any): void {
    this.confirmarVenta();
  }

  // --- CERRAR SESIÓN ---
  onLogout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}