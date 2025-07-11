import { StateCreator } from 'zustand'
import { getRegionsWithMunicipalities, Region, MunicipalityForFilter } from '@/services/actions/location.actions'

// Función auxiliar para obtener todas las comunas activas de todas las regiones
function getAllActiveMunicipalities(regions: Region[]): MunicipalityForFilter[] {
  return regions
    .flatMap(region => region.municipalities)
    .filter(municipality => municipality.status === true)
    .map(municipality => ({
      id: municipality.id,
      name: municipality.name
    }))
}

export interface LocationSlice {
  regions: Region[]
  municipalities: MunicipalityForFilter[]
  isLoadingLocation: boolean
  locationError: string | null

  fetchRegions: () => Promise<void>
  setRegions: (regions: Region[]) => void
  setMunicipalities: (municipalities: MunicipalityForFilter[]) => void
  setLoadingLocation: (loading: boolean) => void
  setLocationError: (error: string | null) => void
  resetLocationState: () => void
}

export const createLocationSlice: StateCreator<LocationSlice> = (set) => ({
  regions: [],
  municipalities: [],
  isLoadingLocation: false,
  locationError: null,

  fetchRegions: async () => {
    set({ isLoadingLocation: true, locationError: null })
    
    try {
      const regions = await getRegionsWithMunicipalities()
      const municipalities = getAllActiveMunicipalities(regions)
      
      set({
        regions,
        municipalities,
        isLoadingLocation: false,
        locationError: null
      })
    } catch (error) {
      set({
        isLoadingLocation: false,
        locationError: error instanceof Error ? error.message : 'Error al cargar ubicaciones'
      })
    }
  },

  setRegions: (regions: Region[]) => {
    set({ regions })
  },

  setMunicipalities: (municipalities: MunicipalityForFilter[]) => {
    set({ municipalities })
  },

  setLoadingLocation: (loading: boolean) => {
    set({ isLoadingLocation: loading })
  },

  setLocationError: (error: string | null) => {
    set({ locationError: error })
  },

  resetLocationState: () => {
    set({
      regions: [],
      municipalities: [],
      isLoadingLocation: false,
      locationError: null
    })
  }
})
