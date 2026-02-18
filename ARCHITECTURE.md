# 🏗️ Arquitectura del Sistema - Diagrama Visual

## 📐 Stack Tecnológico Completo

```
┌──────────────────────────────────────────────────────────────────┐
│                      FRONTEND (Vue 3 + Vite)                     │
│                     http://localhost:5173                        │
├──────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │  Dashboard   │  │ Embarcaciones│  │   Alertas    │           │
│  │  Views       │  │   Views      │  │   Views      │           │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘           │
│         │                 │                 │                    │
│         └─────────────────┴─────────────────┘                    │
│                           │                                      │
│                  ┌────────▼────────┐                             │
│                  │ services/api.js │ (15 métodos nuevos)         │
│                  └────────┬────────┘                             │
└───────────────────────────┼──────────────────────────────────────┘
                            │ HTTP + JSON
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│                  BACKEND (Node.js + Express)                     │
│                   http://localhost:5000/api                      │
├──────────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                         ROUTES                            │  │
│  │  /dashboard  /vessels  /positions  /zones  /alerts        │  │
│  └───────────────────────┬───────────────────────────────────┘  │
│                          │                                       │
│  ┌───────────────────────▼───────────────────────────────────┐  │
│  │                      CONTROLLERS                          │  │
│  │  • dashboard.controller.js  (KPIs normalizados)           │  │
│  │  • vessels.controller.js    (Búsqueda + detalles)         │  │
│  │  • positions.controller.js  (Tracks/posiciones)           │  │
│  │  • zones.controller.js      (CRUD zonas)                  │  │
│  │  • alerts.controller.js     (Detección + gestión)         │  │
│  └───────────────────────┬───────────────────────────────────┘  │
│                          │                                       │
│         ┌────────────────┴────────────────┐                     │
│         │                                 │                     │
│  ┌──────▼───────┐              ┌──────────▼─────────┐           │
│  │   SERVICES   │              │       MODELS       │           │
│  ├──────────────┤              ├────────────────────┤           │
│  │ gfw.service  │              │ Zone (GeoJSON)     │           │
│  │ (GFW Proxy)  │              │ Alert (Eventos)    │           │
│  │              │              │                    │           │
│  │ geofencing   │              │ User (Auth)        │           │
│  │ (Algoritmos) │              └──────────┬─────────┘           │
│  └──────┬───────┘                         │                     │
│         │                                 │                     │
└─────────┼─────────────────────────────────┼─────────────────────┘
          │                                 │
          │ HTTPS                           │ Mongoose
          ▼                                 ▼
┌──────────────────────┐       ┌───────────────────────┐
│  Global Fishing      │       │      MongoDB          │
│  Watch API (GFW)     │       │   security_phish DB   │
├──────────────────────┤       ├───────────────────────┤
│ gateway.api.gfw.org  │       │  Collections:         │
│                      │       │  • zones (2dsphere)   │
│ • Vessels Search     │       │  • alerts (indexed)   │
│ • Vessel Details     │       │  • users              │
│ • Tracks             │       └───────────────────────┘
│ • Fishing Events     │
│ • Activity           │
└──────────────────────┘
```

---

## 🔄 Flujo de Datos Detallado

### 1️⃣ Búsqueda de Embarcaciones

```
┌──────────────┐
│   Usuario    │ Escribe "Pacific Star"
└──────┬───────┘
       │
       ▼
┌─────────────────────────┐
│ ComponentEmbarcaciones  │ searchQuery.value = "Pacific Star"
│        .vue             │
└──────┬──────────────────┘
       │ searchVessels('Pacific Star', 0, 20)
       ▼
┌─────────────────────────┐
│  services/api.js        │ GET /api/vessels/search?query=...
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│  vessels.routes.js      │ router.get('/search', search)
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ vessels.controller.js   │ Validar parámetros
│      search()           │
└──────┬──────────────────┘
       │ gfwService.searchVessels(query)
       ▼
┌─────────────────────────┐
│  gfw.service.js         │ Token en headers
│  searchVessels()        │
└──────┬──────────────────┘
       │ HTTPS Request
       ▼
┌─────────────────────────┐
│  Global Fishing Watch   │ API externa
│  vessels/search         │
└──────┬──────────────────┘
       │ JSON Response
       ▼
┌─────────────────────────┐
│ vessels.controller.js   │ Normalizar datos:
│                         │ { vessels: [...], total, offset }
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│  ComponentEmbarcaciones │ Renderizar tabla
│  vessels.value = [...]  │
└─────────────────────────┘
```

---

### 2️⃣ Detección de Alertas (Geofencing)

