// Permisos para cada tipo de usuario en la plataforma
// Administrador, Super Administrador, Colaborador, Editor

export const PERMISOS = {
  administrador: [
    "can-see-own-purchases",
    "can-see-all-products",
    "can-edit-products",
    "can-manage-users",
    "can-see-all-purchases",
    "can-manage-permissions",
    "can-edit-content"
  ],
  superAdministrador: [
    "can-see-own-purchases",
    "can-see-all-products",
    "can-edit-products",
    "can-manage-users",
    "can-see-all-purchases",
    "can-manage-permissions",
    "can-edit-content",
    "can-manage-admins"
  ],
  colaborador: [
    "can-see-own-purchases",
    "can-see-all-products",
    "can-edit-products",
    "can-edit-content"
  ],
  editor: [
    "can-see-own-purchases",
    "can-see-all-products",
    "can-edit-content"
  ]
};
