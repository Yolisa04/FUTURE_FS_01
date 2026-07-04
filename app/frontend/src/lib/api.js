import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API });

export const getServices = () => api.get("/services").then((r) => r.data);
export const getStylists = () => api.get("/stylists").then((r) => r.data);
export const getAvailability = (stylistId, date) =>
  api.get(`/availability`, { params: { stylist_id: stylistId, date } }).then((r) => r.data);
export const createBooking = (payload) => api.post("/bookings", payload).then((r) => r.data);
export const listBookings = () => api.get("/bookings").then((r) => r.data);
export const cancelBooking = (id) => api.patch(`/bookings/${id}/cancel`).then((r) => r.data);
export const getStats = () => api.get("/bookings/stats").then((r) => r.data);
export const sendContact = (payload) => api.post("/contact", payload).then((r) => r.data);
