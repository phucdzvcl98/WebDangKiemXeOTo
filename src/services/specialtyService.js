const db = require("../models");

let createSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {

        try {
            if (!data.name
                || !data.imageBase64
                || !data.descriptionHTML
                || !data.descriptionMarkdown
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing paremeter'
                })
            } else {
                await db.Specialty.create({
                    name: data.name,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown
                })

                resolve({
                    errCode: 0,
                    errMessage: 'ok'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getAllSpecialty = () => {
    return new Promise(async (resolve, reject) => {

        try {
            let data = await db.Specialty.findAll({

            });
            if (data && data.length > 0) {
                data.map(item => {
                    item.image = new Buffer(item.image, 'base64').toString('binary');
                    return item;
                })
            }
            resolve({
                errCode: 0,
                errMessage: 'ok',
                data
            })
        } catch (e) {
            reject(e);
        }
    })
}

let getDetailSpecialtyById = (inputId, location) => {
    return new Promise(async (resolve, reject) => {

        try {
            if (!inputId || !location) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missng parameter',
                })
            }
            else {
                let data = await db.Specialty.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: ['descriptionHTML', 'descriptionMarkdown'],
                })
                if (data) {
                    let centerSpecialty = [];

                    if (location === 'ALL') {
                        centerSpecialty = await db.Center_Infor.findAll({
                            where: {
                                specialtyId: inputId
                            },
                            attributes: ['centerId', 'specialtyId', 'regionId']
                        });
                    } else {
                        centerSpecialty = await db.Center_Infor.findAll({
                            where: {
                                specialtyId: inputId,
                                regionId: location
                            },
                            attributes: ['centerId', 'specialtyId', 'regionId']
                        });
                    }

                    data.centerSpecialty = centerSpecialty;
                } else data = {}



                resolve({
                    errCode: 0,
                    errMessage: 'ok',
                    data
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    createSpecialty: createSpecialty,
    getAllSpecialty: getAllSpecialty,
    getDetailSpecialtyById: getDetailSpecialtyById
}