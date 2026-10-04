import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CreateSaleItem {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface CreateSale {
  total: number;
  medioPago: string;
  usuarioId?: number;
  detalles: CreateSaleItem[];
}

@Injectable({
  providedIn: 'root',
})
export class SalesService {
  private apiUrl = 'http://localhost:3000/sales'; 

  constructor(private http: HttpClient) {}

  createSale(saleData: CreateSale): Observable<any> {
    return this.http.post<any>(this.apiUrl, saleData);
  }
}