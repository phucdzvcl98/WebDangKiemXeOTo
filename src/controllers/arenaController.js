import arenaService from '../services/arenaService';

let createArena = async (req, res) => {
    try {
        let infor = await arenaService.createArena(req.body);
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

let getAllArena = async (req, res) => {
    try {
        let infor = await arenaService.getAllArena();
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

let getDetailArenaById = async (req, res) => {
    try {
        let infor = await arenaService.getDetailArenaById(req.query.id);
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

module.exports = {
    createArena: createArena,
    getDetailArenaById: getDetailArenaById,
    getAllArena: getAllArena
}