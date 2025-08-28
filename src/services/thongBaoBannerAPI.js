import axios from "../utils/axios-customize"

export const createThongBao = (title) => {
    return axios.post('/api/kh/create-thong-bao-banner', {
       title
    })
}

export const getAllThongBao  = () => {
    const URL_BACKEND = `/api/kh/get-thong-bao-banner`    
    return axios.get(URL_BACKEND)
}

export const updateThongBao = (_id, title) => {
    return axios.put('/api/kh/update-thong-bao-banner', {
        _id, title
    })
}

