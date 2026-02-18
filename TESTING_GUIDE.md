# 🧪 Script de Pruebas - Global Fishing Watch Integration

## 📝 Pre-requisitos

1. Servidor backend corriendo:
   ```bash
   cd src/backend
   node server.js
   ```

2. MongoDB conectado

3. Token GFW configurado en `.env`

---

## ✅ Test 1: Dashboard Summary

```bash
curl -X GET "http://localhost:5000/api/dashboard/summary" \
  -H "Content-Type: application/json"
```

**Resultado esperado:**
```json
{
  "activeVessels": 1247,
  "protectedZones": 12,
  "activeAlerts": 8,
  "detectionsToday": 34
}
```

---

## ✅ Test 2: Dashboard Activity

```bash
curl -X GET "http://localhost:5000/api/dashboard/activity" \
  -H "Content-Type: application/json"
```

**Resultado esperado:** Array de eventos recientes

---

## ✅ Test 3: Buscar Embarcaciones

```bash
curl -X GET "http://localhost:5000/api/vessels/search?query=pacific&offset=0&limit=5" \
  -H "Content-Type: application/json"
```

**Resultado esperado:**
```json
{
  "vessels": [
    {
      "id": "...",
      "name": "PACIFIC ...",
      "flag": "...",
      "imo": "...",
      "callsign": "...",
      "shiptype": "Fishing"
    }
  ],
  "total": 150,
  "offset": 0,
  "limit": 5
}
```

---

## ✅ Test 4: Detalles de Embarcación

**Nota:** Primero obtén un `vesselId` válido del Test 3, luego:

```bash
# Reemplaza VESSEL_ID con un ID real
curl -X GET "http://localhost:5000/api/vessels/VESSEL_ID" \
  -H "Content-Type: application/json"
```

**Resultado esperado:** Objeto con detalles completos de la embarcación

---

## ✅ Test 5: Posiciones de Embarcación

```bash
# Reemplaza VESSEL_ID con un ID real
curl -X GET "http://localhost:5000/api/positions/VESSEL_ID?from=2024-01-01&to=2024-01-07" \
  -H "Content-Type: application/json"
```

**Resultado esperado:**
```json
{
  "vesselId": "...",
  "positions": [
    {
      "lat": 15.234,
      "lon": -90.456,
      "timestamp": "2024-01-01T12:00:00Z",
      "speed": 5.2,
      "course": 180
    }
  ],
  "total": 150
}
```

⚠️ **Si no tienes permisos de tracks:** Retorna `{ positions: [], total: 0, warning: "..." }`

---

## ✅ Test 6: Listar Zonas

```bash
curl -X GET "http://localhost:5000/api/zones?active=true" \
  -H "Content-Type: application/json"
```

**Resultado esperado:** Array de zonas (puede estar vacío inicialmente)

---

## ✅ Test 7: Crear Zona Protegida

```bash
curl -X POST "http://localhost:5000/api/zones" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Zona de Prueba Automatizada",
    "description": "Zona creada por script de pruebas",
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
```

**Resultado esperado:**
```json
{
  "id": "64f123...",
  "name": "Zona de Prueba Automatizada",
  "level": "high",
  "levelLabel": "Restricción Alta",
  "icon": "dangerous",
  "area": "125.34",
  "boats": 0,
  "created": "01/12/2024",
  "geometry": {...},
  "active": true
}
```

---

## ✅ Test 8: Obtener Zona por ID

```bash
# Reemplaza ZONE_ID con el ID del Test 7
curl -X GET "http://localhost:5000/api/zones/ZONE_ID" \
  -H "Content-Type: application/json"
```

---

## ✅ Test 9: Actualizar Zona

```bash
# Reemplaza ZONE_ID con el ID del Test 7
curl -X PUT "http://localhost:5000/api/zones/ZONE_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "level": "medium",
    "description": "Zona actualizada por script"
  }'
```

**Resultado esperado:** Zona con `level: "medium"` y `levelLabel: "Restricción Media"`

---

## ✅ Test 10: Listar Alertas

```bash
curl -X GET "http://localhost:5000/api/alerts?status=active" \
  -H "Content-Type: application/json"
```

**Resultado esperado:** Array de alertas (puede estar vacío inicialmente)

---

## ✅ Test 11: Ejecutar Detección de Alertas

```bash
# Reemplaza VESSEL_ID_1 y VESSEL_ID_2 con IDs reales del Test 3
curl -X POST "http://localhost:5000/api/alerts/run" \
  -H "Content-Type: application/json" \
  -d '{
    "vesselIds": ["VESSEL_ID_1", "VESSEL_ID_2"]
  }'
```

**Resultado esperado:**
```json
{
  "message": "Reglas de alertas ejecutadas",
  "vesselsProcessed": 2,
  "alertsCreated": 1,
  "alerts": [
    {
      "_id": "...",
      "priority": "high",
      "type": "zone_violation",
      "title": "Embarcación en Zona Prohibida",
      "vesselId": "...",
      "zoneName": "Zona de Prueba Automatizada"
    }
  ]
}
```

---

## ✅ Test 12: Resolver Alerta

```bash
# Reemplaza ALERT_ID con un ID del Test 11
curl -X PUT "http://localhost:5000/api/alerts/ALERT_ID/resolve" \
  -H "Content-Type: application/json" \
  -d '{
    "resolvedBy": "Script de Pruebas"
  }'
```

