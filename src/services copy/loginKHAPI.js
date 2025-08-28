import axios from "../utils/axios-customize"

export const handleRegister = (email, password, name) => {
    const URL_BACKEND = '/api/kh/register-kh'
    const data = {
        email, password, name
    }
    return axios.post(URL_BACKEND, data)
}

export const handleLogin = (name, password) => {
    const URL_BACKEND = '/api/kh/login-kh'
    const data = {
        name, password
    }
    return axios.post(URL_BACKEND, data)
}

export const handleLogout = () => {
    const URL_BACKEND = '/api/kh/logout-kh'    
    return axios.post(URL_BACKEND)
}

export const handleQuenPassword = (email_doimk) => {
    const URL_BACKEND = '/api/kh/quen-mat-khau'   
    return axios.post(URL_BACKEND, {email_doimk})
}

export const handleXacThucOTP = (otp, email) => {
    const URL_BACKEND = '/api/kh/xac-thuc-otp-kh'
    const data = {
        otp, email
    }
    return axios.post(URL_BACKEND, data)
}