```
┌──────────────┐
│ Cron Job     │ Ejecutar cada hora
│ o Usuario    │
└──────┬───────┘
       │ runAlertRules(['vessel1', 'vessel2'])
       ▼
┌─────────────────────────┐
│  services/api.js        │ POST /api/alerts/run
│                         │ Body: { vesselIds: [...] }
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│  alerts.routes.js       │ router.post('/run', runAlertRules)
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ alerts.controller.js    │ 
│   runAlertRules()       │
└──────┬──────────────────┘
       │
       ├─1. Obtener zonas activas
       │   ▼
       │  ┌────────────────┐
       │  │ MongoDB        │ Zone.find({ active: true })
       │  └────────────────┘
       │   zones = [...]
       │
       ├─2. Por cada vesselId:
       │   ▼
       │  ┌─────────────────────┐
       │  │ gfw.service.js      │ getVesselTracks(vesselId)
       │  └─────────────────────┘
       │   tracks = [{ lat, lon, timestamp }]
       │
       ├─3. Por cada track:
       │   ▼
       │  ┌─────────────────────┐
       │  │ geofencing.service  │ getZonesContainingPoint()
       │  │ (point-in-polygon)  │
       │  └─────────────────────┘
       │   zonasDetectadas = [...]
       │
       ├─4. Si zona.level === 'high':
       │   ▼
       │  ┌─────────────────────┐
       │  │ Alert.js (Modelo)   │ new Alert({ type: 'zone_violation' })
       │  │ MongoDB             │ await alert.save()
       │  └─────────────────────┘
       │
       ├─5. Detectar permanencia:
       │   ▼
       │  ┌─────────────────────┐
       │  │ geofencing.service  │ detectProlongedStay(tracks, zone, 30)
       │  └─────────────────────┘
       │   isProlonged = true/false
       │
       └─6. Crear alerta si isProlonged
           ▼
          ┌─────────────────────┐
          │ MongoDB             │ save Alert({ type: 'prolonged_stay' })
          └─────────────────────┘
       
       ▼
┌─────────────────────────┐
│  Response               │ {
│                         │   vesselsProcessed: 2,
│                         │   alertsCreated: 3,
│                         │   alerts: [...]
└─────────────────────────┘ }
```

---

### 3️⃣ Crear Zona Protegida

```
┌──────────────┐
│   Usuario    │ Dibuja polígono en mapa
└──────┬───────┘
       │ GeoJSON coordinates capturadas
       ▼
┌─────────────────────────┐
│ ComponentZonas          │ createZone({ name, level, geometry })
│ Protegidas.vue          │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│  services/api.js        │ POST /api/zones
│                         │ Body: { name, geometry, ... }
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│  zones.routes.js        │ router.post('/', create)
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ zones.controller.js     │ Validar geometry.type === 'Polygon'
│      create()           │
└──────┬──────────────────┘
       │
       ├─ Calcular área
       │  ▼
       │ ┌─────────────────────┐
       │ │ geofencing.service  │ calculatePolygonArea(coordinates)
       │ │ (Shoelace formula)  │
       │ └─────────────────────┘
       │  area = 125.34 km²
       │
       └─ Crear documento
          ▼
         ┌─────────────────────┐
         │ Zone.js (Modelo)    │ new Zone({
         │                     │   name, geometry, area,
         │ MongoDB             │   level, levelLabel, icon
         │ 2dsphere index      │ })
         └─────────────────────┘
       
       ▼
┌─────────────────────────┐
│  Response               │ {
│                         │   id, name, area: "125.34",
│                         │   geometry, active: true
└─────────────────────────┘ }
       
       ▼
┌─────────────────────────┐
│ ComponentZonas          │ Zona aparece en mapa
│ zones.value.push(...)   │
└─────────────────────────┘
```

---

## 🔐 Seguridad en Capas

```
┌─────────────────────────────────────────────────┐
│            FRONTEND (Público)                   │
│  ❌ Sin token GFW (solo llamadas a backend)     │
│  ✅ Validación básica de entrada                │
└─────────────────┬───────────────────────────────┘
                  │ HTTPS
                  ▼
┌─────────────────────────────────────────────────┐
│            BACKEND (Seguro)                     │
│  ✅ Token GFW en .env (oculto)                  │
│  ✅ Validación de parámetros                    │
│  ✅ CORS restrictivo (localhost:5173)           │
│  ✅ Autenticación JWT en rutas protegidas       │
└─────────────────┬───────────────────────────────┘
                  │
         ┌────────┴────────┐
         │                 │
         ▼                 ▼
┌───────────────┐  ┌──────────────┐
│  GFW API      │  │   MongoDB    │
│  (Bearer JWT) │  │  (Local DB)  │
└───────────────┘  └──────────────┘
```

---

## 📦 Estructura de Datos

### Zone (MongoDB)

