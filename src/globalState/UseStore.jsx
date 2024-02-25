import {create} from 'zustand';
import Axios from '../services/Axios';

const useStore = create((set) => ({
  documentations: [],
  sources: [],
  sections: [],
  mappings: [],
  mappingIsLoaded: false,
  documentIsLoaded: false,

  fetchDocumentations: async () => {
    try {
      const response = await Axios.get('/documentations');
      set({ documentations: response.data , documentIsLoaded : true});
    } catch (error) {
      console.error(error);
    }
  },

  fetchSources: async () => {
    try {
      const response = await Axios.get('/sources');
      set({ sources: response.data });
    } catch (error) {
      console.error(error);
    }
  },

  fetchSections: async () => {
    try {
      const response = await Axios.get('/sections');
      set({ sections: response.data });
    } catch (error) {
      console.error(error);
    }
  },

  fetchMappings: async () => {
    try {
      const response = await Axios.get('/mappings');
      set({ mappings: response.data , mappingIsLoaded : true});
    } catch (error) {
      console.error(error);
    }
  },
}));

export default useStore;