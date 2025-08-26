# 🎰 Ruleta de Premios

Una aplicación web interactiva desarrollada en Next.js que simula una ruleta de premios con animaciones suaves y gestión dinámica de premios.

## ✨ Características

- **Ruleta animada**: Animación suave y realista con física de rotación
- **Gestión de premios**: Agregar, editar y eliminar premios dinámicamente
- **Colores personalizables**: Cada premio puede tener su propio color
- **Interfaz intuitiva**: Diseño moderno y responsivo
- **Modal de ganador**: Animación especial al ganar un premio
- **Premios sugeridos**: Botones rápidos para agregar premios comunes

## 🚀 Instalación y Uso

1. **Instalar dependencias**:
```bash
npm install
```

2. **Ejecutar en modo desarrollo**:
```bash
npm run dev
```

3. **Abrir en el navegador**:
Visita [http://localhost:3000](http://localhost:3000)

## 🎮 Cómo usar

1. **Gestionar Premios**: Haz clic en "Gestionar Premios" para:
   - Agregar nuevos premios con texto y color personalizados
   - Editar premios existentes
   - Eliminar premios que no necesites
   - Usar premios sugeridos para agregar rápidamente

2. **Girar la Ruleta**: 
   - Presiona el botón rojo "GIRAR" en el centro
   - La ruleta girará con animación realista
   - Espera a que se detenga para ver el premio ganador

3. **Ver Resultado**:
   - Se mostrará un modal con el premio ganador
   - Incluye efectos visuales de celebración
   - Opción para girar nuevamente

## 🛠️ Tecnologías Utilizadas

- **Next.js 14**: Framework de React con App Router
- **TypeScript**: Tipado estático para mejor desarrollo
- **Tailwind CSS**: Estilos utilitarios para diseño responsivo
- **SVG**: Gráficos vectoriales para la ruleta
- **CSS Animations**: Animaciones suaves y personalizadas

## 📱 Características Responsivas

- Funciona perfectamente en dispositivos móviles y escritorio
- Diseño adaptativo que se ajusta a diferentes tamaños de pantalla
- Interfaz táctil optimizada para dispositivos móviles

## 🎨 Personalización

### Colores de Premios
Los premios incluyen una paleta de colores predefinida, pero puedes personalizar cada premio individualmente usando el selector de color.

### Texto de Premios
Puedes usar cualquier texto para los premios:
- Cantidades de dinero ($100, $50, etc.)
- Productos (iPhone, Laptop, etc.)  
- Experiencias (Viaje, Cena, etc.)
- Mensajes personalizados

## 🏗️ Estructura del Proyecto

```
src/
├── app/
│   ├── globals.css      # Estilos globales
│   ├── layout.tsx       # Layout principal
│   └── page.tsx         # Página principal
├── components/
│   ├── SpinWheel.tsx    # Componente de la ruleta
│   ├── PrizeManager.tsx # Gestión de premios
│   └── WinnerModal.tsx  # Modal del ganador
└── types/
    └── index.ts         # Tipos TypeScript
```

## 🎯 Próximas Mejoras

- [ ] Guardar premios en localStorage
- [ ] Sonidos de la ruleta
- [ ] Historial de ganadores
- [ ] Compartir resultados en redes sociales
- [ ] Temas personalizables
- [ ] Probabilidades ajustables por premio

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

¡Disfruta girando la ruleta y ganando premios! 🎉
