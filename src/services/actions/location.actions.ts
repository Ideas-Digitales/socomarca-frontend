'use server'

import { BACKEND_URL } from '@/utils/getEnv'
import { cookiesManagement } from '@/stores/base/utils/cookiesManagement'

export interface Region {
  id: number
  name: string
}

export interface Municipality {
  id: number
  name: string
  status: boolean
}

export async function getRegions(): Promise<Region[]> {
  const { getCookie } = await cookiesManagement()
  const token = getCookie('token')

  if (!token) return []

  try {
    const res = await fetch(`${BACKEND_URL}/regions`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!res.ok) throw new Error('Error al obtener regiones')
    return await res.json()
  } catch (e) {
    console.error(e)
    return []
  }
}

export async function getMunicipalities(regionId: number): Promise<Municipality[]> {
  const { getCookie } = await cookiesManagement()
  const token = getCookie('token')

  if (!token) return []

  try {
    const res = await fetch(`${BACKEND_URL}/municipalities/${regionId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!res.ok) throw new Error('Error al obtener comunas')
    return await res.json()
  } catch (e) {
    console.error(e)
    return []
  }
}
