# 🐟 Integración Global Fishing Watch - Guía de Implementación

## 📋 Resumen de la Integración

Esta integración conecta tu sistema **SistemaFish** con la API de **Global Fishing Watch (GFW)** para obtener datos reales de embarcaciones pesqueras, posiciones AIS, eventos de pesca, y detectar violaciones en zonas protegidas.

### ✅ Arquitectura Implementada

```
Frontend (Vue 3)
    ↓ (llama via services/api.js)
Backend Node.js/Express
    ↓ (proxy seguro con token)
Global Fishing Watch API
```

**Ventajas:**
- ✅ Token GFW oculto del frontend (seguridad)
- ✅ Normalización de datos al formato esperado por tu UI
- ✅ Manejo de permisos (fallback para endpoints con 403)
- ✅ Geofencing sin librerías externas (algoritmo point-in-polygon)
- ✅ Alertas automáticas con reglas de negocio

---

## 📂 Estructura de Archivos Creados

```
src/backend/
├── services/
│   ├── gfw.service.js                 # Proxy a GFW API (token seguro)
│   └── geofencing.service.js          # Algoritmos geoespaciales
├── models/
│   ├── Zone.js                        # Zonas protegidas (MongoDB + GeoJSON)
│   └── Alert.js                       # Alertas detectadas
├── controllers/
│   ├── dashboard.controller.js        # KPIs para Dashboard
│   ├── vessels.controller.js          # Búsqueda de embarcaciones
│   ├── positions.controller.js        # Tracks/posiciones
│   ├── zones.controller.js            # CRUD zonas protegidas
│   └── alerts.controller.js           # Gestión de alertas
└── routes/
    ├── dashboard.routes.js
    ├── vessels.routes.js
    ├── positions.routes.js
    ├── zones.routes.js
    └── alerts.routes.js

src/backend/services/api.js            # Métodos actualizados en frontend
```

---

## 🔐 Configuración del Token GFW

**Archivo:** `src/backend/.env`

```env
GFW_TOKEN=eyJhbG...tu_token_jwt_completo
```

⚠️ **Importante:** El token ya está configurado. No lo expongas en el frontend.

---

## 🛠️ Endpoints Disponibles

### 📊 **Dashboard**

#### 1. Obtener KPIs
```http
GET /api/dashboard/summary
```

**Frontend:**
```js
import { getDashboardSummary } from '@/backend/services/api.js';

const data = await getDashboardSummary();
console.log(data);
// {
//   activeVessels: 1247,
//   protectedZones: 12,
//   activeAlerts: 8,
//   detectionsToday: 34
// }
```

#### 2. Actividad Reciente
```http
GET /api/dashboard/activity
```

**Frontend:**
```js
import { getRecentActivity } from '@/backend/services/api.js';

const activity = await getRecentActivity();
// Array de eventos recientes con timestamp y tipo
```

---

### 🚢 **Embarcaciones**

#### 1. Buscar Embarcaciones
```http
GET /api/vessels/search?query=pacific&offset=0&limit=20
```

**Frontend:**
```js
import { searchVessels } from '@/backend/services/api.js';

const results = await searchVessels('pacific', 0, 20);
console.log(results);
// {
//   vessels: [
//     { id: '...', name: 'PACIFIC STAR', flag: 'USA', ... }
//   ],
//   total: 150,
//   offset: 0,
//   limit: 20
// }
```

#### 2. Detalles de Embarcación
```http
GET /api/vessels/:vesselId
```

**Frontend:**
```js
import { getVesselById } from '@/backend/services/api.js';

const vessel = await getVesselById('abc123...');
console.log(vessel.name, vessel.flag, vessel.imo);
```

---

### 📍 **Posiciones/Tracks**

```http
GET /api/positions/:vesselId?from=2024-01-01&to=2024-01-07
```

**Frontend:**
```js
import { getVesselPositions } from '@/backend/services/api.js';

const positions = await getVesselPositions('abc123', '2024-01-01', '2024-01-07');
// Array de { lat, lon, timestamp, speed, course }
```

