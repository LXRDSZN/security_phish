# 🎨 Actualización de Componentes Vue - GFW Integration

## ✅ Componentes Actualizados (4 archivos)

### 1. ComponentDashboard.vue
**Ubicación:** `src/components/Dashboard/ComponentDashboard.vue`

**Cambios realizados:**
- ✅ Importa `getDashboardSummary`, `getRecentActivity`, `getAlerts` desde `api.js`
- ✅ Los KPIs ahora se cargan desde la API de GFW en tiempo real
- ✅ Actividad reciente y alertas se obtienen del backend
- ✅ Auto-actualización cada 30 segundos
- ✅ Estado de carga (`loading`) para mejor UX

**Funciones nuevas:**
```javascript
loadDashboardData() // Carga todos los datos del dashboard desde GFW
```

**Datos actualizados:**
- `totalEmbarcaciones` → `summary.activeVessels`
- `zonasProtegidas` → `summary.protectedZones`
- `alertasActivas` → `summary.activeAlerts`
- `deteccionesHoy` → `summary.detectionsToday`
- `recentActivities` → Desde `getRecentActivity()`
- `alerts` → Desde `getAlerts({ status: 'active' })`

---

### 2. ComponentEmbarcaciones.vue
**Ubicación:** `src/components/Embarcaciones/ComponentEmbarcaciones.vue`

**Cambios realizados:**
- ✅ Importa `searchVessels`, `getVesselById` desde `api.js`
- ✅ Búsqueda en tiempo real con debounce (500ms)
- ✅ Integración con API de Global Fishing Watch
- ✅ Normalización de datos GFW al formato del componente
- ✅ Visualización de resultados totales

**Funciones nuevas:**
```javascript
performSearch()   // Busca embarcaciones en GFW
viewDetails(id)   // Obtiene detalles completos de una embarcación
```

**Búsqueda dinámica:**
- Escribe al menos 2 caracteres para iniciar búsqueda
- Espera 500ms después de dejar de escribir (debounce)
- Muestra hasta 20 resultados por página
- Los datos se normalizan desde el formato GFW:
  - `vessel.name` → `boat.name`
  - `vessel.imo/mmsi/callsign` → `boat.registration`
  - `vessel.shiptype` → `boat.type`
  - `vessel.flag` → Incluido en `lastLocation`

**Nota importante:**
GFW no provee información de capitán ni ubicación exacta. Estos campos se rellenan con valores predeterminados.

---

### 3. ComponentAlertas.vue
**Ubicación:** `src/components/Alertas/ComponentAlertas.vue`

**Cambios realizados:**
- ✅ Importa `getAlerts`, `resolveAlert` desde `api.js`
- ✅ Carga alertas activas desde MongoDB
- ✅ Filtrado por prioridad (high, medium, low)
- ✅ Botón "Resolver" funcional con integración API
- ✅ Auto-actualización cada 60 segundos
- ✅ Recarga automática al cambiar filtros

**Funciones nuevas:**
```javascript
loadAlerts()              // Carga alertas con filtros aplicados
handleResolveAlert(id)    // Resuelve una alerta específica
```

**Filtros disponibles:**
- `all` → Todas las alertas activas
- `high` → Solo prioridad alta
- `medium` → Solo prioridad media
- `low` → Solo prioridad baja

**Flujo de resolución:**
1. Usuario hace clic en "Resolver"
2. Se llama `resolveAlert(alertId, 'Usuario del Sistema')`
3. Backend actualiza el estado a `resolved`
4. Se recargan las alertas automáticamente
5. La alerta desaparece de la vista (solo muestra activas)

---

### 4. ComponentZonasProtegidas.vue
**Ubicación:** `src/components/Zonas_Protegidas/ComponentZonasProtegidas.vue`

**Cambios realizados:**
- ✅ Importa `getAllZones`, `createZone`, `updateZone`, `deleteZone` desde `api.js`
- ✅ Carga zonas protegidas desde MongoDB
- ✅ Solo muestra zonas activas
- ✅ Datos con geometría GeoJSON completa

**Funciones nuevas:**
```javascript
loadZones()  // Carga todas las zonas activas
```

