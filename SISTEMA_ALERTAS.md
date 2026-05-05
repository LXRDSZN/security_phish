# 📚 SISTEMA AUTOMÁTICO DE ALERTAS - GUÍA COMPLETA

## 🚀 ¿QUÉ SE IMPLEMENTÓ?

Se ha agregado un **sistema automático de detección de alertas** que funciona en segundo plano, analizando embarcaciones cada 30 minutos.

---

## ⚙️ CÓMO FUNCIONA

### 1️⃣ **Análisis Automático Periódico**

El servidor ejecuta automáticamente cada **30 minutos**:

```
┌─────────────────────────────────────────────────────┐
│  🤖 SCHEDULER AUTOMÁTICO                            │
├─────────────────────────────────────────────────────┤
│  1. Obtiene zonas protegidas de MongoDB            │
│  2. Busca embarcaciones activas en GFW              │
│  3. Verifica si están en zonas prohibidas           │
│  4. Crea alertas automáticamente                    │
│  5. Evita duplicados (24h)                          │
└─────────────────────────────────────────────────────┘
```

### 2️⃣ **Tipos de Alertas Generadas**

| Prioridad | Tipo | Cuándo se genera |
|-----------|------|------------------|
| 🔴 **ALTA** | `zone_violation` | Embarcación en zona `level: high` |
| 🟡 **MEDIA** | `prolonged_stay` | Embarcación en zona `level: medium` |
| 🔵 **BAJA** | `no_report` | Manual (no automático aún) |

---

## 📊 CONTADORES DEL DASHBOARD

Los contadores se actualizan en base a alertas en MongoDB:

```javascript
// Dashboard KPIs
{
  "Alertas Críticas": Alert.countDocuments({ priority: 'high', status: 'active' }),
  "Alertas Medias": Alert.countDocuments({ priority: 'medium', status: 'active' }),
  "Alertas Informativas": Alert.countDocuments({ priority: 'low', status: 'active' }),
  "Resueltas Hoy": Alert.countDocuments({ 
    status: 'resolved', 
    resolvedAt: { $gte: today } 
  })
}
```

---

## 🗺️ ZONAS PROTEGIDAS

### ¿Cómo se crean las zonas?

#### **Método 1: Usando el script de inicialización**

```bash
cd src/backend
node init-test-data.js
```

Esto crea 3 zonas de prueba:
- ✅ **Zona Protegida Norte** (alta prioridad)
- ✅ **Reserva Marina Este** (media prioridad)
- ✅ **Área de Conservación Sur** (monitoreo)

#### **Método 2: Vía API REST**

```bash
# Crear nueva zona
POST http://localhost:5000/api/zones
Content-Type: application/json

{
  "name": "Mi Zona Protegida",
  "description": "Zona de reproducción de tortugas marinas",
  "level": "high",
  "geometry": {
    "type": "Polygon",
    "coordinates": [[
      [-92.0, 16.0],
      [-91.5, 16.0],
      [-91.5, 16.5],
      [-92.0, 16.5],
      [-92.0, 16.0]
    ]]
  }
}
```

**Niveles de zona:**
- `high`: Restricción Alta (genera alertas críticas)
- `medium`: Restricción Media (genera alertas medias)
- `low`: Monitoreo (solo seguimiento)

### **Ver todas las zonas**

```bash
GET http://localhost:5000/api/zones
```

### **Actualizar zona**

```bash
PUT http://localhost:5000/api/zones/{id}
Content-Type: application/json

{
  "name": "Nuevo nombre",
  "level": "medium",
  "active": true
}
```

### **Eliminar zona**

```bash
DELETE http://localhost:5000/api/zones/{id}
```

---

## 🔥 ENDPOINTS DE ALERTAS

### 1. **Ver todas las alertas**

```bash
# Alertas activas
GET http://localhost:5000/api/alerts?status=active

# Alertas por prioridad
GET http://localhost:5000/api/alerts?priority=high&status=active

# Alertas resueltas
GET http://localhost:5000/api/alerts?status=resolved
```

### 2. **Ejecutar análisis inmediato**