```javascript
{
  _id: ObjectId("64f123..."),
  name: "Reserva Marina del Pacífico",
  description: "Zona de reproducción de tortugas",
  level: "high",                    // Restricción
  levelLabel: "Restricción Alta",
  icon: "dangerous",                // Material Icon
  geometry: {                       // GeoJSON
    type: "Polygon",
    coordinates: [[
      [-90.5, 15.2],  // [lon, lat]
      [-90.3, 15.2],
      [-90.3, 15.4],
      [-90.5, 15.4],
      [-90.5, 15.2]
    ]]
  },
  area: 125.34,                     // km² (auto-calculado)
  boats: 3,                         // Contador
  active: true,
  createdBy: "admin@sistema.com",
  createdAt: ISODate("2024-01-12T10:00:00Z"),
  updatedAt: ISODate("2024-01-12T10:00:00Z")
}
```

**Índices:**
- `geometry`: 2dsphere (búsqueda geoespacial)
- `active`: 1 (filtro rápido)

---

### Alert (MongoDB)

```javascript
{
  _id: ObjectId("64f789..."),
  priority: "high",                 // high | medium | low
  type: "zone_violation",           // Tipo de alerta
  title: "Embarcación en Zona Prohibida",
  description: "La embarcación XYZ123 ha ingresado...",
  vesselId: "abc123...",            // ID GFW
  vesselName: "PACIFIC STAR",
  location: "Reserva Marina del Pacífico",
  coordinates: {
    lat: 15.3,
    lon: -90.4
  },
  zoneId: ObjectId("64f123..."),    // Referencia a Zone
  zoneName: "Reserva Marina del Pacífico",
  status: "active",                 // active | resolved | dismissed
  resolvedAt: null,
  resolvedBy: null,
  metadata: {
    timestamp: "2024-01-12T14:35:00Z",
    speed: 5.2
  },
  createdAt: ISODate("2024-01-12T14:35:00Z"),
  updatedAt: ISODate("2024-01-12T14:35:00Z")
}
```

**Índices:**
- `{ priority: 1, status: 1 }` (consultas combinadas)
- `vesselId`: 1 (búsqueda por embarcación)
- `createdAt`: -1 (orden cronológico)

---

## 🎯 Puntos Clave de Integración

### 1. Proxy Seguro (gfw.service.js)

```javascript
const axiosGFW = axios.create({
  baseURL: 'https://gateway.api.globalfishingwatch.org/v3',
  headers: {
    Authorization: `Bearer ${process.env.GFW_TOKEN}`,  // 🔒 Token oculto
  },
});

export const searchVessels = async (query, offset = 0, limit = 20) => {
  const response = await axiosGFW.get('/vessels/search', {
    params: { query, offset, limit },
  });
  return response.data;
};
```

**Ventaja:** Frontend NUNCA ve el token.

---

### 2. Geofencing (geofencing.service.js)

```javascript
export const isPointInPolygon = (point, polygon) => {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];
    
    const intersect = ((yi > point.lat) !== (yj > point.lat)) &&
      (point.lon < (xj - xi) * (point.lat - yi) / (yj - yi) + xi);
    
    if (intersect) inside = !inside;
  }
  return inside;
};
```

**Ventaja:** Sin librerías externas, 100% nativo.

---

### 3. Normalización de Datos (controllers)

```javascript
// GFW retorna estructura compleja
const gfwResponse = {
  entries: [
    {
      registryInfo: [{ name: "PACIFIC STAR" }],
      selfReportedInfo: [{ flag: "USA" }]
    }
  ]
};

// Controller normaliza a formato UI
const normalized = {
  vessels: [
    {
      id: "abc123",
      name: "PACIFIC STAR",
      flag: "USA"
    }
  ]
};
```

**Ventaja:** Frontend recibe datos listos para usar.

---

## 📈 Performance

### Índices MongoDB

```javascript
// Zone.js
schema.index({ geometry: '2dsphere' });  // O(log n) búsqueda espacial
schema.index({ active: 1 });             // O(1) filtro booleano

// Alert.js
schema.index({ priority: 1, status: 1 }); // Consulta combinada
schema.index({ vesselId: 1 });            // O(log n) búsqueda por ID
schema.index({ createdAt: -1 });          // Ordenamiento cronológico
```

### Paginación

```javascript
// Evita cargar miles de resultados
const offset = parseInt(req.query.offset) || 0;
const limit = parseInt(req.query.limit) || 20;  // Máximo 20 por página
```

---

## ✅ Checklist de Integración

### Backend
- [x] Token GFW en `.env`
- [x] Modelos MongoDB con índices
- [x] Servicios GFW y geofencing
- [x] 5 controladores creados
- [x] 5 archivos de rutas
- [x] Rutas registradas en `server.js`

### Frontend
- [x] `services/api.js` actualizado
- [ ] Componentes Vue actualizados
- [ ] Mapa integrado (Leaflet/Mapbox)
- [ ] Alertas en tiempo real

### Pruebas
- [ ] Servidor inicia sin errores
- [ ] Endpoints responden correctamente
- [ ] MongoDB conecta
- [ ] GFW API retorna datos

---

**🎯 Arquitectura completa implementada y documentada.**
