# 🗺️ ZONAS PROTEGIDAS - CONCEPTO Y FUNCIONAMIENTO

## 📋 ¿QUÉ SON LAS ZONAS PROTEGIDAS?

Las **Zonas Protegidas** son áreas marítimas oficialmente designadas por las **autoridades gubernamentales** (como ministerios de medio ambiente, pesca, o guardacostas) que tienen restricciones especiales para proteger:

- 🐢 Especies marinas en peligro
- 🐟 Áreas de reproducción de peces
- 🌊 Ecosistemas marinos frágiles
- 🏝️ Reservas naturales costeras

---

## ✅ CONCEPTO CORRECTO

### **Las zonas protegidas NO deben ser creadas/editadas por usuarios comunes**

```
❌ INCORRECTO:                    ✅ CORRECTO:
Usuario → Crea zona              Autoridad → Define zona
Usuario → Edita límites          Sistema → Monitorea
Usuario → Elimina zona           Embarcaciones → Respetan
```

### **¿Por qué?**

1. **Son decisiones gubernamentales**: Requieren estudios científicos, aprobación legal
2. **Tienen implicaciones legales**: Violar una zona puede ser delito
3. **Son públicas y oficiales**: Deben estar registradas en sistemas nacionales/internacionales
4. **Son de largo plazo**: No cambian frecuentemente

---

## 🎯 FUNCIONAMIENTO EN EL SISTEMA

### **1. Administración de Zonas**

```
┌─────────────────────────────────────────────────┐
│  AUTORIDADES MARÍTIMAS                          │
├─────────────────────────────────────────────────┤
│  • Definen zonas protegidas                     │
│  • Publican coordenadas oficiales               │
│  • Establecen niveles de restricción            │
│  • Actualizan solo cuando es necesario          │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  SISTEMA SECURITY PHISH                         │
├─────────────────────────────────────────────────┤
│  • Carga zonas desde base de datos oficial      │
│  • Monitorea embarcaciones en tiempo real       │
│  • Detecta violaciones automáticamente          │
│  • Genera alertas cuando hay infracciones       │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  EMBARCACIONES                                   │
├─────────────────────────────────────────────────┤
│  • Consultan mapa de zonas protegidas           │
│  • Planifican rutas evitando áreas prohibidas   │
│  • Reciben alertas si se acercan a una zona     │
│  • Son sancionadas si violan restricciones      │
└─────────────────────────────────────────────────┘
```

---

## 🔒 NIVELES DE RESTRICCIÓN

### **🔴 RESTRICCIÓN ALTA (high)**
```
⛔ PROHIBIDO TOTALMENTE
━━━━━━━━━━━━━━━━━━━━━━━━━
• NO se permite ninguna actividad pesquera
• NO se permite navegación (excepto paso inocente)
• Solo acceso autorizado con permiso especial
• Violación = Multa grave + Detención de embarcación

EJEMPLOS:
- Zonas de reproducción de especies en peligro
- Santuarios marinos
- Áreas de desove de tortugas
- Arrecifes de coral protegidos
```

### **🟡 RESTRICCIÓN MEDIA (medium)**
```
⚠️  REGULADO - Permiso requerido
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Pesca permitida SOLO con licencia especial
• Cuotas de captura limitadas
• Métodos de pesca restringidos (no redes de arrastre)
• Horarios específicos
• Reportes obligatorios

EJEMPLOS:
- Reservas marinas reguladas
- Áreas de pesca sostenible
- Zonas con cuotas anuales
```

### **🔵 MONITOREO (low)**
```
👁️  VIGILANCIA ACTIVA
━━━━━━━━━━━━━━━━━━━━━━
• Pesca permitida normalmente
• Actividad monitoreada constantemente
• Reportes recomendados
• Inspecciones aleatorias

EJEMPLOS:
- Zonas bajo estudio científico
- Áreas con actividad sospechosa previa
- Corredores migratorios
```

---

## 📊 DATOS ACTUALES EN EL SISTEMA

### **Zona 1: Zona Protegida Norte**
```
🔴 RESTRICCIÓN ALTA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Descripción: Zona de reproducción de especies protegidas
Área: 125.34 km²
Embarcaciones detectadas: 0 (correcto ✅)
Coordenadas: [-90.5, 15.2] a [-90.3, 15.4]

Estado: Activa
Violaciones recientes: 0
```

### **Zona 2: Reserva Marina Este**
```
🟡 RESTRICCIÓN MEDIA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Descripción: Zona de pesca regulada
Área: 88.5 km²
Embarcaciones detectadas: 2 (con permiso ✅)
Coordenadas: [-89.5, 14.5] a [-89.2, 14.8]

Estado: Activa
Licencias emitidas: 5
```

### **Zona 3: Área de Conservación Sur**
```
🔵 MONITOREO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Descripción: Zona bajo monitoreo constante
Área: 200 km²
Embarcaciones detectadas: 8 (normal ✅)
Coordenadas: [-91.0, 13.5] a [-90.5, 14.0]

Estado: Activa
Actividad: Normal
```

---

## 🎮 FUNCIONALIDADES DISPONIBLES

### **✅ VER EN MAPA**
```
Función: focusZone(zone)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Centra el mapa en la zona seleccionada
• Hace zoom apropiado
• Abre popup con información
• Resalta el polígono

Uso: Para ubicar visualmente una zona específica
```

### **ℹ️ DETALLES**
```
Función: showZoneDetails(zone)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Muestra información completa
• Nivel de restricción con explicación
• Área y embarcaciones detectadas
• Descripción oficial
• Nota sobre administración

Uso: Para consultar información detallada de la zona
```

