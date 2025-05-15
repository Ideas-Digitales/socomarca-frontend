import { Category } from "@/interfaces/category.interface";

export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Despensa',
    isOpen: true,
    hasSubCategories: true,
    subCategories: Array(11)
      .fill(null)
      .map((_, i) => ({
        id: `1-${i}`,
        name: 'XS normal',
      })),
  },
  {
    id: '2',
    name: 'Hogar y limpieza',
    hasSubCategories: true,
  },
  {
    id: '3',
    name: 'Lácteos y fiambre',
    hasSubCategories: true,
  },
  {
    id: '4',
    name: 'Cuidado personal',
    hasSubCategories: true,
  },
  {
    id: '5',
    name: 'Bebestibles',
    hasSubCategories: true,
  },
  {
    id: '6',
    name: 'Confites',
    hasSubCategories: true,
  },
];
