import axios from "../utils/axios-customize"

export const fetchAllLoaiSP = (query) => {
    const URL_BACKEND = `/api/category/get-the-loai?${query}`    
    return axios.get(URL_BACKEND)
}

export const createLoaiSP = (TenLoaiSP, Icon) => {
    return axios.post('/api/category/create-the-loai', {
        TenLoaiSP, Icon
    })
}

export const deleteLoaiSP = (id) => {
    return axios.delete(`/api/category/delete-the-loai/${id}`)
}

export const updateLoaiSP = (_id, TenLoaiSP, Icon, totalProducts) => {
    return axios.put('/api/category/update-the-loai', {
        _id, TenLoaiSP, Icon, totalProducts
    })
}

export const findOneCategory = (query) => {
    const URL_BACKEND = `/api/category/get-one-the-loai?${query}`    
    return axios.get(URL_BACKEND)
}