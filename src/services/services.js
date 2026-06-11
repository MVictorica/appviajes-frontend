import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      message:
        error.response?.data?.message || error.message || "Error desconocido",
      status: error.response?.status || 500,
      data: error.response?.data || null,
      originalError: error,
    };
    return Promise.reject(customError);
  }
);

export const loginApi = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

export const registerApi = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const upgradePlanApi = async () => {
  const response = await api.patch("/auth/upgrade");
  return response.data;
};

export const obtenerTripsApi = async (signal) => {
  const response = await api.get("/trips?limit=100", { signal });
  return response?.data?.trips || [];
};

export const agregarTripApi = async (trip, signal) => {
  const response = await api.post("/trips", trip, { signal });
  return response.data.trip;
};

export const editarTripApi = async (id, data, signal) => {
  const response = await api.patch(`/trips/${id}`, data, { signal });
  return response.data.trip;
};

export const eliminarTripApi = async (id, signal) => {
  const response = await api.delete(`/trips/${id}`, { signal });
  return response.data;
};

export const obtenerCategoriesApi = async (signal) => {
  const response = await api.get("/categories", { signal });
  return response?.data?.categories || [];
};

export const generarDescripcionApi = async (destination, style) => {
  const response = await api.post("/ai/generate-description", {
    destination,
    style,
  });
  return response.data;
};

export const obtenerPaisApi = async (country) => {
  const response = await api.get(`/countries/${country}`);
  return response.data.info;
};