⚠️ **Nota:** Si no tienes permisos de tracks en GFW, retorna array vacío con warning en consola.

---

### 🗺️ **Zonas Protegidas**

#### 1. Listar Zonas
```http
GET /api/zones?active=true
```

**Frontend:**
```js
import { getAllZones } from '@/backend/services/api.js';

const zones = await getAllZones(true); // Solo activas
```

#### 2. Crear Zona (GeoJSON)
```http
POST /api/zones
Content-Type: application/json

{
  "name": "Reserva Marina del Pacífico",
  "description": "Zona de reproducción de tortugas",
  "level": "high",
  "geometry": {
    "type": "Polygon",
    "coordinates": [[
      [-90.5, 15.2],
      [-90.3, 15.2],
      [-90.3, 15.4],
      [-90.5, 15.4],
      [-90.5, 15.2]
    ]]
  }
}
```

**Frontend:**
```js
import { createZone } from '@/backend/services/api.js';

const newZone = await createZone({
  name: 'Reserva Marina del Pacífico',
  level: 'high',
  geometry: { type: 'Polygon', coordinates: [...] }
});
```

#### 3. Actualizar Zona
```http
PUT /api/zones/:zoneId
```

**Frontend:**
```js
import { updateZone } from '@/backend/services/api.js';

await updateZone(zoneId, { level: 'medium', active: false });
```

#### 4. Eliminar Zona
```http
DELETE /api/zones/:zoneId
```

**Frontend:**
```js
import { deleteZone } from '@/backend/services/api.js';

await deleteZone(zoneId);
```

---

### 🚨 **Alertas**

#### 1. Listar Alertas
```http
GET /api/alerts?status=active&priority=high
```

**Frontend:**
```js
import { getAlerts } from '@/backend/services/api.js';

const alerts = await getAlerts({ status: 'active', priority: 'high' });
// Array de alertas con iconos y descripciones
```

#### 2. Ejecutar Detección de Alertas
```http
POST /api/alerts/run
Content-Type: application/json

{
  "vesselIds": ["abc123", "def456"]
}
```

**Frontend:**
```js
import { runAlertRules } from '@/backend/services/api.js';

const result = await runAlertRules(['abc123', 'def456']);
console.log(result.alertsCreated); // 3 nuevas alertas detectadas
```

**Reglas automáticas:**
- ✅ Entrada a zonas de restricción alta
- ✅ Permanencia prolongada en zona (>30 min)
- ✅ Detección de actividad sospechosa

#### 3. Resolver Alerta
```http
PUT /api/alerts/:alertId/resolve
```

**Frontend:**
```js
import { resolveAlert } from '@/backend/services/api.js';

await resolveAlert(alertId, 'Juan Pérez');
```

---

## 🧪 Checklist de Pruebas

### ✅ Fase 1: Verificar Backend

1. **Iniciar servidor:**
   ```bash
   cd src/backend
   node server.js
   ```
   Debe mostrar: `✅ Servidor corriendo en el puerto 5000`

2. **Probar endpoint de Dashboard:**
   ```bash
   curl http://localhost:5000/api/dashboard/summary
   ```
   Debe retornar JSON con `activeVessels`, `protectedZones`, etc.

3. **Probar búsqueda de embarcaciones:**
   ```bash
   curl "http://localhost:5000/api/vessels/search?query=pacific&limit=5"
   ```

### ✅ Fase 2: Integración Frontend

1. **Actualizar componente Dashboard:**
   ```js
   // En ComponentDashboard.vue
   import { getDashboardSummary } from '@/backend/services/api.js';

   onMounted(async () => {
     const data = await getDashboardSummary();
     // Asignar a variables reactivas
   });
   ```

2. **Actualizar componente Embarcaciones:**
   ```js
   // En ComponentEmbarcaciones.vue
   import { searchVessels } from '@/backend/services/api.js';

   const buscar = async () => {
     const results = await searchVessels(searchQuery.value);
     vessels.value = results.vessels;
   };
   ```