**Resultado esperado:**
```json
{
  "message": "Alerta resuelta",
  "alert": {
    "id": "...",
    "status": "resolved",
    "resolvedAt": "2024-01-12T10:30:00.000Z"
  }
}
```

---

## ✅ Test 13: Eliminar Zona

```bash
# Reemplaza ZONE_ID con el ID del Test 7
curl -X DELETE "http://localhost:5000/api/zones/ZONE_ID" \
  -H "Content-Type: application/json"
```

**Resultado esperado:**
```json
{
  "message": "Zona eliminada exitosamente",
  "id": "..."
}
```

---

## 🔄 Script Automático de Pruebas

**Archivo:** `test-gfw-integration.sh`

```bash
#!/bin/bash

BASE_URL="http://localhost:5000/api"

echo "🧪 Iniciando pruebas de integración GFW..."
echo ""

# Test 1: Dashboard
echo "✅ Test 1: Dashboard Summary"
curl -s "$BASE_URL/dashboard/summary" | jq
echo ""

# Test 2: Buscar embarcaciones
echo "✅ Test 2: Buscar embarcaciones"
SEARCH_RESULT=$(curl -s "$BASE_URL/vessels/search?query=pacific&limit=1")
echo $SEARCH_RESULT | jq
VESSEL_ID=$(echo $SEARCH_RESULT | jq -r '.vessels[0].id')
echo "Vessel ID obtenido: $VESSEL_ID"
echo ""

# Test 3: Detalles de embarcación
if [ ! -z "$VESSEL_ID" ] && [ "$VESSEL_ID" != "null" ]; then
  echo "✅ Test 3: Detalles de embarcación"
  curl -s "$BASE_URL/vessels/$VESSEL_ID" | jq
  echo ""
fi

# Test 4: Crear zona
echo "✅ Test 4: Crear zona protegida"
ZONE_RESULT=$(curl -s -X POST "$BASE_URL/zones" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Zona Test Automatizada",
    "level": "high",
    "geometry": {
      "type": "Polygon",
      "coordinates": [[[-90.5,15.2],[-90.3,15.2],[-90.3,15.4],[-90.5,15.4],[-90.5,15.2]]]
    }
  }')
echo $ZONE_RESULT | jq
ZONE_ID=$(echo $ZONE_RESULT | jq -r '.id')
echo "Zone ID creado: $ZONE_ID"
echo ""

# Test 5: Listar zonas
echo "✅ Test 5: Listar zonas"
curl -s "$BASE_URL/zones" | jq
echo ""

# Test 6: Ejecutar alertas
if [ ! -z "$VESSEL_ID" ] && [ "$VESSEL_ID" != "null" ]; then
  echo "✅ Test 6: Ejecutar detección de alertas"
  curl -s -X POST "$BASE_URL/alerts/run" \
    -H "Content-Type: application/json" \
    -d "{\"vesselIds\": [\"$VESSEL_ID\"]}" | jq
  echo ""
fi

# Test 7: Listar alertas
echo "✅ Test 7: Listar alertas"
curl -s "$BASE_URL/alerts" | jq
echo ""

# Test 8: Limpiar zona de prueba
if [ ! -z "$ZONE_ID" ] && [ "$ZONE_ID" != "null" ]; then
  echo "✅ Test 8: Eliminar zona de prueba"
  curl -s -X DELETE "$BASE_URL/zones/$ZONE_ID" | jq
  echo ""
fi

echo "🎉 Pruebas completadas"
```

**Uso:**
```bash
chmod +x test-gfw-integration.sh
./test-gfw-integration.sh
```

---

## 📊 Validación de Respuestas

### ✅ Respuesta Exitosa (200/201)
```json
{
  "data": {...}
}
```

### ❌ Error de Validación (400)
```json
{
  "error": "name y geometry son requeridos"
}
```

### ❌ No Encontrado (404)
```json
{
  "error": "Zona no encontrada"
}
```

### ❌ Error Interno (500)
```json
{
  "error": "Error obteniendo zonas"
}
```

---

## 🐛 Debugging

### Ver logs del servidor
```bash
# Terminal del servidor muestra logs automáticamente
Console.log en controllers:
- "🔍 Buscando: pacific"
- "⚠️ No se pudieron obtener tracks para..."
```

### Verificar MongoDB
```bash
mongosh
use security_phish
db.zones.find().pretty()
db.alerts.find().pretty()
```

### Verificar token GFW
```bash
curl -X GET "https://gateway.api.globalfishingwatch.org/v3/vessels/search?query=pacific&limit=1" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## ✅ Checklist Post-Pruebas

- [ ] Dashboard retorna KPIs correctos
- [ ] Búsqueda de embarcaciones funciona
- [ ] Detalles de embarcación se muestran
- [ ] Posiciones se obtienen (o warning si no hay permisos)
- [ ] Zonas se crean correctamente
- [ ] Área se calcula automáticamente
- [ ] Alertas se detectan
- [ ] Alertas se pueden resolver
- [ ] Zonas se pueden eliminar
- [ ] No hay errores 500 en servidor

---

**🎯 Si todos los tests pasan: INTEGRACIÓN EXITOSA ✅**
