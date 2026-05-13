# 🔄 INSTRUCCIONES PARA REINICIAR EL BACKEND

## ⚠️ PROBLEMA IDENTIFICADO

El servidor backend está corriendo con código **VIEJO** (iniciado a las 10:02).
Los cambios que hicimos en `vessel-positions.service.js` **NO están activos**.

Por eso las embarcaciones no tienen coordenadas lat/lon.

---

## ✅ SOLUCIÓN: Reiniciar Backend

### Opción 1: Desde la terminal donde corre
```bash
# 1. Ir a la terminal donde corre el backend
# 2. Presionar CTRL+C para detenerlo
# 3. Iniciar de nuevo:
node server.js
```

### Opción 2: Matar el proceso y reiniciar
```bash
# 1. Matar el proceso actual
pkill -f "node server.js"

# 2. Esperar 2 segundos
sleep 2

# 3. Iniciar backend nuevamente
cd src/backend
node server.js
```

---

## 🧪 VERIFICAR QUE FUNCIONA

Después de reiniciar, prueba:

```bash
curl "http://localhost:5000/api/vessels/search?query=fishing&limit=3" | jq '.vessels[0]'
```

**Debe mostrar:**
```json
{
  "id": "...",
  "name": "...",
  "mmsi": "...",
  "flag": "...",
  "latitude": 14.XXX,     ← DEBE ESTAR
  "longitude": -91.XXX,   ← DEBE ESTAR  
  "lat": 14.XXX,          ← DEBE ESTAR
  "lon": -91.XXX,         ← DEBE ESTAR
  "zone": "Pacífico Central",
  "area": "Costa Pacífico de Guatemala"
}
```

---

## 📊 DESPUÉS DEL REINICIO

### 1. Prueba Dashboard
```
http://localhost:5173/Dashboard
```
✅ Debe mostrar embarcaciones en el mapa

### 2. Prueba Radar  
```
http://localhost:5173/Radar
```
✅ Debe mostrar 50 embarcaciones con posiciones en el mapa

### 3. Abre consola del navegador (F12)
Debe mostrar:
```
🚢 Cargando embarcaciones en el mapa...
📦 Respuesta de embarcaciones: {total: 50, vessels: Array(50)}
✅ 50 embarcaciones agregadas al mapa
```

---

## 🐛 Si aún no funciona

### Problema: "Cannot find module vessel-positions.service.js"

```bash
# Verificar que el archivo existe
ls -la src/backend/services/vessel-positions.service.js

# Si no existe, lo creé mal. Avisar.
```

### Problema: Sigue sin coordenadas

```bash
# 1. Ver logs del backend
# Buscar líneas como:
#    "Error al agregar posiciones"
#    "addPositionsToVessels is not a function"

# 2. Verificar importación en vessels.controller.js
grep "vessel-positions" src/backend/controllers/vessels.controller.js
```

---

## 🎯 RESUMEN

1. ❌ Backend actual: código viejo (sin coordenadas)
2. ✅ Archivos: correctos y guardados
3. 🔄 Acción: **REINICIAR BACKEND**
4. ✅ Resultado esperado: embarcaciones con lat/lon

