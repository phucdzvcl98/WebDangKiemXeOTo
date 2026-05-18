import actionTypes from '../actions/actionTypes';

const initialState = {
    isLoadingGender: false,
    genders: [],
    roles: [],
    positions: [],
    users: [],
    topCenters: [],
    allCenters: [],
    allSheduleTime: [],

    allRequiredCenterInfor: [],
}

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_GENDER_START:
            let copyState = { ...state };
            copyState.isLoadingGender = true;
            return {
                ...copyState
            }
        case actionTypes.FETCH_GENDER_SUCCESS:
            state.genders = action.data;
            state.isLoadingGender = false;
            return {
                ...state
            }
        case actionTypes.FETCH_GENDER_FAILED:
            state.isLoadingGender = false;
            state.genders = [];
            return {
                ...state
            }

        case actionTypes.FETCH_POSITION_START:
            let copyState1 = { ...state };
            copyState1.isLoadingPosition = true;
            return {
                ...copyState1
            }
        case actionTypes.FETCH_POSITION_SUCCESS:
            state.positions = action.data;
            state.isLoadingPosition = false;
            return {
                ...state
            }
        case actionTypes.FETCH_POSITION_FAILED:
            state.isLoadingPosition = false;
            state.positions = [];
            return {
                ...state
            }

        case actionTypes.FETCH_ROLE_START:
            let copyState2 = { ...state };
            copyState2.isLoadingRole = true;
            return {
                ...copyState2
            }
        case actionTypes.FETCH_ROLE_SUCCESS:
            state.roles = action.data;
            state.isLoadingRole = false;
            return {
                ...state
            }
        case actionTypes.FETCH_ROLE_FAILED:
            state.isLoadingRole = false;
            state.roles = [];
            return {
                ...state
            }

        case actionTypes.FETCH_ALL_USERS_SUCCESS:
            state.users = action.users;
            return {
                ...state
            }
        case actionTypes.FETCH_ALL_USERS_FAILED:
            state.users = [];
            return {
                ...state
            }
        case actionTypes.FETCH_TOP_CENTERS_SUCCESS:
            state.topCenters = action.dataCenters;
            return {
                ...state
            }
        case actionTypes.FETCH_TOP_CENTERS_FAILED:
            state.topCenters = [];
            return {
                ...state
            }
        case actionTypes.FETCH_ALL_CENTERS_SUCCESS:
            state.allCenters = action.dataCe;
            return {
                ...state
            }
        case actionTypes.FETCH_ALL_CENTERS_FAILED:
            state.allCenters = [];
            return {
                ...state
            }
        case actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_SUCCESS:
            state.allSheduleTime = action.dataTime;
            return {
                ...state
            }
        case actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED:
            state.allSheduleTime = [];
            return {
                ...state
            }
        case actionTypes.FETCH_REQUIRED_CENTER_INFOR_SUCCESS:
            state.allRequiredCenterInfor = action.data;
            return {
                ...state
            }
        case actionTypes.FETCH_REQUIRED_CENTER_INFOR_FAILED:
            state.allRequiredCenterInfor = [];
            return {
                ...state
            }
        default:
            return state;
    }
}

export default adminReducer;