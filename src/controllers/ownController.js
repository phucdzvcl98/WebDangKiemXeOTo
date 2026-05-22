import ownService from '../services/ownServices';

let postBookAppointment = async (req, res) => {
    console.log(req.body);
    try {
        let infor = await ownService.postBookAppointment(req.body);
        return res.status(200).json(
            infor
        )

    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}

let postVerifyBookAppointment = async (req, res) => {
    try {
        let infor = await ownService.postVerifyBookAppointment(req.body);
        return res.status(200).json(
            infor
        )

    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}
let searchBooking = async (req, res) => {

    try {

        let data = await ownService.searchBooking(
            req.query.keyword
        );

        return res.status(200).json(data);

    } catch (e) {

        console.log(e);

        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

module.exports = {
    postBookAppointment: postBookAppointment,
    postVerifyBookAppointment: postVerifyBookAppointment,
    searchBooking: searchBooking
}