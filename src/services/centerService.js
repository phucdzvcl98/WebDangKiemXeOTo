import { where } from "sequelize";
import db from "../models/index";
require('dotenv').config();
import _, { attempt } from 'lodash';

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopCenterHome = (limitInput) => {

    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({

                limit: limitInput,
                where: { roleId: 'R2' },
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                ],
                raw: true,
                nest: true
            })
            resolve({
                errCode: 0,
                data: users
            })

        } catch (e) {
            reject(e);
        }
    })
}

let getAllCenters = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let centers = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: {
                    exclude: ['password', 'image']
                },
            })

            resolve({
                errCode: 0,
                data: centers
            })
        } catch (e) {
            reject(e)
        }
    })
}

let saveDetailInforCenter = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.centerId
                || !inputData.contentHTML
                || !inputData.contentMarkdown || !inputData.action
                || !inputData.selectedPrice || !inputData.selectedPayment
                || !inputData.selectProvince
                || !inputData.nameArena || !inputData.addressArena
                || !inputData.note
            ) {
                resolve({
                    errCode: -1,
                    errMessage: 'Missing parament'
                })
            } else {
                if (inputData.action === 'CREATE') {
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        centerId: inputData.centerId
                    })
                } else if (inputData.action === 'EDIT') {
                    let centerMarkdown = await db.Markdown.findOne({
                        where: { centerId: inputData.centerId },
                        raw: false
                    })
                    if (centerMarkdown) {
                        centerMarkdown.contentHTML = inputData.contentHTML;
                        centerMarkdown.contentMarkdown = inputData.contentMarkdown;
                        centerMarkdown.description = inputData.description;
                        centerMarkdown.updatedAt = new Date();

                        await centerMarkdown.save()
                    }

                }

                let centerInfor = await db.Center_Infor.findOne({
                    where: {
                        centerId: inputData.centerId,
                    },
                    raw: false
                })
                if (centerInfor) {
                    centerInfor.centerId = inputData.centerId;
                    centerInfor.priceId = inputData.selectedPrice;
                    centerInfor.provinceId = inputData.selectProvince;
                    centerInfor.paymentId = inputData.selectedPayment;
                    centerInfor.nameArena = inputData.nameArena;
                    centerInfor.addressArena = inputData.addressArena;
                    centerInfor.note = inputData.note;
                    await centerInfor.save()
                } else {
                    await db.Center_Infor.create({
                        centerId: inputData.centerId,
                        priceId: inputData.price,
                        provinceId: inputData.province,
                        paymentId: inputData.payment,
                        nameArena: inputData.nameArena,
                        addressArena: inputData.addressArena,
                        note: inputData.note,
                    })
                }

                resolve({
                    errCode: 0,
                    errMessage: 'Save infor center success!'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getDetailCenterById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parament!'
                })
            } else {
                let data = await db.User.findOne({

                    where: {
                        id: inputId
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentHTML', 'contentMarkdown']
                        },
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.Center_Infor,
                            attributes: {
                                exclude: ['id', 'centerId']
                            },
                            include: [
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                            ]
                        },
                    ],
                    raw: false,
                    nest: true
                })

                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }

                if (!data) data = {};

                resolve({
                    errCode: 0,
                    data: data,
                    errMessage: 'Save infor center success!'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.centerId || !data.formatedDate) {
                resolve({
                    errCode: -1,
                    errMessage: 'Missing requidred param!'
                })
            } else {
                let schedule = data.arrSchedule;
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    })
                }

                let existing = await db.Schedule.findAll(
                    {
                        where: { centerId: data.centerId, date: data.formatedDate },
                        attributes: ['timeType', 'date', 'centerId', 'maxNumber'],
                        raw: true
                    }
                );

                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date;
                });
                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate);
                }

                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                })
            }

        } catch (e) {
            reject(e);
        }
    })
}
let getScheduleByDate = (centerId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!centerId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                let dataSchedule = await db.Schedule.findAll({
                    where: {
                        centerId: centerId,
                        date: date
                    },
                    include: [
                        { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] },
                    ],
                    raw: false,
                    nest: true
                })
                if (!dataSchedule) dataSchedule = [];

                resolve({
                    errCode: 0,
                    data: dataSchedule
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getExtraInforCenterById = (idInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!idInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parament!'
                })
            } else {
                let data = await db.Center_Infor.findOne({

                    where: {
                        centerId: idInput
                    },
                    attributes: {
                        exclude: ['id', 'centerId']
                    },
                    include: [
                        { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                    ],
                    raw: false,
                    nest: true
                })

                if (!data) data = {};

                resolve({
                    errCode: 0,
                    data: data,
                    errMessage: 'Save infor center success!'
                })
            }
        } catch (e) {
            reject(e);
            console.log(req.query)
        }
    })
}

let getProfileCenterById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parament!'
                })
            } else {
                let data = await db.User.findOne({

                    where: {
                        id: inputId
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentHTML', 'contentMarkdown']
                        },

                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.Center_Infor,
                            attributes: {
                                exclude: ['id', 'centerId']
                            },
                            include: [
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                            ]
                        },
                    ],
                    raw: false,
                    nest: true
                })

                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }

                if (!data) data = {};

                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}
module.exports = {
    getTopCenterHome: getTopCenterHome,
    getAllCenters: getAllCenters,
    saveDetailInforCenter: saveDetailInforCenter,
    getDetailCenterById: getDetailCenterById,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
    getExtraInforCenterById: getExtraInforCenterById,
    getProfileCenterById: getProfileCenterById
}