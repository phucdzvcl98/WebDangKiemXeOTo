import { where } from "sequelize";
import db from "../models/index";
require('dotenv').config();
import _ from 'lodash';
import emailService from '../services/emailService'

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

let checkRequiredFields = (inputData) => {
    let arrFields = ['centerId', 'contentHTML', 'contentMarkdown', 'action',
        'selectedPrice', 'selectedPayment', 'selectedRegion', 'nameArena',
        'addressArena', 'note', 'specialtyIds'
    ]
    let isValid = true;
    let element = '';
    for (let i = 0; i < arrFields.length; i++) {
        if (!inputData[arrFields[i]]) {
            isValid = false;
            element = arrFields[i]
            break;
        }
    }
    return {
        isValid: isValid,
        element: element
    }
}

let saveDetailInforCenter = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            let checkObj = checkRequiredFields(inputData);
            if (checkObj.isValid === false) {

                resolve({
                    errCode: -1,
                    errMessage: `Missing parament: ${checkObj.element}`
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
                    centerInfor.regionId = inputData.selectedRegion;
                    centerInfor.paymentId = inputData.selectedPayment;
                    centerInfor.nameArena = inputData.nameArena;
                    centerInfor.addressArena = inputData.addressArena;
                    centerInfor.note = inputData.note;
                    centerInfor.arenaId = inputData.arenaId;

                    await centerInfor.save()
                } else {
                    await db.Center_Infor.create({
                        centerId: inputData.centerId,
                        priceId: inputData.selectedPrice,
                        regionId: inputData.selectedRegion,
                        paymentId: inputData.selectedPayment,
                        nameArena: inputData.nameArena,
                        addressArena: inputData.addressArena,
                        note: inputData.note,
                        arenaId: inputData.arenaId,
                    })
                }
                if (inputData.specialtyIds && inputData.specialtyIds.length > 0) {

                    await db.Center_Specialty.destroy({
                        where: {
                            centerId: inputData.centerId
                        }
                    });

                    let arrSpecialty = inputData.specialtyIds.map(item => ({
                        centerId: inputData.centerId,
                        specialtyId: item,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }));

                    await db.Center_Specialty.bulkCreate(arrSpecialty);
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
                                { model: db.Allcode, as: 'regionTypeData', attributes: ['valueEn', 'valueVi'] },
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

                        { model: db.User, as: 'centerData', attributes: ['id', 'fullName'] },
                    ],
                    raw: false,
                    nest: true
                })
                if (!dataSchedule) dataSchedule = [];

                if (dataSchedule && dataSchedule.length > 0) {
                    dataSchedule = dataSchedule.map(item => item.get({ plain: true }));

                    for (let i = 0; i < dataSchedule.length; i++) {
                        let currentNumber = await db.Booking.count({
                            where: {
                                centerId: centerId,
                                date: date,
                                timeType: dataSchedule[i].timeType,
                                statusId: ['S1', 'S2']
                            }
                        });

                        dataSchedule[i].currentNumber = currentNumber;
                        dataSchedule[i].remainingNumber = dataSchedule[i].maxNumber - currentNumber;
                    }
                }

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
                        { model: db.Allcode, as: 'regionTypeData', attributes: ['valueEn', 'valueVi'] },
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
                                { model: db.Allcode, as: 'regionTypeData', attributes: ['valueEn', 'valueVi'] },
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
let getListOwnForCenter = (centerId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!centerId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                let data = await db.Booking.findAll({
                    where: {
                        statusId: 'S2',
                        centerId: centerId,
                        date: date
                    },
                    include: [
                        {
                            model: db.User, as: 'ownData',
                            attributes: ['email', 'fullName', 'address', 'gender'],
                            include: [
                                { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },

                            ]

                        },
                        {
                            model: db.Employee,
                            as: 'employeeData',
                            attributes: ['id', 'fullName']
                        },
                        {
                            model: db.Allcode, as: 'timeTypeDataOwn', attributes: ['valueEn', 'valueVi']
                        }
                    ],
                    raw: false,
                    nest: true
                })

                resolve({
                    errCode: 0,
                    data
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let sendRemedy = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.centerId || !data.ownId || !data.timeType || !data.imgBase64) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        centerId: data.centerId,
                        ownId: data.ownId,
                        timeType: data.timeType,
                        statusId: 'S2'
                    },
                    raw: false
                })
                if (appointment) {
                    appointment.statusId = 'S3';
                    appointment.employeeId = data.employeeId;
                    await appointment.save()
                }
                await emailService.sendAttachment(data);

                resolve({
                    errCode: 0,
                    errMessage: 'ok'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getAdminDashboardStats = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let totalCenters = await db.User.count({ where: { roleId: 'R2' } });
            let totalArena = await db.Arena.count();
            let totalSpecialty = await db.Specialty.count();
            let totalBooking = await db.Booking.count();

            let bookingByStatus = await db.Booking.findAll({
                attributes: [
                    'statusId',
                    [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'total']
                ],
                group: ['statusId'],
                raw: true
            });

            let bookingByDate = await db.Booking.findAll({
                attributes: [
                    'date',
                    [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'total']
                ],
                group: ['date'],
                order: [['date', 'DESC']],
                raw: true
            });

            resolve({
                errCode: 0,
                data: {
                    totalCenters,
                    totalArena,
                    totalSpecialty,
                    totalBooking,
                    bookingByStatus,
                    bookingByDate
                }
            });
        } catch (e) {
            reject(e);
        }
    });
}
let cancelBooking = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            let booking = await db.Booking.findOne({
                where: {
                    id: data.bookingId
                },
                raw: false
            });

            if (booking) {

                booking.statusId = 'S4';

                await booking.save();

                await emailService.sendCancelBooking({
                    receiverEmail: process.env.EMAIL_APP,
                    fullName: booking.fullName,
                    plateNumber: booking.plateNumber,
                    reason: data.reason
                });

                resolve({
                    errCode: 0,
                    errMessage: 'ok'
                });

            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'Booking not found'
                });
            }

        } catch (e) {
            reject(e);
        }
    })
}
let createEmployee = (data) => {
    return new Promise(async (resolve, reject) => {

        try {

            await db.Employee.create({
                fullName: data.fullName,
                phoneNumber: data.phoneNumber,
                position: data.position,
                centerId: data.centerId
            });

            resolve({
                errCode: 0,
                errMessage: 'ok'
            })

        } catch (e) {
            reject(e);
        }
    })
}
let getEmployeesByCenter = (centerId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Employee.findAll({
                where: { centerId: centerId },
                raw: true
            });

            resolve({
                errCode: 0,
                data
            });
        } catch (e) {
            reject(e);
        }
    });
}

