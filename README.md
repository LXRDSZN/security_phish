<div align="center">

# 🛡️ Security Phish - Sistema de Monitoreo Marítimo

<img src="https://img.shields.io/badge/Vue.js-3.4.29-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white" alt="Vue.js"/>
<img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"/>
<img src="https://img.shields.io/badge/MongoDB-8.14.1-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
<img src="https://img.shields.io/badge/Vite-6.2.6-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>

### 🌊 Plataforma de monitoreo y análisis de actividad pesquera en tiempo real

[Características](#-características-principales) • [Instalación](#-instalación) • [Uso](#-uso) • [Arquitectura](#-arquitectura)

</div>

---

## 🎯 Descripción del Proyecto

**Security Phish** es una aplicación web de vanguardia diseñada para el **monitoreo, análisis y gestión de embarcaciones pesqueras** mediante integración con **Global Fishing Watch (GFW)**. El sistema permite rastrear posiciones de barcos, definir zonas de seguridad, detectar intrusiones y generar alertas en tiempo real.

### ✨ Características Principales

<table>
<tr>
<td width="50%">

#### 📊 **Dashboard Interactivo**
- 📈 KPIs en tiempo real (embarcaciones activas, alertas, zonas)
- 🗺️ Mapa de calor de actividad pesquera
- 📉 Gráficos de evolución temporal
- 🎯 Métricas de rendimiento del sistema

</td>
<td width="50%">

#### 🚢 **Gestión de Embarcaciones**
- 🔍 Búsqueda avanzada por nombre, MMSI, IMO
- 📍 Tracking de posiciones GPS en tiempo real
- 🛰️ Historial de trayectorias (tracks)
- 📋 Información detallada de cada barco

</td>
</tr>
<tr>
<td width="50%">

#### 🔔 **Sistema de Alertas**
- ⚠️ Detección automática de intrusiones
- 🚨 Clasificación por niveles de riesgo
- 📮 Notificaciones en tiempo real
- ✅ Gestión de estado (pendiente/resuelta)

</td>
<td width="50%">

#### 🗺️ **Zonas de Seguridad**
- 🎨 Creación de polígonos GeoJSON personalizados
- 🛡️ Definición de zonas restringidas
- 🔄 CRUD completo de zonas
- 🧮 Algoritmos de geofencing avanzados

</td>
</tr>
</table>

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                    🎨 FRONTEND (Vue 3 + Vite)                   │
│                      http://localhost:5173                      │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │ 📊 Dashboard│  │ 🚢 Barcos   │  │ 🔔 Alertas  │             │
│  │   Views     │  │   Views     │  │   Views     │             │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘             │
│         └─────────────────┴────────────────┘                    │
│                           │                                     │
│                  ┌────────▼────────┐                            │
│                  │  API Services   │                            │
│                  │   (Axios)       │                            │
│                  └────────┬────────┘                            │
└───────────────────────────┼─────────────────────────────────────┘
                            │ 🔄 HTTP REST API
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                 ⚙️ BACKEND (Node.js + Express)                  │
│                   http://localhost:5000/api                     │
├─────────────────────────────────────────────────────────────────┤
│  🛣️  ROUTES                                                     │
│     /dashboard │ /vessels │ /positions │ /zones │ /alerts      │
│                            │                                    │
│  🎛️  CONTROLLERS                                                │
│     Manejo de lógica de negocio y validaciones                 │
│                            │                                    │
│  🧰 SERVICES               │            📦 MODELS               │
│     • gfw.service.js       │            • Zone (GeoJSON)        │
│     • geofencing.service   │            • Alert (Eventos)       │
│                            │            • User (Auth JWT)       │
│                            ▼                                    │
│                    🍃 MongoDB Database                          │
└─────────────────────────────────────────────────────────────────┘
```

### 🔧 Stack Tecnológico

| Capa | Tecnologías |
|------|-------------|
| **Frontend** | Vue 3 • Vue Router • Axios • Vite • Toast Notifications |
| **Backend** | Node.js • Express 5 • JWT • Bcrypt • Zod • Morgan |
| **Base de Datos** | MongoDB • Mongoose • GeoJSON |
| **APIs Externas** | Global Fishing Watch (GFW) API |
| **Seguridad** | JWT Authentication • Cookie Parser • CORS • Bcrypt |

---

## 📦 Instalación

### 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- 🟢 **Node.js** (v18 o superior) - [Descargar](https://nodejs.org/)
- 🍃 **MongoDB** (v6 o superior) - [Descargar](https://www.mongodb.com/try/download/community)
- 📦 **npm** o **yarn** (incluido con Node.js)

### 🚀 Pasos de Instalación

1️⃣ **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/security-phish.git
cd Security_phish
```

2️⃣ **Instalar dependencias**
```bash
npm install
```

3️⃣ **Configurar variables de entorno**

Crea un archivo `.env` en la carpeta `src/backend/`:
```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/security_phish

# JWT Secret
JWT_SECRET=tu_clave_secreta_super_segura_aqui

# Global Fishing Watch API (opcional)
GFW_API_KEY=tu_api_key_de_gfw
```

4️⃣ **Inicializar la base de datos** (opcional)
```bash
node src/backend/init-test-data.js
```

---

## 🎮 Uso

### 🌐 Opción 1: Modo Desarrollo (Recomendado)

Esta opción inicia **frontend y backend en paralelo** con hot-reload activado.

#### 🎬 Terminal 1: Iniciar Frontend
```bash
npm run dev
```
✅ **Frontend corriendo en:** `http://localhost:5173`

#### 🎬 Terminal 2: Iniciar Backend
```bash
node src/backend/server.js
```
✅ **Backend API corriendo en:** `http://localhost:5000/api`

---

### 🖥️ Opción 2: Modo Producción

1️⃣ **Compilar el frontend**
```bash
npm run build
```

2️⃣ **Iniciar el servidor backend**
```bash
node src/backend/server.js
```

3️⃣ **Preview del build**
```bash
npm run preview
```

---

## 📡 Endpoints API Principales

### 🔐 Autenticación
```
POST   /api/register          # Registrar nuevo usuario
POST   /api/login             # Iniciar sesión (devuelve JWT)
POST   /api/logout            # Cerrar sesión
GET    /api/user              # Obtener perfil del usuario
```

### 📊 Dashboard
```
GET    /api/dashboard/kpis    # Obtener KPIs del sistema
```

### 🚢 Embarcaciones
```
GET    /api/vessels/search    # Buscar embarcaciones (query params)
GET    /api/vessels/:id       # Detalles de una embarcación
```

### 📍 Posiciones
```
GET    /api/positions/vessel/:vesselId   # Posiciones de un barco
GET    /api/positions/track/:vesselId    # Trayectoria completa
```

### 🗺️ Zonas
```
GET    /api/zones             # Listar todas las zonas
POST   /api/zones             # Crear nueva zona
PUT    /api/zones/:id         # Actualizar zona
DELETE /api/zones/:id         # Eliminar zona
```

### 🔔 Alertas
```
GET    /api/alerts            # Listar alertas (con filtros)
POST   /api/alerts/detect     # Detectar nuevas intrusiones
PUT    /api/alerts/:id        # Actualizar estado de alerta
```

---

## 🎨 Capturas de Pantalla

### 🖼️ Dashboard Principal
```
┌────────────────────────────────────────────────────────────┐
│  📊 KPIs                                                   │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐     │
│  │ 🚢 125  │  │ ⚠️ 12   │  │ 🗺️ 8    │  │ 📍 1.5K  │     │
│  │ Barcos  │  │ Alertas │  │ Zonas   │  │ Posic.  │     │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘     │
│                                                            │
│  🗺️ Mapa Interactivo                                      │
│  ┌──────────────────────────────────────────────────┐     │
│  │         [Visualización de Mapa Global]           │     │
│  │  • Embarcaciones en tiempo real                  │     │
│  │  • Zonas de seguridad dibujadas                  │     │
│  │  • Alertas marcadas en rojo                      │     │
│  └──────────────────────────────────────────────────┘     │
└────────────────────────────────────────────────────────────┘
```

---

## 🧪 Testing

```bash
# Ejecutar tests (si están configurados)
npm test

# Linter
npm run lint
```

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. 🍴 Haz un fork del proyecto
2. 🌿 Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. 💾 Commit tus cambios (`git commit -m 'Add: nueva funcionalidad'`)
4. 📤 Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. 🔀 Abre un Pull Request

---

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

## 👨‍💻 Autor

Desarrollado con ❤️ para la protección de los océanos 🌊

---

<div align="center">

### 🌟 ¡Dale una estrella si te resulta útil! ⭐

**[⬆ Volver arriba](#-security-phish---sistema-de-monitoreo-marítimo)**

</div>
