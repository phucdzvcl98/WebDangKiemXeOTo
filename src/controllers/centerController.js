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

module.exports = {
    getTopCenterHome: getTopCenterHome,
    getAllCenters: getAllCenters,
    postInforCenter: postInforCenter,
    getDetailCenterById: getDetailCenterById,

}
