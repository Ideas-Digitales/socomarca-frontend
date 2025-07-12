import { StateCreator } from 'zustand';
import { SiteInformation } from '@/interfaces/siteInformation.interface';
import { fetchGetSiteInformation, fetchUpdateSiteInformation } from '@/services/actions/siteInformation.actions';

export interface SiteInformationSlice {
  siteInformation: SiteInformation | null;
  isLoadingSiteInfo: boolean;
  isUpdatingSiteInfo: boolean;
  siteInfoError: string | null;

  fetchSiteInformation: () => Promise<void>;
  updateSiteInformation: (siteInfo: SiteInformation) => Promise<{ success: boolean; error?: string }>;
  setSiteInformation: (siteInfo: SiteInformation) => void;
  clearSiteInfoError: () => void;
  resetSiteInfoState: () => void;
}

export const createSiteInformationSlice: StateCreator<SiteInformationSlice> = (set) => ({
  siteInformation: null,
  isLoadingSiteInfo: false,
  isUpdatingSiteInfo: false,
  siteInfoError: null,

  fetchSiteInformation: async () => {
    set({ isLoadingSiteInfo: true, siteInfoError: null });
    
    try {
      const response = await fetchGetSiteInformation();
      
      if (response.ok && response.data) {
        set({ siteInformation: response.data });
      } else {
        set({ siteInfoError: response.error || 'Error al obtener la información del sitio' });
      }
    } catch (error) {
      console.error('Error in fetchSiteInformation:', error);
      set({ siteInfoError: 'Error de conexión' });
    } finally {
      set({ isLoadingSiteInfo: false });
    }
  },

  updateSiteInformation: async (siteInfo: SiteInformation) => {
    set({ isUpdatingSiteInfo: true, siteInfoError: null });
    
    try {
      const response = await fetchUpdateSiteInformation(siteInfo);
      
      if (response.ok && response.data) {
        set({ siteInformation: response.data });
        return { success: true };
      } else {
        const errorMessage = response.error || 'Error al actualizar la información del sitio';
        set({ siteInfoError: errorMessage });
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error('Error in updateSiteInformation:', error);
      const errorMessage = 'Error de conexión';
      set({ siteInfoError: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      set({ isUpdatingSiteInfo: false });
    }
  },

  setSiteInformation: (siteInfo: SiteInformation) => {
    set({ siteInformation: siteInfo });
  },

  clearSiteInfoError: () => {
    set({ siteInfoError: null });
  },

  resetSiteInfoState: () => {
    set({
      siteInformation: null,
      isLoadingSiteInfo: false,
      isUpdatingSiteInfo: false,
      siteInfoError: null
    });
  }
});
