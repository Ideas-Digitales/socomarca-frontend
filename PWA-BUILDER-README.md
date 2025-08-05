# PWA Builder - Instrucciones para Aplicaciones Móviles

## Configuración Completada ✅

Tu proyecto Next.js ya está configurado como PWA y listo para ser convertido a aplicaciones móviles nativas usando PWA Builder.

## Archivos Configurados

- ✅ `public/manifest.json` - Manifesto de la PWA
- ✅ `public/pwa-builder-config.json` - Configuración específica para PWA Builder
- ✅ `src/app/layout.tsx` - Meta tags optimizados para móviles
- ✅ `next.config.mjs` - Configuración de PWA con cache offline
- ✅ `src/app/offline/page.tsx` - Página de offline

## Pasos para Generar Aplicaciones Móviles

### 1. Construir el Proyecto

```bash
npm run build
npm run start
```

### 2. Usar PWA Builder

1. **Ve a [PWA Builder](https://www.pwabuilder.com/)**
2. **Ingresa la URL de tu aplicación** (ej: `https://tu-dominio.com`)
3. **PWA Builder detectará automáticamente** tu manifest.json
4. **Revisa y ajusta la configuración** si es necesario

### 3. Generar Aplicaciones

#### Para Android:
- Haz clic en "Build My PWA"
- Selecciona "Android"
- Descarga el archivo APK o AAB
- Instala en dispositivos Android

#### Para iOS:
- Haz clic en "Build My PWA"
- Selecciona "iOS"
- Descarga el proyecto Xcode
- Abre en Xcode y compila para iOS

#### Para Windows:
- Haz clic en "Build My PWA"
- Selecciona "Windows"
- Descarga el paquete MSIX
- Instala en Windows 10/11

## Configuraciones Específicas por Plataforma

### Android
- **Package Name**: `com.socomarca.app`
- **Version**: 1.0.0
- **Icono Adaptativo**: Configurado con color verde (#00ff00)
- **Permisos**: Internet y estado de red

### iOS
- **Bundle ID**: `com.socomarca.app`
- **Version**: 1.0.0
- **Icono**: 180x180px optimizado para iOS
- **Splash Screen**: Configurado

### Windows
- **Package Name**: `com.socomarca.app`
- **Version**: 1.0.0.0
- **Tile Color**: Verde (#00ff00)

## Características PWA Implementadas

- ✅ **Instalable** - Se puede instalar como app nativa
- ✅ **Offline** - Funciona sin conexión (página offline)
- ✅ **Cache** - Almacena recursos para uso offline
- ✅ **Responsive** - Optimizado para móviles
- ✅ **Fast Loading** - Carga rápida con service worker
- ✅ **App-like** - Experiencia similar a app nativa

## Testing

### Probar PWA Localmente:
1. Ejecuta `npm run build && npm run start`
2. Abre Chrome DevTools
3. Ve a la pestaña "Application"
4. Verifica que el Service Worker esté registrado
5. Prueba la instalación desde el menú de Chrome

### Probar Offline:
1. Abre la aplicación
2. Desactiva la conexión a internet
3. Recarga la página
4. Deberías ver la página de offline

## Optimizaciones Adicionales

### Para Mejor Rendimiento:
- Las imágenes están optimizadas con WebP/AVIF
- El service worker cachea recursos importantes
- La aplicación se carga en modo standalone

### Para Mejor UX:
- Iconos maskable para Android
- Splash screens configuradas
- Shortcuts para acceso rápido

## Troubleshooting

### Si PWA Builder no detecta el manifest:
1. Verifica que el servidor esté corriendo
2. Asegúrate de que `/manifest.json` sea accesible
3. Revisa la consola del navegador por errores

### Si la app no se instala:
1. Verifica que HTTPS esté configurado
2. Asegúrate de que el service worker esté registrado
3. Revisa que los iconos estén disponibles

### Si hay problemas de cache:
1. Limpia el cache del navegador
2. Desregistra el service worker
3. Recarga la página

## Próximos Pasos

1. **Despliega tu aplicación** en un servidor con HTTPS
2. **Prueba PWA Builder** con la URL de producción
3. **Genera las aplicaciones** para cada plataforma
4. **Sube a las tiendas** (Google Play, App Store, Microsoft Store)

## Recursos Útiles

- [PWA Builder Documentation](https://docs.pwabuilder.com/)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [PWA Checklist](https://web.dev/pwa-checklist/)

---

¡Tu aplicación está lista para ser convertida a móvil! 🚀 