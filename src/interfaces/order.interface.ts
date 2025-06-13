interface BillingAddress {
  address_line1: string;
  address_line2: string;
  contact_name: string;
  created_at: Date;
  id: number;
  is_default: boolean;
  municipality_id: number;
  phone: string;
  postal_code: string;
  type: string;
  updated_at: Date;
  user_id: number;
}
export interface UserData {
  billing_address: BillingAddress;
  business_name: string;
  created_at: Date;
  email: string;
  email_verified_at: Date | null;
  id: number;
  is_active: boolean;
  last_login: Date | null;
  name: string;
  password_changed_at: Date | null;
  phone: string;
  rut: string;
  updated_at: Date;
}

export interface OrderDataForm {
  nombre: string;
  rut: string;
  correo: string;
  telefono: string;
  region: string;
  comuna: string;
  direccionId: number;
  detallesDireccion: string;
}