**Datos de zona incluyen:**
- `name` → Nombre de la zona
- `level` → high/medium/low
- `levelLabel` → "Restricción Alta", etc.
- `icon` → Icono Material Design
- `area` → Área en km² (auto-calculado)
- `boats` → Contador de embarcaciones detectadas
- `created` → Fecha de creación
- `description` → Descripción de la zona
- `geometry` → Polígono GeoJSON

**Próximos pasos sugeridos:**
Para completar la funcionalidad, se recomienda:
1. Agregar modal para crear zonas (con dibujo de polígono en mapa)
2. Implementar botones de editar y eliminar
3. Integrar librería de mapas (Leaflet/Mapbox) para visualización

---

## 🔄 Flujo de Datos Actualizado

```
┌────────────────┐
│  ComponentVue  │
└───────┬────────┘
        │ import { método } from '@/backend/services/api.js'
        ▼
┌────────────────┐
│ services/api.js│ (Frontend)
└───────┬────────┘
        │ HTTP Request
        ▼
┌────────────────┐
│ Express Routes │ (Backend)
└───────┬────────┘
        │
        ▼
┌────────────────┐
│  Controllers   │
└───────┬────────┘
        │
        ├──────────┬──────────┐
        ▼          ▼          ▼
    ┌─────┐   ┌──────┐   ┌────────┐
    │ GFW │   │ Geo- │   │MongoDB │
    │ API │   │fence │   │        │
    └─────┘   └──────┘   └────────┘
```

---

## 🧪 Cómo Probar

### 1. Dashboard
```bash
# Terminal 1: Iniciar backend
cd src/backend
node server.js

# Terminal 2: Iniciar frontend
npm run dev
```

**Pasos:**
1. Navegar a `/dashboard`
2. Verificar que los KPIs se actualizan con datos reales
3. Observar la actividad reciente y alertas
4. Esperar 30 segundos para ver auto-actualización

**Esperado:**
- KPIs muestran números reales de GFW
- Actividad reciente con eventos del sistema
- Alertas activas si hay violaciones de zonas

---

### 2. Embarcaciones
**Pasos:**
1. Navegar a `/embarcaciones`
2. Escribir en el buscador: "pacific"
3. Esperar 500ms (debounce)
4. Ver resultados de GFW

**Esperado:**
- Lista de embarcaciones con nombre similar a "pacific"
- Información de IMO, bandera, tipo de embarcación
- Click en "Ver" muestra detalles en consola

**Ejemplo de búsqueda:**
- `pacific` → Embarcaciones con "pacific" en el nombre
- `fishing` → Embarcaciones tipo "fishing"
- `cargo` → Embarcaciones de carga

---

### 3. Alertas
**Pasos:**
1. Navegar a `/alertas`
2. Observar alertas activas
3. Filtrar por prioridad
4. Hacer clic en "Resolver" en una alerta

**Esperado:**
- Alertas cargadas desde MongoDB
- Filtros funcionan correctamente
- Al resolver, la alerta desaparece de la lista
- Auto-actualización cada 60 segundos

**Crear alertas de prueba:**
```bash
# En una terminal, ejecutar detección de alertas
curl -X POST http://localhost:5000/api/alerts/run \
  -H "Content-Type: application/json" \
  -d '{"vesselIds": ["ID_DE_EMBARCACION_GFW"]}'
```

---

### 4. Zonas Protegidas
**Pasos:**
1. Navegar a `/zonas-protegidas`
2. Ver lista de zonas registradas

**Esperado:**
- Zonas cargadas desde MongoDB
- Área calculada automáticamente
- Información de nivel de restricción

**Crear zona de prueba:**
```bash
curl -X POST http://localhost:5000/api/zones \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Zona de Prueba",
    "level": "high",
    "description": "Zona de prueba para desarrollo",
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
  }'
```

---

## ⚠️ Notas Importantes

### Limitaciones de GFW
1. **Búsqueda de embarcaciones:**
   - Requiere al menos 2 caracteres
   - Resultados paginados (máx 20 por consulta)
   - Sin información de capitán o tripulación

2. **Posiciones/Tracks:**
   - Requiere permisos especiales en GFW
   - Si no tienes acceso, retorna array vacío
   - No genera error, solo warning en consola

3. **Eventos de pesca:**
   - Solo disponible con suscripción premium de GFW
   - Fallback graceful si no está disponible

