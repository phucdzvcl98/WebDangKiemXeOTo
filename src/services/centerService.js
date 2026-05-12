import db from "../models/index";

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
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] }
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
            if (!inputData.centerId || !inputData.contentHTML || !inputData.contentMarkdown) {
                resolve({
                    errCode: -1,
                    errMessage: 'Missing parament'
                })
            } else {
                if (inputData.aaaction === 'CREATE') {
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
                        centerMarkdown.centerMarkdown = inputData.contentMarkdown;
                        centerMarkdown.description = inputData.description;
                        centerMarkdown.updatedAt = new Date();

                        await centerMarkdown.save()
                    }

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
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] }

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

module.exports = {
    getTopCenterHome: getTopCenterHome,
    getAllCenters: getAllCenters,
    saveDetailInforCenter: saveDetailInforCenter,
    getDetailCenterById: getDetailCenterById
}