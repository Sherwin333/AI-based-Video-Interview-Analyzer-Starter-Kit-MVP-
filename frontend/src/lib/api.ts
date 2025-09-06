import axios from "axios";
export const api = axios.create({ baseURL: "http://localhost:8000" });
export async function uploadInterview(blob: Blob) {
const form = new FormData();
form.append("file", blob, "interview.mp4");
const { data } = await api.post("/analyze", form, {
headers: { "Content-Type": "multipart/form-data" },
});
return data;
}