### Manejo de Errores
Todos los componentes tienen try-catch para:
- Errores de red
- Respuestas vacías
- Datos malformados
- Timeouts

Si hay un error:
1. Se muestra en consola del navegador
2. Los datos permanecen vacíos (no crashea)
3. El usuario puede reintentar

### Performance
- **Dashboard:** Auto-actualiza cada 30s
- **Alertas:** Auto-actualiza cada 60s
- **Embarcaciones:** Debounce de 500ms en búsqueda
- **Zonas:** Solo carga una vez al montar

---

## 🚀 Próximos Pasos Sugeridos

### 1. Integrar Mapa Interactivo
**Componentes afectados:** `ComponentRadar.vue`, `ComponentZonasProtegidas.vue`

```bash
# Instalar Leaflet
npm install leaflet vue-leaflet

# O Mapbox
npm install mapbox-gl @mapbox/mapbox-gl-vue
```

**Funcionalidad a agregar:**
- Visualizar zonas GeoJSON en mapa
- Dibujar nuevas zonas con Leaflet.Draw
- Mostrar posiciones de embarcaciones en tiempo real
- Click en zona → Ver detalles

---

### 2. Modal para Crear Zonas
**Componente:** `ComponentZonasProtegidas.vue`

```vue
<button @click="showCreateModal = true">Nueva Zona</button>

<!-- Modal con mapa para dibujar polígono -->
<CreateZoneModal 
  v-if="showCreateModal"
  @save="handleCreateZone"
  @close="showCreateModal = false"
/>
```

---

### 3. WebSockets para Alertas en Tiempo Real
**Backend:**
```bash
npm install socket.io
```

**Frontend:**
```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');
socket.on('new-alert', (alert) => {
  alerts.value.unshift(alert);
});
```

---

### 4. Exportar Reportes
**Botón en cada componente:**
```vue
<button @click="exportCSV">
  <span>file_download</span>
  Exportar CSV
</button>
```

**Función:**
```javascript
const exportCSV = () => {
  const csv = alerts.value.map(a => 
    `${a.title},${a.priority},${a.location},${a.time}`
  ).join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'alertas.csv';
  a.click();
};
```

---

## 🐛 Troubleshooting

### Error: "Cannot read property 'vessels' of undefined"
**Causa:** Backend no está corriendo o GFW API retornó error

**Solución:**
```bash
# Verificar que backend esté corriendo
cd src/backend
node server.js

# Verificar logs en consola del servidor
# Si ves error 403: Tu token GFW no tiene permisos
# Si ves error 401: Token GFW inválido
```

---

### Búsqueda de embarcaciones no muestra resultados
**Causa:** Query muy corta o sin coincidencias

**Solución:**
- Escribir al menos 2 caracteres
- Probar con términos genéricos: "fishing", "cargo", "pacific"
- Verificar en consola del navegador si hay errores

---

### Alertas no se cargan
**Causa:** No hay alertas en la base de datos

**Solución:**
```bash
# Crear alertas de prueba ejecutando reglas
curl -X POST http://localhost:5000/api/alerts/run \
  -H "Content-Type: application/json" \
  -d '{"vesselIds": ["VESSEL_ID"]}'
```

---

### Zonas no aparecen
**Causa:** MongoDB no tiene zonas registradas

**Solución:**
```bash
# Crear zona de prueba
curl -X POST http://localhost:5000/api/zones \
  -H "Content-Type: application/json" \
  -d '{ "name": "Test Zone", "level": "high", "geometry": {...} }'
```

---

## ✅ Checklist de Verificación

- [ ] Backend corriendo en puerto 5000
- [ ] Frontend corriendo en puerto 5173
- [ ] MongoDB conectado
- [ ] Token GFW configurado en `.env`
- [ ] Dashboard muestra KPIs reales
- [ ] Búsqueda de embarcaciones funciona
- [ ] Alertas se cargan correctamente
- [ ] Zonas se muestran en la lista
- [ ] Botón "Resolver" funciona en alertas
- [ ] No hay errores en consola del navegador

---

**🎉 ¡Componentes Vue actualizados e integrados con Global Fishing Watch!**

Los 4 componentes principales ahora consumen datos reales de la API. El frontend está completamente integrado con el backend de GFW.
