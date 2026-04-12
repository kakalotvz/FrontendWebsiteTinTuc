import axios from "../utils/axios-customize";

export const getThongBao = () => {
  const url = `/thongbao/getall`;
  return axios.get(url);
};

export const createThongBao = (payload) => {
  return axios.post("/thongbao/create", payload);
};

export const updateTTDocThongBao = (id, payload) => {
  return axios.put(`/thongbao/read/${id}`, payload);
};

export const updateThongBao = (id, payload) => {
  return axios.put(`/thongbao/update/${id}`, payload);
};

export const deleteThongBao = (id) => {
  return axios.delete(`/thongbao/delete/${id}`);
};
