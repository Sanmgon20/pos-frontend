// src/app/services/products.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Product {
  id: number;
  sku: number;
  name: string;
  price: number;
  stock?: number;
  stockMinimo?: number;
  activo?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly API_URL = 'http://localhost:3000/products';

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // Lectura (Cajeros y Admin)
  obtenerPorTermino(termino: string): Observable<Product> {
    return this.http.get<Product>(`${this.API_URL}/${termino}`, {
      headers: this.getHeaders(),
    });
  }

  // Acciones administrativas (Solo Admin)
  create(productData: Omit<Product, 'id'>): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post<any>(this.API_URL, productData, { headers });
  }

  getByTermino(termino: string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/${encodeURIComponent(termino)}`);
  }


  actualizarProducto(id: number, producto: Partial<Product>): Observable<Product> {
    return this.http.patch<Product>(`${this.API_URL}/${id}`, producto, {
      headers: this.getHeaders(),
    });
  }

  eliminarProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`, {
      headers: this.getHeaders(),
    });
  }
}