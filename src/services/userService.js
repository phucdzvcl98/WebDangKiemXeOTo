import axios from "../axios"
const handleLoginApi = (userEmail, userPassword) => {

    return axios.post('/api/login', { email: userEmail, password: userPassword });
}
const getAllUsers = (inputId) => {
    return axios.get(`/api/get-all-users?id=${inputId}`)
}
const createNewUserService = (data) => {
    console.log('check data from service:', data)
    return axios.post('/api/create-new-user', data)
}
const deleteUserService = (userId) => {
    return axios.delete('/api/delete-user', {
        data: {
            id: userId
        }
    });
}
const editUserService = (inputData) => {
    return axios.put('/api/edit-user', inputData);
}

const getAllCodeService = (inputType) => {
    return axios.get(`/api/allcode?type=${inputType}`)
}

const getTopCenterHomeService = (limit) => {
    return axios.get(`/api/top-center-home?limit=${limit}`)
}

const getAllCenters = () => {
    return axios.get(`/api/get-all-centers`)
}

const saveDetailCenterService = (data) => {
    return axios.post(`/api/save-infor-centers`, data)
}
const getDetailInforCenter = (id) => {
    return axios.get(`/api/get-detail-center-by-id?id=${id}`)
}
export {
    handleLoginApi, getAllUsers, createNewUserService,
    deleteUserService, editUserService, getAllCodeService,
    getTopCenterHomeService, getAllCenters,
    saveDetailCenterService, getDetailInforCenter,
}