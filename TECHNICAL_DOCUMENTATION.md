# 📊 Documentación Técnica - Modelo de Datos y Flujos

## 🗄️ Esquemas MongoDB

### 1. Modelo: Zone (Zonas Protegidas)

```javascript
{
  _id: ObjectId,
  name: String,                    // "Reserva Marina del Pacífico"
  description: String,             // Descripción opcional
  level: String,                   // "high" | "medium" | "low"
  levelLabel: String,              // "Restricción Alta", etc.
  icon: String,                    // "dangerous", "warning", "visibility"
  geometry: {                      // GeoJSON
    type: "Polygon",
    coordinates: [[[lon, lat], ...]]
  },
  area: Number,                    // km² (calculado automáticamente)
  boats: Number,                   // Contador de embarcaciones detectadas
  active: Boolean,                 // true/false
  createdBy: String,               // Usuario que la creó
  createdAt: Date,
  updatedAt: Date
}
```

**Índices:**
- `geometry` → 2dsphere (búsqueda geoespacial)
- `active` → 1 (filtro rápido)

---

### 2. Modelo: Alert (Alertas)

```javascript
{
  _id: ObjectId,
  priority: String,                // "high" | "medium" | "low"
  type: String,                    // "zone_violation" | "prolonged_stay" | etc.
  title: String,                   // "Embarcación en Zona Prohibida"
  description: String,             // Detalles del evento
  vesselId: String,                // ID GFW de la embarcación
  vesselName: String,              // Nombre de la embarcación
  location: String,                // Nombre de la zona
  coordinates: {
    lat: Number,
    lon: Number
  },
  zoneId: ObjectId,                // Referencia a Zone
  zoneName: String,
  status: String,                  // "active" | "resolved" | "dismissed"
  resolvedAt: Date,
  resolvedBy: String,
  metadata: Object,                // Datos adicionales
  createdAt: Date,
  updatedAt: Date
}
```

**Índices:**
- `{ priority: 1, status: 1 }` → Filtro combinado
- `vesselId` → 1 (búsqueda por embarcación)
- `createdAt` → -1 (orden cronológico)

---

## 🔄 Flujos de Datos

### Flujo 1: Búsqueda de Embarcaciones

```
Usuario escribe "Pacific Star" en ComponentEmbarcaciones.vue
        ↓
searchVessels('Pacific Star', 0, 20) 
[services/api.js]
        ↓
GET /api/vessels/search?query=Pacific Star&offset=0&limit=20
[vessels.routes.js]
        ↓
controllers/vessels.controller.js → search()
        ↓
services/gfw.service.js → searchVessels()
        ↓
API GFW: https://gateway.api.globalfishingwatch.org/v3/vessels/search
        ↓
Respuesta normalizada:
{
  vessels: [
    { id, name, flag, imo, callsign, shiptype, ... }
  ],
  total: 150,
  offset: 0,
  limit: 20
}
        ↓
ComponentEmbarcaciones.vue → Renderiza tabla
```

---

### Flujo 2: Detección Automática de Alertas

```
Cron Job / Usuario ejecuta runAlertRules(['vessel1', 'vessel2'])
[services/api.js]
        ↓
POST /api/alerts/run
Body: { vesselIds: ['vessel1', 'vessel2'] }
[alerts.routes.js]
        ↓
controllers/alerts.controller.js → runAlertRules()
        ↓
1. Obtener zonas activas de MongoDB:
   const zones = await Zone.find({ active: true });

2. Por cada vesselId:
   a. Obtener tracks últimas 24h:
      gfw.service.js → getVesselTracks()
   
   b. Por cada track/posición:
      - Verificar si punto está dentro de zonas:
        geofencing.service.js → getZonesContainingPoint()
      
      - Si está en zona de nivel "high":
        * Crear Alert con type='zone_violation'
        * Incrementar zone.boats
      
      - Si permanece >30 min en zona:
        geofencing.service.js → detectProlongedStay()
        * Crear Alert con type='prolonged_stay'

3. Guardar alertas en MongoDB:
   await alert.save()

        ↓
Respuesta:
{
  vesselsProcessed: 2,
  alertsCreated: 3,
  alerts: [...]
}
        ↓
Frontend actualiza lista de alertas
```

---

### Flujo 3: Crear Zona Protegida

```
Usuario dibuja polígono en mapa (Leaflet/Mapbox)
        ↓
ComponentZonasProtegidas.vue captura coordinates
        ↓
createZone({
  name: 'Reserva Marina',
  level: 'high',
  geometry: {
    type: 'Polygon',
    coordinates: [[...]]
  }
})
[services/api.js]
        ↓
POST /api/zones
[zones.routes.js]
        ↓
controllers/zones.controller.js → create()
        ↓
1. Validar que geometry.type === 'Polygon'
2. Calcular área del polígono:
   geofencing.service.js → calculatePolygonArea()
3. Crear documento Zone:
   {
     name,
     geometry,
     area: 125.34,  // km²
     level: 'high',
     levelLabel: 'Restricción Alta',
     icon: 'dangerous',
     boats: 0,
     active: true
   }
4. Guardar en MongoDB:
   await newZone.save()

        ↓
Respuesta:
{
  id: '...',
  name: 'Reserva Marina',
  area: 125.34,
  ...
}
        ↓
Zona aparece en mapa automáticamente
```

---

## 🧮 Algoritmos Geoespaciales

### Point-in-Polygon (Ray Casting)

**Archivo:** `services/geofencing.service.js`

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

**Uso:**
```js
const point = { lat: 15.3, lon: -90.4 };
const polygon = [
  [-90.5, 15.2],
  [-90.3, 15.2],
  [-90.3, 15.4],
  [-90.5, 15.4],
  [-90.5, 15.2]
];

isPointInPolygon(point, polygon); // true
```

