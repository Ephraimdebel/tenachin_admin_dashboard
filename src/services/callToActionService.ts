import {publicAxios} from "../utils/axios";

export const fetchCallToAction = async () => {
  const { data } = await publicAxios.get("/calltoaction");
  return data;
};

export const updateCallToAction = async (payload: { content: string; download_url: string }) => {
  const { data } = await publicAxios.put("/calltoaction", payload);
  return data;
};
