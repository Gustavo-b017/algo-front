// src/lib/api.js
import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL;
// export const API_URL = "http://127.0.0.1:5000";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// helpers
export const getFamilias = () => api.get("/familias").then(r => r.data);
export const getSubfamilias = (familiaId) =>
  api.get(`/familias/${familiaId}/subfamilias`).then(r => r.data);
export const getMontadoras = () => api.get("/montadoras").then(r => r.data);
export const pesquisar = (params) => api.get("/pesquisar", { params }).then(r => r.data);
export const autocomplete = (prefix) =>
  api.get("/autocomplete", { params: { prefix } }).then(r => r.data);
