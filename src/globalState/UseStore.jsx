import { create } from "zustand";
import Axios from "../services/Axios";

const useStore = create((set) => ({
  documentations: [],
  sources: [],
  sections: [],
  mappings: [],
  languages: [],
  projects: [],
  userProjects: [],
  subProjects: [],
  configurations: [],
  users: [],
  errors: [],
  mappingIsLoaded: false,
  documentIsLoaded: false,

  fetchDocumentations: async (user) => {
    try {
      const response = await Axios.get(`/documentations/${user}`);
      set({ documentations: response.data, documentIsLoaded: true });
    } catch (error) {
      console.error(error);
    }
  },

  fetchSources: async (user) => {
    try {
      const response = await Axios.get(`/sources/user/${user}`);
      set({ sources: response.data });
    } catch (error) {
      console.error(error);
    }
  },

  fetchSections: async () => {
    try {
      const response = await Axios.get("/sections");
      set({ sections: response.data });
    } catch (error) {
      console.error(error);
    }
  },

  fetchMappings: async (user) => {
    try {
      const response = await Axios.get(`/mappings/user/${user}`);
      set({ mappings: response.data, mappingIsLoaded: true });
    } catch (error) {
      console.error(error);
    }
  },
  fetchLanguages: async () => {
    try {
      const response = await Axios.get("/languages");
      set({ languages: response.data });
    } catch (error) {
      console.error(error);
    }
  },
  fetchProjects: async (user) => {
    try {
      const response = await Axios.get(`projects/${user}`);
      set({ projects: response.data });
    } catch (error) {
      console.error(error);
    }
  },
  fetchSubProjects: async (user) => {
    try {
      const response = await Axios.get(`subProjects/${user}`);
      set({ subProjects: response.data });
    } catch (error) {
      console.error(error);
    }
  },
  fetchConfigurations: async () => {
    try {
      const response = await Axios.get("/configurations");
      set({ configurations: response.data });
    } catch (error) {
      console.error(error);
    }
  },
  fetchUserProjects: async (user) => {
    try {
      const response = await Axios.get(`projects/userProjects/${user}`);
      set({ userProjects: response.data });
    } catch (error) {
      console.error(error);
    }
  },
  fetchUsers: async (user) => {
    try {
      const response = await Axios.get(`users/${user}`);
      set({ users: response.data });
    } catch (error) {
      console.error(error);
    }
  },
  fetchErrors: async (user) => {
    try {
      const response = await Axios.get(`errors/${user}`);
      set({ errors: response.data });
    } catch (error) {
      console.error(error);
    }
  },
}));

export default useStore;
