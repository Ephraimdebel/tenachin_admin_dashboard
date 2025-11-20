import { publicAxios } from "../utils/axios";

export async function fetchAbout() {
  try {
    const response = await publicAxios.get("/aboutsection");
    return response.data;
  } catch {
    throw new Error("Failed to fetch about section");
  }
}

export async function updateAbout(data: {
  description_left: string;
  description_right: string;
}) {
  try {
    const response = await publicAxios.put("/aboutsection", data);
    return response.data;
  } catch {
    throw new Error("Failed to update about section");
  }
}

export async function addAboutItem(data: { text: string }) {
  try {
    const response = await publicAxios.post("/aboutsection/list", data);
    return response.data;
  } catch {
    throw new Error("Failed to add item");
  }
}

export async function updateAboutItem(id: number, data: { text: string }) {
  try {
    const response = await publicAxios.put(`/aboutsection/list/${id}`, data);
    return response.data;
  } catch {
    throw new Error("Failed to update item");
  }
}

export async function deleteAboutItem(id: number) {
  try {
    const response = await publicAxios.delete(`/aboutsection/list/${id}`);
    return response.data;
  } catch {
    throw new Error("Failed to delete item");
  }
}
