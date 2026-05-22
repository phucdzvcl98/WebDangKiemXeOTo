import { raw } from "body-parser";
import db from "../models/index";
require('dotenv').config();
import emailService from './emailService';
import { v4 as uuidv4 } from 'uuid';
import { first } from "lodash";
import { Op } from 'sequelize';

let buildUrlEmail = (centerId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&centerId=${centerId}`
    return result;
}

let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.centerId || !data.timeType || !data.date
                || !data.fullName || !data.selectedGender
                || !data.address

            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let countBooking = await db.Booking.count({
                    where: {
                        centerId: data.centerId,
                        date: data.date,
                        timeType: data.timeType,
                        statusId: 'S1'
                    }
                })

                if (countBooking >= 2) {
                    return resolve({
                        errCode: 2,
                        errMessage: 'Khung giờ này đã đầy!'
                    })
                }

                let token = uuidv4();
                await emailService.sendSimpleEmail({
                    reciverEmail: data.email,
                    ownName: data.fullName,
                    time: data.timeString,
                    centerName: data.centerName,
                    language: data.language,
                    redirectLink: buildUrlEmail(data.centerId, token)
                })

                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: 'R3',
                        gender: data.selectedGender,
                        address: data.address,
                        firstName: data.fullName
                    },
                });

                // if (user && user[0]) {
                //     await db.Booking.findOrCreate({
                //         where: { ownId: user[0].id },
                //         defaults: {
                //             statusId: 'S1',
                //             centerId: data.centerId,
                //             ownId: user[0].id,
                //             date: data.date,
                //             timeType: data.timeType,
                //             token: token,
                //             plateNumber: data.plateNumber
                //         }

                //     })
                // }
                if (user && user[0]) {
                    await db.Booking.create({
                        statusId: 'S1',
                        centerId: data.centerId,
                        ownId: user[0].id,
                        date: data.date,
                        timeType: data.timeType,
                        token: token,
                        plateNumber: data.plateNumber
                    })
                }

                resolve({
                    errCode: 0,
                    errMessage: 'Save infor own succeed!'

                })
            }


        } catch (e) {
            console.log(e);
            reject(e);

        }
    })
}

let postVerifyBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data.token || !data.centerId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        centerId: data.centerId,
                        token: data.token,
                        statusId: 'S1'
                    },
                    raw: false
                })
                if (appointment) {
                    appointment.statusId = 'S2';
                    await appointment.save();

                    resolve({
                        errCode: 0,
                        errMessage: "Update the appointment succeed!"
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: "Appoint has been activated or does not exits"
                    })
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}
let searchBooking = (keyword) => {

    return new Promise(async (resolve, reject) => {

        try {

            let data = await db.Booking.findAll({

                include: [
                    {
                        model: db.User,
                        as: 'ownData',
                        attributes: ['firstName']
                    },

                    {
                        model: db.Allcode,
                        as: 'timeTypeDataOwn',
                        attributes: ['valueVi']
                    },

                    {
                        model: db.User,
                        as: 'centerData',
                        attributes: ['firstName']
                    }
                ],

                where: {

                    [Op.or]: [

                        {
                            plateNumber: {
                                [Op.like]: `%${keyword}%`
                            }
                        },

                        // {
                        //     phoneNumber: {
                        //         [Op.like]: `%${keyword}%`
                        //     }
                        // }

                    ]
                },

                raw: false,
                nest: true
            })

            resolve({
                errCode: 0,
                data: data
            })

        } catch (e) {
            reject(e)
        }

    })
}
module.exports = {
    postBookAppointment: postBookAppointment,
    postVerifyBookAppointment: postVerifyBookAppointment,
    searchBooking: searchBooking
}