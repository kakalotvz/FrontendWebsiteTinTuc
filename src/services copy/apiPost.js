import axios from "../utils/axios-customize"

export const findAllPost = (query) => {
    const URL_BACKEND = `/api/bai-viet/get-bai-viet?${query}`    
    return axios.get(URL_BACKEND)
}
export const fetchOnePost = (query) => {
    const URL_BACKEND = `/api/bai-viet/get-one-bai-viet?${query}`    
    return axios.get(URL_BACKEND)
}
// export const createPost = (ten, matKhau, Image, monHoc, capHoc, moTa, thoiGianThi, cauHoi, nguoiTao, phamViShare) => {
//     return axios.post('/api/bai-viet/create-bai-viet', {
//         ten, matKhau, Image, monHoc, capHoc, moTa, thoiGianThi, cauHoi, nguoiTao, phamViShare
//     })
// }
export const createBaiViet = (payload) => {
    return axios.post('/api/bai-viet/create-bai-viet', payload);
}


// export const updatePost = (_id, ten, matKhau, Image, monHoc, capHoc, moTa, thoiGianThi, cauHoi, nguoiTao, phamViShare) => {
//     return axios.put('/api/bai-viet/update-bai-viet', {
//         _id, ten, matKhau, Image, monHoc, capHoc, moTa, thoiGianThi, cauHoi, nguoiTao, phamViShare
//     })
// }
export const updatePost = (payload) => {
    return axios.put('/api/bai-viet/update-bai-viet', payload);
}
export const toggleStatus = (payload) => {
    return axios.put('/api/bai-viet/thay-doi-status-bai-viet', payload);
}

export const deletePost = (_id) => {
    return axios.delete(`/api/bai-viet/delete-bai-viet/${_id}`)
}

