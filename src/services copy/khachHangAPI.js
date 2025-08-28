import axios from "../utils/axios-customize"

export const fetchAllAccKH= (query) => {
    const URL_BACKEND = `/api/kh/get-kh?${query}`    
    return axios.get(URL_BACKEND)
}

export const fetchOneAccKH= (id) => {
    const URL_BACKEND = `/api/kh/get-one-kh?id=${id}`    
    return axios.get(URL_BACKEND)
}

export const deleteAccKH= (id) => {
    return axios.delete(`/api/kh/delete-kh/${id}`)
}

export const updateAccKH= (_id, name, email, soDu, soTienNap) => {
    return axios.put('/api/kh/update-kh', {
        _id, name, email, soDu, soTienNap
    })
}

export const khoaAccKH= (id, isActive) => {
    return axios.put('/api/kh/khoa-kh', {
        id, isActive
    })
}