3. **Actualizar componente Alertas:**
   ```js
   // En ComponentAlertas.vue
   import { getAlerts } from '@/backend/services/api.js';

   onMounted(async () => {
     alerts.value = await getAlerts({ status: 'active' });
   });
   ```

### ✅ Fase 3: Probar Geofencing

1. **Crear zona de prueba en MongoDB:**
   ```bash
   curl -X POST http://localhost:5000/api/zones \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Zona Prueba",
       "level": "high",
       "geometry": {
         "type": "Polygon",
         "coordinates": [[[-90,15],[-89,15],[-89,16],[-90,16],[-90,15]]]
       }
     }'
   ```

2. **Ejecutar detección de alertas:**
   ```bash
   curl -X POST http://localhost:5000/api/alerts/run \
     -H "Content-Type: application/json" \
     -d '{"vesselIds": ["abc123"]}'
   ```

---

## 🎯 Casos de Uso Reales

### 1. Dashboard en Vivo
**Componente:** `ComponentDashboard.vue`

```js
import { getDashboardSummary, getRecentActivity } from '@/backend/services/api.js';

// Actualizar cada 30 segundos
setInterval(async () => {
  const summary = await getDashboardSummary();
  kpis.value = summary;
}, 30000);
```

### 2. Búsqueda de Embarcaciones
**Componente:** `ComponentEmbarcaciones.vue`

```js
<input v-model="searchQuery" @input="buscar" placeholder="Buscar embarcación..." />

const buscar = async () => {
  const results = await searchVessels(searchQuery.value, 0, 20);
  embarcaciones.value = results.vessels;
};
```

### 3. Mapa con Zonas y Alertas
**Componente:** `ComponentRadar.vue` / `ComponentZonasProtegidas.vue`

```js
import { getAllZones, getAlerts } from '@/backend/services/api.js';

const zones = await getAllZones(true);
const alerts = await getAlerts({ status: 'active' });

// Dibujar zonas en mapa (Leaflet/Mapbox)
zones.forEach(zone => {
  L.polygon(zone.geometry.coordinates[0]).addTo(map);
});
```

### 4. Crear Alerta Manual
**Componente:** `ComponentAlertas.vue`

```js
const crearAlerta = async () => {
  const vesselIds = ['abc123']; // IDs de embarcaciones a verificar
  const result = await runAlertRules(vesselIds);
  
  if (result.alertsCreated > 0) {
    alert(`${result.alertsCreated} alertas detectadas!`);
    // Recargar lista
    alerts.value = await getAlerts();
  }
};
```

---

## 🐛 Resolución de Problemas

### Error: "403 Forbidden" en endpoints de GFW

**Causa:** Tu cuenta GFW no tiene permisos para ciertos datasets (tracks, fishing-events).

**Solución:** Los controladores ya tienen fallback graceful. Ejemplo:
```js
// positions.controller.js retorna [] si no hay permisos
const positions = await getVesselPositions(vesselId, from, to);
// positions = [] (no error)
```

### Error: "Zone already exists"

**Causa:** Intentaste crear zona con mismo nombre.

**Solución:** Verificar antes:
```js
const existing = await getAllZones();
if (existing.some(z => z.name === newName)) {
  alert('Zona ya existe');
}
```

### Error: "MongoServerError: 2dsphere index required"

**Causa:** Modelo Zone necesita índice geoespacial.

**Solución:** Reiniciar servidor (el modelo lo crea automáticamente).

---

## 📦 Próximos Pasos (Opcional)

1. **Cron Job:** Ejecutar `runAlertRules` cada hora automáticamente
2. **WebSockets:** Actualizaciones en tiempo real de alertas
3. **Export CSV:** Exportar reportes de zonas/alertas
4. **Mapa Interactivo:** Dibujar zonas con Leaflet Draw

---

## 📞 Soporte

Si encuentras problemas:
1. Verificar logs del servidor: `console.log` en controladores
2. Comprobar token GFW en `.env`
3. Revisar CORS en `server.js` (debe permitir `localhost:5173`)

---

**✅ Integración completa y lista para usar.**
