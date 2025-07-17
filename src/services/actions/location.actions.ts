'use server'

import { BACKEND_URL } from '@/utils/getEnv'
import { cookiesManagement } from '@/stores/base/utils/cookiesManagement'

export interface Municipality {
  id: number
  name: string
  status: boolean
  region_id: number
}

export interface Region {
  id: number
  name: string
  status: boolean
  municipalities: Municipality[]
}

export interface MunicipalityForFilter {
  id: number
  name: string
}

export async function getRegionsWithMunicipalities(): Promise<Region[]> {
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
    const res = await fetch(`${BACKEND_URL}/regions/${regionId}`, {
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

export async function updateMunicipalitiesStatus(municipalityIds: number[], status: boolean): Promise<boolean> {
  const { getCookie } = await cookiesManagement();
  const token = getCookie('token');

  if (!token) return false;

  try {
    const res = await fetch(`${BACKEND_URL}/municipalities/status`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        municipality_ids: municipalityIds,
        status,
      }),
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Error al actualizar estado de comunas');
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function updateRegionStatus(regionId: number, status: boolean): Promise<boolean> {
  const { getCookie } = await cookiesManagement();
  const token = getCookie('token');

  if (!token) return false;

  try {
    const res = await fetch(`${BACKEND_URL}/regions/${regionId}/municipalities/status`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Error al actualizar estado de la región');
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}