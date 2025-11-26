import { publicAxios } from "../utils/axios";

const API_URL = "/services";

export const fetchServices = async () => {
  const res = await publicAxios.get(API_URL);
  return res.data.data;
};

export const createService = async (service: any) => {
  const res = await publicAxios.post(API_URL, service);
  return res.data;
};

export const updateService = async (id: number, service: any) => {
  const res = await publicAxios.put(`${API_URL}/${id}`, service);
  return res.data;
};

export const deleteService = async (id: number) => {
  const res = await publicAxios.delete(`${API_URL}/${id}`);
  return res.data;
};
