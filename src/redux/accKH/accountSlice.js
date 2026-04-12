import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const isAuthenticatedFromStorage = localStorage.getItem('isAuthenticated') === 'true';
const userFromStorage = JSON.parse(localStorage.getItem('user')) || {};

const initialState = {
    isAuthenticated: isAuthenticatedFromStorage,
    isLoading: true,
    user: userFromStorage
};


export const accountSlide = createSlice({
    name: 'accountKH',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        doLoginAction: (state, action) => {   
            console.log("action: ", action);
            console.log("action.payload: ", action.payload);
                     
            state.isAuthenticated = true;
            state.isLoading = false;
            state.user = action.payload

            // Lưu thông tin vào localStorage
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        doGetAccountAction: (state, action) => {
            state.isAuthenticated = true;
            state.isLoading = false;
            state.user = action.payload
        },
        doLogoutAction: (state, action) => {
            localStorage.removeItem('access_token');
            state.isAuthenticated = false;            
            state.user = {
                email: "",
                name: "",                
                id: "",
                soDu: 0,
                soTienNap: 0,
            }
            // Lưu thông tin vào localStorage
            localStorage.setItem('user', JSON.stringify({
                email: "",
                name: "",                
                id: "",
                soDu: 0,
                soTienNap: 0,
            }));
        },


    },    
    extraReducers: (builder) => {

    },
});

export const { doLoginAction, doGetAccountAction, doLogoutAction } = accountSlide.actions;


export default accountSlide.reducer;
