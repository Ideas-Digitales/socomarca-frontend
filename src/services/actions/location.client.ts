import { BACKEND_URL } from '@/utils/getEnv'

export interface Region {
  id: number
  name: string
  status: boolean
}

export interface Municipality {
  id: number
  name: string
  status: boolean
}

export async function getRegions(): Promise<Region[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/regions`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!res.ok) throw new Error('Error al obtener regiones')
    const regions = await res.json()
    // Filtrar solo las regiones con status: true
    return regions.filter((region: Region) => region.status === true)
  } catch (e) {
    console.error(e)
    return []
  }
}

export async function getMunicipalities(regionId: number): Promise<Municipality[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/municipalities/${regionId}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!res.ok) throw new Error('Error al obtener comunas')
    const municipalities = await res.json()
    // Filtrar solo las comunas con status: true
    return municipalities.filter((municipality: Municipality) => municipality.status === true)
  } catch (e) {
    console.error(e)
    return []
  }
} 