import { LoginResponse } from '@/interfaces/user.interface';

export const mockResponse: LoginResponse = {
  user: {
    id: 1,
    name: 'Sebastian Oberbrunner',
    rut: '23843925-6',
    email: 'paul.sporer@example.org',
    roles: ['admin', 'superadmin', 'cliente'],
    permissions: [
      'see-own-purchases',
      'see-all-reports',
      'see-all-products',
      'see-all-clients',
      'see-all-purchases',
      'edit-content',
      'edit-products',
      'manage-users',
      'manage-categories',
      'see-all-addresses',
      'see-own-addresses',
      'store-address',
      'update-address',
      'delete-address',
      'manage-faq',
      'store-faq',
      'update-faq',
      'delete-faq',
    ],
  },
};
