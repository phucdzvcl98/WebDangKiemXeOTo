const db = require("../models");

let createArena = (data) => {
    return new Promise(async (resolve, reject) => {

        try {
            if (!data.name || !data.address
                || !data.imageBase64
                || !data.descriptionHTML
                || !data.descriptionMarkdown
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing paremeter'
                })
            } else {
                await db.Arena.create({
                    name: data.name,
                    address: data.address,
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

let getAllArena = () => {
    return new Promise(async (resolve, reject) => {

        try {
            let data = await db.Arena.findAll({

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

let getDetailArenaById = (inputId) => {
    return new Promise(async (resolve, reject) => {

        try {
            console.log('INPUT ID:', inputId);
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missng parameter',
                })
            }
            else {
                let data = await db.Arena.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: ['name', 'address', 'descriptionHTML', 'descriptionMarkdown'],
                })
                console.log('DATA ARENA:', data);
                if (data) {
                    let centerArena = [];
                    centerArena = await db.Center_Infor.findAll({
                        where: { arenaId: inputId },
                        attributes: ['centerId', 'provinceId'],
                    })
                    data.centerArena = centerArena;
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
    createArena: createArena,
    getAllArena: getAllArena,
    getDetailArenaById: getDetailArenaById
}