'use server'

import { cookiesManagement } from '@/stores/base/utils/cookiesManagement';
import { BACKEND_URL } from '@/utils/getEnv';

export interface Address {
  id: number
  address_line1: string
  address_line2: string
  postal_code: string
  is_default: boolean
  type: 'shipping' | 'billing' | string
  phone: string
  contact_name: string
  municipality_name: string
  region_name: string
  alias: string | null
}

interface AddressResponse {
  data: Address[]
}

export async function getUserAddresses(): Promise<Address[] | null> {
    const { getCookie } = await cookiesManagement();
  const authToken = getCookie('token');

  if (!authToken) return null

  try {
    const res = await fetch( `${BACKEND_URL}/addresses/`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      cache: 'no-store',
    })

    if (!res.ok) {
      console.error('Error al obtener direcciones:', res.statusText)
      return null
    }

    const json: AddressResponse = await res.json()
    return json.data
  } catch (error) {
    console.error('Error de red al obtener direcciones:', error)
    return null
  }
}