---

### Cálculo de Área (Shoelace Formula)

```javascript
export const calculatePolygonArea = (polygon) => {
  let area = 0;
  for (let i = 0; i < polygon.length - 1; i++) {
    area += polygon[i][0] * polygon[i + 1][1];
    area -= polygon[i + 1][0] * polygon[i][1];
  }
  area = Math.abs(area) / 2;
  
  // Convertir a km² (aproximación)
  const latAvg = polygon.reduce((sum, p) => sum + p[1], 0) / polygon.length;
  const kmPerDegree = 111.32 * Math.cos(latAvg * Math.PI / 180);
  return area * kmPerDegree * 111.32;
};
```

---

### Detección de Permanencia Prolongada

```javascript
export const detectProlongedStay = (tracks, zone, minutesThreshold) => {
  let minutesInZone = 0;
  let wasInside = false;

  for (const track of tracks) {
    const point = { lat: track.lat, lon: track.lon };
    const isInside = isPointInPolygon(point, zone.geometry.coordinates[0]);

    if (isInside) {
      minutesInZone += 5; // Asumiendo puntos cada 5 min
      wasInside = true;
    } else if (wasInside) {
      break; // Salió de la zona
    }
  }

  return minutesInZone >= minutesThreshold;
};
```

---

## 🔒 Seguridad

### 1. Token GFW (Backend Only)

```javascript
// ❌ NUNCA en frontend
// ✅ SIEMPRE en backend

// gfw.service.js
const axiosGFW = axios.create({
  baseURL: 'https://gateway.api.globalfishingwatch.org/v3',
  headers: {
    Authorization: `Bearer ${process.env.GFW_TOKEN}`,
  },
});
```

### 2. Validación de Entrada

```javascript
// zones.controller.js → create()
if (!name || !geometry) {
  return res.status(400).json({ error: 'name y geometry son requeridos' });
}

if (geometry.type !== 'Polygon') {
  return res.status(400).json({ error: 'geometry debe ser tipo Polygon' });
}
```

### 3. Manejo de Errores

```javascript
try {
  const vessels = await searchVessels(query);
  res.json(vessels);
} catch (error) {
  console.error('Error:', error);
  res.status(500).json({ error: 'Error en búsqueda' });
}
```

---

## 📈 Optimizaciones

### 1. Índices MongoDB

```javascript
// Zone.js
schema.index({ geometry: '2dsphere' });  // Búsqueda geoespacial O(log n)
schema.index({ active: 1 });             // Filtro rápido

// Alert.js
schema.index({ priority: 1, status: 1 }); // Consultas combinadas
schema.index({ vesselId: 1 });            // Búsqueda por embarcación
```

### 2. Paginación

```javascript
// vessels.controller.js
const offset = parseInt(req.query.offset) || 0;
const limit = parseInt(req.query.limit) || 20;

const vesselsResponse = await searchVessels(query, offset, limit);
```

### 3. Caché (Futuro)

```javascript
// Ejemplo con Redis (opcional)
const cachedVessel = await redis.get(`vessel:${vesselId}`);
if (cachedVessel) return JSON.parse(cachedVessel);

const vessel = await getVesselById(vesselId);
await redis.set(`vessel:${vesselId}`, JSON.stringify(vessel), 'EX', 3600);
```

---

## 🧪 Ejemplos de Respuestas

### Dashboard Summary

```json
{
  "activeVessels": 1247,
  "protectedZones": 12,
  "activeAlerts": 8,
  "detectionsToday": 34
}
```

### Búsqueda de Embarcaciones

```json
{
  "vessels": [
    {
      "id": "abc123",
      "name": "PACIFIC STAR",
      "flag": "USA",
      "imo": "9123456",
      "callsign": "WDB1234",
      "shiptype": "Fishing"
    }
  ],
  "total": 150,
  "offset": 0,
  "limit": 20
}
```

### Zona Protegida

```json
{
  "id": "64f123abc456...",
  "name": "Reserva Marina del Pacífico",
  "level": "high",
  "levelLabel": "Restricción Alta",
  "icon": "dangerous",
  "area": "125.34",
  "boats": 3,
  "created": "01/12/2024",
  "geometry": {
    "type": "Polygon",
    "coordinates": [[[-90.5, 15.2], ...]]
  }
}
```

### Alerta

```json
{
  "id": "64f789def012...",
  "priority": "high",
  "icon": "dangerous",
  "title": "Embarcación en Zona Prohibida",
  "description": "La embarcación abc123 ha ingresado a la zona protegida...",
  "time": "Hace 15 min",
  "location": "Reserva Marina del Pacífico",
  "boat": "PACIFIC STAR",
  "reporter": "Sistema Automático",
  "status": "active"
}
```

---

## ✅ Checklist de Validación Final

### Backend
- [x] `gfw.service.js` creado con todos los endpoints
- [x] `geofencing.service.js` con algoritmos geoespaciales
- [x] Modelos `Zone.js` y `Alert.js` con índices
- [x] Controladores (dashboard, vessels, positions, zones, alerts)
- [x] Rutas registradas en `server.js`
- [x] Token GFW en `.env`

### Frontend
- [x] `services/api.js` actualizado con métodos GFW
- [ ] Componentes actualizados para llamar nuevos endpoints
- [ ] Mapa integrado con zonas GeoJSON
- [ ] Alertas en tiempo real

### Pruebas
- [ ] Servidor inicia sin errores
- [ ] Dashboard muestra KPIs reales
- [ ] Búsqueda de embarcaciones funciona
- [ ] Creación de zonas funciona
- [ ] Detección de alertas funciona

---

**🎯 Documentación completa. Sistema listo para pruebas.**
