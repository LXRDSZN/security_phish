# 🚀 Inicio Rápido - SistemaFish + GFW

## ⚡ Comandos de Inicio

### 1. Iniciar Backend (Terminal 1)
```bash
cd src/backend
node server.js
```

**Salida esperada:**
```
✅ MongoDB conectado exitosamente
✅ Servidor corriendo en el puerto 5000
```

---

### 2. Iniciar Frontend (Terminal 2)
```bash
npm run dev
```

**Salida esperada:**
```
VITE vX.X.X  ready in XXX ms

➜  Local:   http://localhost:5173/
```

---

### 3. Abrir en Navegador
```
http://localhost:5173
```

---

## 🧪 Prueba Rápida (5 minutos)

### ✅ Test 1: Dashboard (30 segundos)
1. ☑️ Navegar a `/dashboard`
2. ☑️ Verificar que los KPIs muestran números
3. ☑️ Ver actividad reciente
4. ☑️ Ver alertas en la sección inferior

**Si funciona:** Dashboard integrado ✅

---

### ✅ Test 2: Embarcaciones (1 minuto)
1. ☑️ Navegar a `/embarcaciones`
2. ☑️ Escribir "pacific" en el buscador
3. ☑️ Esperar 1 segundo (debounce)
4. ☑️ Ver resultados de GFW con nombres de embarcaciones

**Si funciona:** Búsqueda GFW integrada ✅

---

### ✅ Test 3: Alertas (1 minuto)
1. ☑️ Navegar a `/alertas`
2. ☑️ Ver lista de alertas (puede estar vacía si no hay)
3. ☑️ Filtrar por "Alta Prioridad"
4. ☑️ Si hay alertas, hacer clic en "Resolver"

**Si funciona:** Sistema de alertas integrado ✅

---

### ✅ Test 4: Zonas (30 segundos)
1. ☑️ Navegar a `/zonas-protegidas`
2. ☑️ Ver lista de zonas registradas

**Si funciona:** Zonas integradas ✅

---

## 🔧 Si Algo No Funciona

### ❌ Backend no inicia
```bash
# Verificar que MongoDB esté corriendo
mongosh

# Si no: Iniciar MongoDB
# Windows: Buscar "MongoDB" en servicios
# Mac/Linux: sudo systemctl start mongodb
```

---

### ❌ Frontend muestra error de CORS
**Causa:** Backend no permite conexiones desde localhost:5173

**Solución:**
Verificar en `src/backend/server.js`:
```javascript
app.use(cors({
  origin: 'http://localhost:5173',  // ✅ Debe estar así
  credentials: true
}));
```

---

### ❌ Búsqueda no muestra resultados
**Causa:** Token GFW inválido o permisos insuficientes

**Solución:**
```bash
# Verificar token en .env
cat src/backend/.env

# Debe tener:
GFW_TOKEN=eyJhbGciOiJ...
```

---

### ❌ Alertas vacías
**Causa:** No hay alertas en la base de datos

**Solución:**
```bash
# Crear zona de prueba
curl -X POST http://localhost:5000/api/zones \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Zona Test",
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
  }'

# Ejecutar reglas de alertas
curl -X POST http://localhost:5000/api/alerts/run \
  -H "Content-Type: application/json" \
  -d '{"vesselIds": ["ID_VESSEL_GFW"]}'
```

---

## 📱 Panel de Control

### Endpoints Principales
```
Dashboard:
  http://localhost:5000/api/dashboard/summary

Embarcaciones:
  http://localhost:5000/api/vessels/search?query=pacific

Alertas:
  http://localhost:5000/api/alerts?status=active

Zonas:
  http://localhost:5000/api/zones
```

### Puedes probarlos con:
```bash
# Dashboard
curl http://localhost:5000/api/dashboard/summary

# Embarcaciones
curl "http://localhost:5000/api/vessels/search?query=pacific&limit=5"

# Alertas
curl http://localhost:5000/api/alerts

# Zonas
curl http://localhost:5000/api/zones
```

---

## 📊 Monitoreo

### Ver logs del Backend
Los logs aparecen en la terminal donde ejecutaste `node server.js`:
```
🔍 Buscando: pacific
✅ Dashboard summary generado
⚠️ No se pudieron obtener tracks para vessel123
```

### Ver logs del Frontend
Abre DevTools en el navegador (F12) → Pestaña "Console":
```
Error cargando datos del dashboard: ...
Detalles de embarcación: {...}
```

---

## 🎯 Uso Típico

### 1. Monitorear Dashboard
- Dashboard se actualiza automáticamente cada 30 segundos
- Ver KPIs en tiempo real
- Revisar actividad reciente

### 2. Buscar Embarcaciones
- Escribir en buscador (mínimo 2 caracteres)
- Ver resultados de GFW
- Click en "Ver" para detalles

### 3. Gestionar Alertas
- Revisar alertas activas
- Filtrar por prioridad
- Resolver alertas con botón

### 4. Ver Zonas Protegidas
- Lista de zonas registradas
- Ver área y nivel de restricción
- Crear nuevas zonas (próximamente)

---

## 📚 Documentación Completa

- [INTEGRATION_SUMMARY.md](INTEGRATION_SUMMARY.md) - Resumen de integración
- [GFW_INTEGRATION_GUIDE.md](GFW_INTEGRATION_GUIDE.md) - Guía de uso
- [VUE_COMPONENTS_UPDATE.md](VUE_COMPONENTS_UPDATE.md) - Cambios en componentes
- [TESTING_GUIDE.md](TESTING_GUIDE.md) - Scripts de prueba
- [ARCHITECTURE.md](ARCHITECTURE.md) - Arquitectura del sistema

---

## 🆘 Soporte

Si encuentras problemas:
1. Verificar logs del backend (terminal)
2. Verificar consola del navegador (F12)
3. Revisar documentación en archivos .md
4. Comprobar que MongoDB esté corriendo
5. Verificar token GFW en .env

---

**✅ Sistema listo para usar. ¡Buena pesca! 🎣**
