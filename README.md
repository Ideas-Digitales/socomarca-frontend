# Socomarca 🌱



### 🚀 Iniciar proyecto

1. **Instala las dependencias** (usamos `pnpm` como gestor de paquetes):

```
pnpm install
```

2. Configura las variables de entorno:

```
cp .env.example .env
```

Luego edita el archivo .env para declarar tus variables según el entorno.

Variables relevantes:

```env
NEXT_PUBLIC_FIXED_SHIPPING_COST=5990
```

`NEXT_PUBLIC_FIXED_SHIPPING_COST` define el costo fijo de envío mostrado en checkout cuando la compra es menor a `$70.000`. Desde `$70.000` el envío se muestra gratis.

3. Inicia el servidor de desarrollo:

```
pnpm dev
```

Abre http://localhost:3000 en tu navegador para ver la app en acción.
