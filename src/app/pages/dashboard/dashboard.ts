import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent {
  constructor(private readonly router: Router) {}

  logout() {
    // Eliminamos el token de acceso
    localStorage.removeItem('token');
    // Redirigimos de vuelta al login
    this.router.navigate(['/login']);
  }
}