```bash
# Forzar análisis sin esperar el scheduler
POST http://localhost:5000/api/alerts/analyze

# Respuesta:
{
  "message": "Análisis automático ejecutado",
  "vesselsAnalyzed": 50,
  "alertsCreated": 3,
  "duration": "2.45"
}
```

### 3. **Resolver alerta**

```bash
PUT http://localhost:5000/api/alerts/{alertId}/resolve
Content-Type: application/json

{
  "resolvedBy": "Juan Pérez"
}
```

---

## 🎮 CONFIGURACIÓN DEL SCHEDULER

En `server.js` puedes ajustar la frecuencia:

```javascript
// Cada 30 minutos (default)
startAlertScheduler(30);

// Cada 1 hora
startAlertScheduler(60);

// Cada 5 minutos (pruebas)
startAlertScheduler(5);
```

---

## 📈 LOGS DEL SISTEMA

Al iniciar el servidor verás:

```
✅ Servidor corriendo en el puerto 5000

🤖 ========================================
   SISTEMA AUTOMÁTICO DE ALERTAS INICIADO
   Intervalo: cada 30 minutos
   Próxima ejecución: 11:30:00
========================================

🔍 [SCHEDULER] Iniciando análisis automático...
   📍 Zonas activas encontradas: 3
   🚢 Embarcaciones obtenidas de GFW: 50
   🚨 ALERTA CREADA: MMSI-12345 en Zona Protegida Norte
   
✅ [SCHEDULER] Análisis completado en 2.34s
   📊 Embarcaciones analizadas: 50
   🚨 Alertas nuevas creadas: 2
```

---

## 🧪 PRUEBA EL SISTEMA

### **Paso 1: Reiniciar el servidor**

```bash
cd src/backend
node server.js
```

Verás inmediatamente el primer análisis automático.

### **Paso 2: Verificar alertas en el dashboard**

Abre: http://localhost:5173/Dashboard

Los contadores deberían actualizarse automáticamente.

### **Paso 3: Forzar análisis manual**

```bash
curl -X POST http://localhost:5000/api/alerts/analyze
```

### **Paso 4: Ver alertas creadas**

```bash
curl http://localhost:5000/api/alerts?status=active
```

---

## 🛠️ SOLUCIÓN DE PROBLEMAS

### ❌ **No se generan alertas**

**Causa:** No hay zonas activas en la BD

**Solución:**
```bash
cd src/backend
node init-test-data.js
```

### ❌ **Error "No vessels found"**

**Causa:** Global Fishing Watch API no responde

**Solución:** El sistema usa embarcaciones de prueba automáticamente como fallback.

### ❌ **Alertas duplicadas**

**No debe pasar:** El sistema verifica si ya existe una alerta similar en las últimas 24h.

---

## 📋 RESUMEN

✅ **Sistema automático funcionando** cada 30 minutos  
✅ **Detecta embarcaciones en zonas prohibidas**  
✅ **Crea alertas en MongoDB automáticamente**  
✅ **Previene duplicados**  
✅ **Dashboard muestra contadores en tiempo real**  
✅ **API REST completa para gestión**  
✅ **Sistema de zonas protegidas CRUD**  

---

## 🎯 PRÓXIMOS PASOS OPCIONALES

1. **Notificaciones por email/SMS** cuando se crea alerta crítica
2. **Dashboard de alertas dedicado** (además del resumen)
3. **Exportar alertas a Excel/PDF**
4. **Integración con sistema de permisos** (solo admins resuelven)
5. **Alertas de velocidad excesiva**
6. **Detección de patrón de pesca ilegal**

---

## 📞 COMANDOS ÚTILES

```bash
# Ver zonas activas
curl http://localhost:5000/api/zones?active=true

# Ver alertas del día
curl "http://localhost:5000/api/alerts?from=$(date +%Y-%m-%d)"

# Ejecutar análisis inmediato
curl -X POST http://localhost:5000/api/alerts/analyze

# Contar alertas por prioridad
curl "http://localhost:5000/api/alerts?priority=high" | jq '. | length'
```