### **❌ FUNCIONES DESHABILITADAS**

**No disponibles para usuarios:**
- ❌ Crear nueva zona
- ❌ Editar zona existente
- ❌ Eliminar zona
- ❌ Modificar coordenadas
- ❌ Cambiar nivel de restricción

**Motivo:** Solo las autoridades marítimas pueden modificar zonas protegidas.

---

## 🔄 FLUJO DE USO CORRECTO

### **PARA EMBARCACIONES:**

```
1. Consultar mapa de zonas protegidas
   ↓
2. Identificar zonas en su ruta
   ↓
3. Verificar nivel de restricción
   ↓
4. Planificar ruta alternativa (si es zona roja)
   ↓
5. Solicitar permiso (si es zona naranja)
   ↓
6. Navegar con precaución (si es zona azul)
```

### **PARA EL SISTEMA:**

```
1. Cargar zonas desde MongoDB (predefinidas)
   ↓
2. Obtener posiciones de embarcaciones (GFW)
   ↓
3. Verificar si alguna está en zona prohibida
   ↓
4. Generar alerta automática si hay violación
   ↓
5. Notificar a autoridades
   ↓
6. Actualizar contador de embarcaciones en zona
```

---

## 🛠️ CÓMO SE AGREGAN ZONAS REALES

### **Método 1: Script de inicialización (Desarrollo/Testing)**
```bash
cd src/backend
node init-test-data.js
```

### **Método 2: Importación oficial (Producción)**
```javascript
// Importar desde archivo GeoJSON oficial
import fs from 'fs';
import Zone from './models/Zone.js';

const officialZones = JSON.parse(
  fs.readFileSync('zonas_oficiales_2026.geojson', 'utf8')
);

for (const zone of officialZones.features) {
  await Zone.create({
    name: zone.properties.name,
    description: zone.properties.description,
    level: zone.properties.restriction_level,
    geometry: zone.geometry,
    createdBy: 'Ministerio de Pesca y Acuicultura'
  });
}
```

### **Método 3: API de sincronización**
```javascript
// Sincronizar con base de datos nacional
const syncWithNationalDatabase = async () => {
  const response = await fetch('https://api.gobierno.gt/zonas-marinas');
  const officialZones = await response.json();
  
  // Actualizar zonas locales
  await Zone.deleteMany({});
  await Zone.insertMany(officialZones);
};
```

---

## 📱 INTERFAZ DE USUARIO

### **Lo que el usuario VE:**

```
┌────────────────────────────────────────────┐
│  Zonas Protegidas                          │
│  ℹ️ Zonas marinas oficiales definidas por │
│     las autoridades. Las embarcaciones     │
│     deben respetar estas áreas.            │
├────────────────────────────────────────────┤
│  MAPA          │  Lista de Zonas           │
│  [Interactivo] │  • Zona Norte 🔴          │
│                │  • Reserva Este 🟡        │
│                │  • Área Sur 🔵            │
│                │                            │
│                │  Botones por zona:        │
│                │  [👁️ Ver en mapa]         │
│                │  [ℹ️ Detalles]            │
└────────────────────────────────────────────┘
```

### **Lo que el usuario NO VE:**

```
❌ Botón "Nueva zona"
❌ Botón "Editar"
❌ Botón "Eliminar"
❌ Formularios de creación
❌ Opciones de administración
```

---

## 🎯 CASO DE USO REAL

### **Ejemplo: Embarcación "Pelícano Azul"**

```
Situación: Barco pesquero planifica ruta
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Capitán abre Security Phish
2. Ve mapa con zonas protegidas marcadas
3. Identifica:
   🔴 Zona Norte → EVITAR completamente
   🟡 Reserva Este → Requiere permiso
   🔵 Área Sur → Puede navegar con cuidado

4. Planifica ruta:
   ✅ Rodea Zona Norte
   ✅ Solicita permiso para Reserva Este
   ✅ Transita por Área Sur reportando posición

5. Sistema monitorea:
   ✅ No entra a zona roja
   ✅ Verifica permiso en zona naranja
   ✅ Registra actividad en zona azul

Resultado: ✅ Navegación conforme a regulaciones
```

---

## ✅ RESUMEN

**Concepto correcto de Zonas Protegidas:**

✅ Definidas por autoridades gubernamentales  
✅ Basadas en estudios científicos  
✅ Con respaldo legal  
✅ De conocimiento público  
✅ Actualizadas solo cuando es necesario  

**En el sistema:**

✅ Solo visualización y consulta  
✅ No edición por usuarios  
✅ Detección automática de violaciones  
✅ Generación de alertas  
✅ Monitoreo en tiempo real  

**Las embarcaciones:**

✅ Conocen las zonas antes de navegar  
✅ Planifican rutas respetando restricciones  
✅ Solicitan permisos cuando es necesario  
✅ Son monitoreadas automáticamente  
✅ Reciben alertas si violan zonas  

---

## 🔗 INTEGRACIÓN CON SISTEMA DE ALERTAS

Cuando una embarcación entra a una zona prohibida:

```
1. Scheduler detecta embarcación en zona roja
2. Crea alerta automática (priority: high)
3. Guarda en MongoDB
4. Dashboard muestra en "Alertas Críticas"
5. Notifica a autoridades (próximamente)
6. Incrementa contador de zona.boats
```

**El sistema funciona 24/7 protegiendo las zonas marinas.** 🛡️🌊
