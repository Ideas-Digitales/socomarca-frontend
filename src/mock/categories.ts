import { CategoryComponent } from '@/interfaces/category.interface';

export const mockCategories: CategoryComponent[] = [
  {
    id: 1,
    name: 'Despensa',
    isOpen: true,
    hasSubCategories: true,
    subCategories: [
      { id: '1-1', name: 'Aceites y grasas' },
      { id: '1-2', name: 'Arroz, pastas y legumbres' },
      { id: '1-3', name: 'Conservas y salsas' },
      { id: '1-4', name: 'Especias y condimentos' },
      { id: '1-5', name: 'Harinas y azúcares' },
      { id: '1-6', name: 'Snacks y galletas' },
    ],
  },
  {
    id: 2,
    name: 'Hogar y limpieza',
    hasSubCategories: true,
    subCategories: [],
  },
  {
    id: 3,
    name: 'Lácteos y fiambre',
    hasSubCategories: true,
    subCategories: [],
  },
  {
    id: 4,
    name: 'Cuidado personal',
    hasSubCategories: true,
    subCategories: [],
  },
  {
    id: 5,
    name: 'Bebestibles',
    hasSubCategories: true,
    subCategories: [],
  },
  {
    id: 6,
    name: 'Confites',
    hasSubCategories: true,
    subCategories: [],
  },
];