let updateEmployee = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing employee id'
                });
            } else {
                let employee = await db.Employee.findOne({
                    where: { id: data.id },
                    raw: false
                });

                if (employee) {
                    employee.fullName = data.fullName;
                    employee.phoneNumber = data.phoneNumber;
                    employee.position = data.position;

                    await employee.save();

                    resolve({
                        errCode: 0,
                        errMessage: 'Update employee success'
                    });
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Employee not found'
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    });
}

let deleteEmployee = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing employee id'
                });
            } else {
                await db.Employee.destroy({
                    where: { id: id }
                });

                resolve({
                    errCode: 0,
                    errMessage: 'Delete employee success'
                });
            }
        } catch (e) {
            reject(e);
        }
    });
}
let getReportDashboard = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let whereCondition = {};

            if (data.reportType === 'DATE' && data.selectedDate) {
                let startDate = new Date(data.selectedDate).setHours(0, 0, 0, 0);
                let endDate = new Date(data.selectedDate).setHours(23, 59, 59, 999);

                whereCondition.date = {
                    [db.Sequelize.Op.between]: [startDate, endDate]
                };
            }

            if (data.reportType === 'MONTH') {

                let month = parseInt(data.selectedMonth);
                let year = parseInt(data.selectedYear);

                let startDate = new Date(year, month - 1, 1).getTime();

                let endDate = new Date(year, month, 0, 23, 59, 59, 999).getTime();

                whereCondition.date = {
                    [db.Sequelize.Op.between]: [startDate, endDate]
                };
            }

            if (data.reportType === 'YEAR') {

                let year = parseInt(data.selectedYear);

                let startDate = new Date(year, 0, 1).getTime();

                let endDate = new Date(year, 11, 31, 23, 59, 59, 999).getTime();

                whereCondition.date = {
                    [db.Sequelize.Op.between]: [startDate, endDate]
                };
            }

            if (
                data.selectedCenter &&
                data.selectedCenter !== 'ALL'
            ) {
                whereCondition.centerId = data.selectedCenter;
            }

            let bookings = await db.Booking.findAll({
                where: whereCondition,
                include: [
                    {
                        model: db.User,
                        as: 'centerData',
                        attributes: ['id', 'fullName'],
                        include: [
                            {
                                model: db.Center_Infor,
                                include: [
                                    {
                                        model: db.Allcode,
                                        as: 'regionTypeData',
                                        attributes: ['valueVi']
                                    },
                                    {
                                        model: db.Allcode,
                                        as: 'priceTypeData',
                                        attributes: ['valueVi']
                                    }
                                ]
                            }
                        ]
                    }
                ],
                raw: false,
                nest: true
            });

            let centerMap = {};
            let vehicleMap = {};
            console.log(JSON.stringify(bookings[0], null, 2));
            bookings.forEach(item => {
                let centerId = item.centerId;
                let price = Number(item.centerData?.Center_Infor?.priceTypeData?.valueVi || 0);
                let region = item.centerData?.Center_Infor?.regionTypeData?.valueVi || 'Chưa có';
                let vehicle = item.vehicleType || 'Khác';

                if (!vehicleMap[vehicle]) {
                    vehicleMap[vehicle] = 0;
                }

                vehicleMap[vehicle]++;
                if (!centerMap[centerId]) {
                    centerMap[centerId] = {
                        centerName: item.centerData?.fullName || 'Chưa có',
                        region: region,
                        service: 'Dịch vụ đăng kiểm',
                        vehicleType: '',
                        totalBooking: 0,
                        totalRevenue: 0,
                        vehicleMap: {}
                    }
                }

                centerMap[centerId].totalBooking += 1;
                centerMap[centerId].totalRevenue += price;


                if (!centerMap[centerId].vehicleMap[vehicle]) {
                    centerMap[centerId].vehicleMap[vehicle] = 0;
                }

                centerMap[centerId].vehicleMap[vehicle] += 1;
            });

            let reportByCenter = Object.values(centerMap).map(item => {
                let vehicleType = Object.keys(item.vehicleMap)
                    .map(key => `${key}: ${item.vehicleMap[key]}`)
                    .join(', ');


                return {
                    centerName: item.centerName,
                    centerCode: item.centerName.match(/\d{2}-\d{2}[A-Z]/)?.[0] || item.centerName,
                    region: item.region,
                    service: item.service,
                    vehicleType: vehicleType,
                    totalBooking: item.totalBooking,
                    totalRevenue: item.totalRevenue
                }
            });
            let bookingByVehicle = Object.keys(vehicleMap).map(key => ({
                name: key,
                total: vehicleMap[key]
            }));
            let regionSet = new Set();
            reportByCenter.forEach(item => {
                if (item.region) {
                    regionSet.add(item.region);
                }
            });

            let totalRegion = regionSet.size;
            let totalVehicle = bookingByVehicle.length;
            let totalService = 1;

            let totalBooking = bookings.length;
            let totalCenter = reportByCenter.length;
            let totalRevenue = reportByCenter.reduce((sum, item) => {
                return sum + item.totalRevenue;
            }, 0);

            resolve({
                errCode: 0,
                data: {
                    totalBooking,
                    totalCenter,
                    totalRevenue,
                    totalRegion,
                    totalVehicle,
                    totalService,
                    reportByCenter,
                    bookingByVehicle
                }
            });

        } catch (e) {
            reject(e);
        }
    });
}

module.exports = {
    getTopCenterHome: getTopCenterHome,
    getAllCenters: getAllCenters,
    saveDetailInforCenter: saveDetailInforCenter,
    getDetailCenterById: getDetailCenterById,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
    getExtraInforCenterById: getExtraInforCenterById,
    getProfileCenterById: getProfileCenterById,
    getListOwnForCenter: getListOwnForCenter,
    sendRemedy: sendRemedy,
    getAdminDashboardStats: getAdminDashboardStats,
    cancelBooking: cancelBooking,
    createEmployee: createEmployee,
    getEmployeesByCenter: getEmployeesByCenter,
    updateEmployee: updateEmployee,
    deleteEmployee: deleteEmployee,
    getReportDashboard: getReportDashboard,
}