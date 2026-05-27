import actionTypes from './actionTypes';
import {
    getAllCodeService, createNewUserService, getAllUsers,
    deleteUserService, editUserService, getTopCenterHomeService,
    getAllCenters, saveDetailCenterService,
    getAllSpecialty, getAllArena
} from '../../services/userService';
import { toast } from "react-toastify";

export const fetchGenderStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: actionTypes.FETCH_GENDER_START
            })
            let res = await getAllCodeService("GENDER");
            if (res && res.errCode === 0) {
                dispatch(fetchGenderSuccess(res.data))
            } else {
                dispatch(fetchGenderFailed())
            }
        } catch (e) {
            console.log('gender error', e);
            dispatch(fetchGenderFailed());
        }
    }

}

export const fetchGenderSuccess = (genderData) => ({
    type: actionTypes.FETCH_GENDER_SUCCESS,
    data: genderData
})

export const fetchGenderFailed = () => ({
    type: actionTypes.FETCH_GENDER_FAILED
})

export const fetchPositionStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: actionTypes.FETCH_POSITION_START
            })
            let res = await getAllCodeService("POSITION");
            if (res && res.errCode === 0) {
                dispatch(fetchPositionSuccess(res.data))
            } else {
                dispatch(fetchPositionFailed())
            }
        }
        catch (e) {
            console.log('position error', e);
            dispatch(fetchPositionFailed());
        }

    }

}

export const fetchPositionSuccess = (PositionData) => ({
    type: actionTypes.FETCH_POSITION_SUCCESS,
    data: PositionData
})

export const fetchPositionFailed = () => ({
    type: actionTypes.FETCH_POSITION_FAILED
})

export const fetchRoleStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: actionTypes.FETCH_ROLE_START
            })
            let res = await getAllCodeService("ROLE");
            if (res && res.errCode === 0) {
                dispatch(fetchRoleSuccess(res.data))
            } else {
                dispatch(fetchRoleFailed())
            }
        }
        catch (e) {
            console.log('role error', e);
            dispatch(fetchRoleFailed());
        }

    }

}

export const fetchRoleSuccess = (RoleData) => ({
    type: actionTypes.FETCH_ROLE_SUCCESS,
    data: RoleData
})

export const fetchRoleFailed = () => ({
    type: actionTypes.FETCH_ROLE_FAILED
})

export const createNewUser = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await createNewUserService(data);
            toast.success("Tạo mới trung tâm thành công!")
            if (res && res.errCode === 0) {
                dispatch(saveUserSuccess())
                dispatch(fetchAllUsersStart())
            } else {
                toast.error("Tạo mới trung tâm thất bại!")
                dispatch(saveUserFailed())
            }
        } catch (e) {
            dispatch(saveUserFailed());
            console.log('save error', e)
        }
    }
}

export const saveUserSuccess = () => ({
    type: actionTypes.CREATE_USER_SUCCESS,
})

export const saveUserFailed = () => ({
    type: actionTypes.CREATE_USER_FAILED,
})

export const fetchAllUsersStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: actionTypes.FETCH_ROLE_START
            })
            let res = await getAllUsers("ALL");
            if (res && res.errCode === 0) {
                dispatch(fetchAllUsersSuccess(res.users.reverse()))
            } else {
                toast.error("Tìm tất cả trung tâm thất bại!")
                dispatch(fetchAllUsersFailed())
            }
        } catch (e) {
            toast.error("Tìm tất cả trung tâm thất bại!")
            dispatch(fetchAllUsersFailed())
            console.log('all user error', e)
        }
    }

}

export const fetchAllUsersSuccess = (data) => ({
    type: actionTypes.FETCH_ALL_USERS_SUCCESS,
    users: data
})

export const fetchAllUsersFailed = () => ({
    type: actionTypes.FETCH_ALL_USERS_FAILED,
})

export const deleteAUser = (userId) => {
    return async (dispatch, getState) => {
        try {
            let res = await deleteUserService(userId);
            if (res && res.errCode === 0) {
                toast.success("Xóa trung tâm thành công!");
                dispatch(deleteUserSuccess())
                dispatch(fetchAllUsersStart())
            } else {
                toast.error("Xóa trung tâm thất bại!");
                dispatch(deleteUserFailed())
            }
        } catch (e) {
            toast.error("Xóa trung tâm thất bại!")
            dispatch(deleteUserFailed());
            console.log('deleted error', e)
        }
    }
}

