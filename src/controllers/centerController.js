import { json } from "body-parser";
import centerService from "../services/centerService";

let getTopCenterHome = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) limit = 10;
    try {
        let response = await centerService.getTopCenterHome(+limit);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        })

    }
}

let getAllCenters = async (req, res) => {
    try {
        let centers = await centerService.getAllCenters();
        return res.status(200).json(centers)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}

let postInforCenter = async (req, res) => {
    try {
        let response = await centerService.saveDetailInforCenter(req.body);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}

let getDetailCenterById = async (req, res) => {
    try {
        let infor = await centerService.getDetailCenterById(req.query.id);
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}

let bulkCreateSchedule = async (req, res) => {
    try {
        let infor = await centerService.bulkCreateSchedule(req.body);
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}
let getScheduleByDate = async (req, res) => {
    try {
        let infor = await centerService.getScheduleByDate(req.query.centerId, req.query.date);
        return res.status(200).json(
            infor
        )
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}
let getExtraInforCenterById = async (req, res) => {
    try {
        let infor = await centerService.getExtraInforCenterById(req.query.centerId);
        return res.status(200).json(
            infor
        )
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}
let getProfileCenterById = async (req, res) => {
    try {
        let infor = await centerService.getProfileCenterById(req.query.centerId);
        return res.status(200).json(
            infor
        )
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}
module.exports = {
    getTopCenterHome: getTopCenterHome,
    getAllCenters: getAllCenters,
    postInforCenter: postInforCenter,
    getDetailCenterById: getDetailCenterById,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
    getExtraInforCenterById: getExtraInforCenterById,
    getProfileCenterById: getProfileCenterById
}
