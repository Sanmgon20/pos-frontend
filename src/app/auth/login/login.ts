import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  isRegisterMode = false;
  errorMessage = '';

  loginData = {
    legajo: null as number | null,
    password: ''
  };

  registerData = {
    legajo: null as number | null,
    name: '',
    password: '',
    rol: 'ADMIN' as 'ADMIN' | 'CASHIER'
  };

  toggleMode(): void {
    this.isRegisterMode = !this.isRegisterMode;
    this.errorMessage = '';
  }

  onLogin(): void {
  if (!this.loginData.legajo || !this.loginData.password) {
    this.errorMessage = 'Por favor, completá legajo y contraseña.';
    return;
  }

  this.authService.login({
    legajo: Number(this.loginData.legajo),
    password: this.loginData.password.trim()
  }).subscribe({
    next: () => {
      // El AuthService ya guardó 'token' y 'user' en el localStorage durante el pipe(tap)
      this.router.navigate(['/dashboard']);
    },
    error: (err) => {
      this.errorMessage = err.error?.responseMessage?.message || 'Error al iniciar sesión';
    }
  });
}
  
 onRegister(): void {
  const legajoNum = Number(this.registerData.legajo);

  if (!this.registerData.legajo || Number.isNaN(legajoNum) || !this.registerData.name || !this.registerData.password) {
    this.errorMessage = 'Por favor, completá todos los campos del registro con un legajo válido.';
    return;
  }

  this.authService.register({
    legajo: legajoNum,
    name: this.registerData.name,
    password: this.registerData.password.trim(),
    rol: this.registerData.rol
  }).subscribe({
    next: () => {
      // Auto-login directo: el AuthService se encarga de interceptar la respuesta 
      // y guardar token y user en el localStorage automáticamente.
      this.authService.login({
        legajo: legajoNum,
        password: this.registerData.password.trim()
      }).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.isRegisterMode = false;
          this.errorMessage = 'Usuario creado con éxito. Por favor, iniciá sesión.';
        }
      });
    },
    error: (err) => {
      this.errorMessage = err.error?.responseMessage?.message || err.error?.message || 'Error al registrar el usuario';
    }
  });
}
}