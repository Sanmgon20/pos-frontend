# POS System - Frontend 🛒

> ⚠️ **Estado del proyecto:** En desarrollo activo (Fase de integración de checkout y cobro por QR).

Aplicación web de Punto de Venta (POS) desarrollada con **Angular 19** que interactúa con un backend en **NestJS**. Permite la búsqueda dinámica de productos por SKU o nombre, gestión de ticket de compra en tiempo real y modal de cobro con código QR.

---

## 🚀 Tecnologías utilizadas

* **Framework:** Angular (Standalone Components)
* **Lenguaje:** TypeScript
* **Estilos:** CSS3
* **Cliente HTTP:** HttpClient (con integración de Bearer Tokens)
* **Backend compatible:** NestJS + TypeORM + SQLite

---

## 📌 Funcionalidades principales

* 🔍 **Búsqueda flexible:** Búsqueda de productos por ID, SKU o coincidencia parcial de nombre.
* 🧾 **Ticket dinámico:** Cálculo automático de subtotales y total global, con opción de eliminar ítems.
* 📱 **Cobro por QR:** Modal interactivo que genera un código QR para cobros de Mercado Pago.
* 🛡️ **Manejo defensivo de datos:** Parseo de respuestas envueltas en estructuras tipo `ApiResponse`.

---

## ⚙️ Instalación y ejecución

1. Clonar el repositorio:
   ```bash
   git clone [https://github.com/Sanmgon20/pos-frontend.git](https://github.com/Sanmgon20/pos-frontend.git).

2. Bash
    npm install

3. Bash
    ng serve

4. Abrir en el navegador: http://localhost:4200/   