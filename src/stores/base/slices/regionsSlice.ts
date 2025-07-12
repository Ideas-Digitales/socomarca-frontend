import { StateCreator } from 'zustand';
import {
    StoreState,
    FiltersSlice,
    RegionsSlice,
} from '../types';
import {fetchGetRegions} from "@/services/actions/regions.actions";

export const createRegionsSlice: StateCreator<
    StoreState & RegionsSlice & FiltersSlice,
    [],
    [],
    RegionsSlice
> = (set, get) => ({
    regionsList: [],
    updateRegionsList: async (municipalityId, status) => {
        // TODO Implementar actualización de región
    },
    fetchRegions: async () => {
        const response = await fetchGetRegions();
        set({ regionsList: response.data ?? undefined})
    },
});
