import { publicAxios } from "../utils/axios";

// ---------------- FETCH ALL FEATURES ---------------- //
export async function fetchFeatures() {
  try {
    const response = await publicAxios.get("/featuresection");
    return response.data; // expected array of FeatureSectionData with list_items
  } catch (err) {
    console.error(err);
    throw new Error("Failed to fetch features");
  }
}

// ---------------- UPDATE FEATURE ---------------- //
export async function updateFeature(id: number, data: { content: string; media: File | string | null }) {
  const formData = new FormData();
  formData.append("content", data.content);

  if (data.media instanceof File) {
    formData.append("media", data.media); // MUST match upload.single("media")
  }

  return publicAxios.put(`/features/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
}


// ---------------- UPDATE FEATURE LIST ITEM ---------------- //
export async function updateFeatureListItem(
  sectionId: number,
  itemId: number,
  data: { text: string }
) {
  try {
    const response = await publicAxios.put(`/featuresection/${sectionId}/list/${itemId}`, data);
    return response.data;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to update feature list item");
  }
}

// ---------------- DELETE FEATURE LIST ITEM ---------------- //
export async function deleteFeatureListItem(sectionId: number, itemId: number) {
  try {
    const response = await publicAxios.delete(`/featuresection/${sectionId}/list/${itemId}`);
    return response.data;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to delete feature list item");
  }
}

// ---------------- ADD FEATURE LIST ITEM ---------------- //
export async function addFeatureListItem(sectionId: number, data: { text: string }) {
  try {
    const response = await publicAxios.post(`/featuresection/${sectionId}/list`, data);
    return response.data; // should return the newly created list item
  } catch (err) {
    console.error(err);
    throw new Error("Failed to add feature list item");
  }
}
