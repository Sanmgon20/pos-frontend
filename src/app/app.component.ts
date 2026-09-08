import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <div style="padding: 20px; font-family: sans-serif;">
      <h2>Prueba de Conexión: Front & Back</h2>

      <button (click)="obtenerUsuarios()" style="padding: 10px 15px; cursor: pointer; margin-bottom: 20px;">
        Traer Usuarios de NestJS
      </button>

      <div style="display: flex; gap: 20px;">
        <!-- Cuadradito 1: Estado / Respuesta cruda -->
        <div style="border: 2px solid #333; padding: 15px; width: 300px; border-radius: 8px; background-color: #f9f9f9;">
          <h3>Respuesta Backend</h3>
          <p><strong>Estado:</strong> {{ estado }}</p>
        </div>

        <!-- Cuadradito 2: Lista de Usuarios -->
        <div style="border: 2px solid #007acc; padding: 15px; width: 300px; border-radius: 8px; background-color: #eef7ff;">
          <h3>Lista de Usuarios</h3>
          @if (usuarios.length === 0) {
            <p><i>La lista está vacía. Hacé clic en el botón.</i></p>
          } @else {
            <ul>
              @for (u of usuarios; track u.id) {
                <li><strong>{{ u.name }}</strong> ({{ u.rol }})</li>
              }
            </ul>
          }
        </div>
      </div>
    </div>
  `,
})
export class AppComponent {
  private http = inject(HttpClient);

  usuarios: any[] = [];
  estado: string = 'Esperando acción...';

  obtenerUsuarios() {
    this.estado = 'Cargando...';
    
    // Petición al backend NestJS
    this.http.get<any>('http://localhost:3000/users').subscribe({
      next: (res) => {
        // Recordá que tu Interceptor envuelve la respuesta en { data: [...] }
        this.usuarios = res.data;
        this.estado = '¡Conexión Exitosa! 200 OK';
      },
      error: (err) => {
        console.error(err);
        this.estado = 'Error de conexión (¿Está prendido NestJS?)';
      },
    });
  }
}