# Componentes de Skeleton

Esta carpeta contiene componentes de skeleton para mejorar la experiencia de usuario durante las operaciones de carga.

## Componentes Disponibles

### TableSkeleton
Esqueleto para tablas de datos con columnas y filas configurables.

```tsx
import { TableSkeleton } from '@/app/components/global/skeletons';

<TableSkeleton 
  columns={7} 
  rows={10} 
  title="Productos" 
/>
```

### FilterSkeleton
Esqueleto para filtros con diferentes tipos (dropdown, search, button).

```tsx
import { FilterSkeleton } from '@/app/components/global/skeletons';

<FilterSkeleton 
  type="dropdown" 
  label="Categoría" 
  width="w-64" 
  height="h-10" 
/>
```

### CardSkeleton
Esqueleto para tarjetas de productos con elementos configurables.

```tsx
import { CardSkeleton } from '@/app/components/global/skeletons';

<CardSkeleton 
  showImage={true}
  showTitle={true}
  showDescription={true}
  showPrice={true}
  showButton={true}
/>
```

### ProductListSkeleton
Esqueleto para listas de productos con grid configurable.

```tsx
import { ProductListSkeleton } from '@/app/components/global/skeletons';

<ProductListSkeleton 
  count={8} 
  gridCols={4} 
/>
```

### TableLoadingOverlay
Overlay de carga para tablas existentes.

```tsx
import { TableLoadingOverlay } from '@/app/components/global/skeletons';

<div className="relative">
  <CustomTable data={data} columns={columns} />
  <TableLoadingOverlay 
    isLoading={loading} 
    message="Aplicando filtros..." 
  />
</div>
```

## Uso en Páginas

### Ejemplo de implementación en página de productos:

```tsx
// Estado de carga
const [initialLoading, setInitialLoading] = useState(true);
const [loading, setLoading] = useState(false);
const [searching, setSearching] = useState(false);
const [sorting, setSorting] = useState(false);

// Renderizado condicional
{initialLoading ? (
  <TableSkeleton columns={columns.length} rows={10} title="Productos" />
) : (
  <div className="relative w-full">
    <CustomTable
      title="Productos"
      data={data}
      columns={columns}
      productPaginationMeta={meta}
      onPageChange={setPage}
    />
    <TableLoadingOverlay 
      isLoading={loading} 
      message={
        loading 
          ? searching 
            ? "Buscando productos..." 
            : sorting
              ? "Ordenando productos..."
              : "Aplicando filtros..." 
          : ""
      } 
    />
  </div>
)}
```

## Características

- **Animaciones suaves**: Todos los skeletons usan `animate-pulse` de Tailwind CSS
- **Responsive**: Se adaptan a diferentes tamaños de pantalla
- **Configurables**: Parámetros personalizables para diferentes casos de uso
- **Accesibles**: Mantienen la estructura semántica correcta
- **Consistentes**: Diseño uniforme en toda la aplicación

## Mejores Prácticas

1. **Usar estados específicos**: Crear estados separados para diferentes tipos de carga
2. **Mensajes descriptivos**: Proporcionar mensajes claros sobre la acción en curso
3. **Tiempo de carga**: Mostrar skeletons inmediatamente al iniciar la carga
4. **Transiciones suaves**: Usar overlays para operaciones rápidas
5. **Feedback visual**: Combinar skeletons con spinners para mejor UX 