export const deleteUserSuccess = () => ({
    type: actionTypes.DELETE_USER_SUCCESS
})

export const deleteUserFailed = () => ({
    type: actionTypes.DELETE_USER_FAILED
})

export const editAUser = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await editUserService(data);
            if (res && res.errCode === 0) {
                toast.success("Sửa trung tâm thành công!");
                dispatch(editUserSuccess())
                dispatch(fetchAllUsersStart())
            } else {
                toast.error("Sửa trung tâm thất bại!");
                dispatch(editUserFailed())
            }
        } catch (e) {
            toast.error("Sửa trung tâm thất bại!")
            dispatch(editUserFailed());
            console.log('update error', e)
        }
    }
}

export const editUserSuccess = () => ({
    type: actionTypes.EDIT_USER_SUCCESS
})

export const editUserFailed = () => ({
    type: actionTypes.EDIT_USER_FAILED
})

export const fetchTopCenter = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getTopCenterHomeService('100');
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_TOP_CENTERS_SUCCESS,
                    dataCenters: res.data
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_TOP_CENTERS_FAILED
                })
            }
        } catch (e) {
            console.log('FETCH_TOP_CENTERS_FAILED:', e)
            dispatch({
                type: actionTypes.FETCH_TOP_CENTERS_FAILED,
            })
        }
    }
}

export const fetchALLCenters = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCenters();
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALL_CENTERS_SUCCESS,
                    dataCe: res.data
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_ALL_CENTERS_FAILED
                })
            }
        } catch (e) {
            console.log('FETCH_ALL_CENTERS_FAILED:', e)
            dispatch({
                type: actionTypes.FETCH_ALL_CENTERS_FAILED,
            })
        }
    }
}
export const saveDetailCenter = (data) => {
    return async (dispatch, getState) => {
        try {
            console.log('DATA SEND: ', data)
            let res = await saveDetailCenterService(data);
            if (res && res.errCode === 0) {
                toast.success("Lưu thông tin chi tiết trung tâm thành công!");
                dispatch({
                    type: actionTypes.SAVE_DETAIL_CENTER_SUCCESS,
                })
            } else {
                console.log('errrrrrr', res)
                toast.error("Lưu thông tin chi tiết trung tâm thất bại!");
                dispatch({
                    type: actionTypes.SAVE_DETAIL_CENTER_FAILED
                })
            }
        } catch (e) {
            toast.error("Lưu thông tin chi tiết trung tâm thất bại!");
            console.log('SAVE_DETAIL_CENTER_FAILED:', e)
            dispatch({
                type: actionTypes.SAVE_DETAIL_CENTER_FAILED,
            })
        }
    }
}

export const fetchALLSheduleTime = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCodeService("TIME");
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_SUCCESS,
                    dataTime: res.data
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED
                })
            }
        } catch (e) {
            console.log('FETCH_ALLCODE_SCHEDULE_TIME_FAILED:', e)
            dispatch({
                type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED,
            })
        }
    }
}

export const getRequiredCenterInfor = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_REQUIRED_CENTER_INFOR_START })

            let resPrice = await getAllCodeService("PRICE");
            let resPayment = await getAllCodeService("PAYMENT");
            let resRegion = await getAllCodeService("REGION");
            let resSpecialty = await getAllSpecialty();
            let resArena = await getAllArena();
            if (resPrice && resPrice.errCode === 0
                && resPayment && resPayment.errCode === 0
                && resRegion && resRegion.errCode === 0
                && resSpecialty && resSpecialty.errCode === 0
                && resArena && resArena.errCode === 0
            ) {
                let data = {
                    resPrice: resPrice.data,
                    resPayment: resPayment.data,
                    resRegion: resRegion.data,
                    resSpecialty: resSpecialty.data,
                    resArena: resArena.data
                }
                dispatch(fetchRequiredCenterInforSuccess(data))
            } else {
                dispatch(fetchRequiredCenterInforFailed())
            }
        } catch (e) {
            dispatch(fetchRequiredCenterInforFailed());
            console.log('fetchGerderStart error', e)
        }
    }
}

export const fetchRequiredCenterInforSuccess = (allRequiredData) => ({
    type: actionTypes.FETCH_REQUIRED_CENTER_INFOR_SUCCESS,
    data: allRequiredData
})

export const fetchRequiredCenterInforFailed = () => ({
    type: actionTypes.FETCH_REQUIRED_CENTER_INFOR_FAILED,
})

