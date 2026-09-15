import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  // Modelos de datos para binding bidireccional ([(ngModel)])
  loginData = {
    legajo: null,
    password: '',
  };

  isRegisterMode = false;

  registerData = {
    legajo: '',
    name: '',
    password: '',
    rol: 'Cajero',
  };

  errorMessage = '';

  private readonly API_URL = 'http://localhost:3000/auth';

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
  ) {}

  toggleMode() {
    this.isRegisterMode = !this.isRegisterMode;
    this.errorMessage = '';
  }

  onLogin() {
    const payload = {
    // Number() o el operador + convierte el string "1003" al número 1003
    legajo: Number(this.loginData.legajo), 
    password: this.loginData.password
  };

    this.http.post(`${this.API_URL}/login`, payload).subscribe({
      next: (res: any) => {
        // Guardamos el token JWT en el almacenamiento local del navegador
        localStorage.setItem('token', res.access_token);
        console.log('Login exitoso:', res);
        // Redirigir a la pantalla principal del POS
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Credenciales inválidas';
      },
    });
  }

  onRegister() {
    const payload = {
    legajo: Number(this.registerData.legajo),
    name: this.registerData.name,
    password: this.registerData.password,
    rol: this.registerData.rol,
  };

    this.http.post(`${this.API_URL}/register`, payload).subscribe({
      next: (res) => {
        console.log('Usuario registrado:', res);
        alert('Usuario registrado con éxito. Ahora podés iniciar sesión.');
        this.toggleMode(); // Cambiamos de pantalla al login
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al registrar usuario';
      },
    });
  }
}