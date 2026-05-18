import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import centerController from "../controllers/centerController";
import ownController from "../controllers/ownController";

let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/", homeController.getHomePage);
    router.get("/about", homeController.getAboutPage);
    router.get("/crud", homeController.getCRUD);
    router.post("/post-crud", homeController.postCRUD);
    router.get("/get-crud", homeController.displayGetCRUD);
    router.get("/edit-crud", homeController.getEditCRUD);
    router.post("/put-crud", homeController.putCRUD);
    router.get("/delete-crud", homeController.deleteCRUD);

    router.post('/api/login', userController.handleLogin);
    router.get('/api/get-all-users', userController.handleGetAllUsers);
    router.post('/api/create-new-user', userController.handleCreateNewUser);
    router.put('/api/edit-user', userController.handleEditUser);
    router.delete('/api/delete-user', userController.handleDeleteUser);
    router.get('/api/allcode', userController.getAllCode);

    router.get('/api/top-center-home', centerController.getTopCenterHome);
    router.get('/api/get-all-centers', centerController.getAllCenters);
    router.post('/api/save-infor-centers', centerController.postInforCenter);
    router.get('/api/get-detail-center-by-id', centerController.getDetailCenterById);
    router.post('/api/bulk-create-schedule', centerController.bulkCreateSchedule);
    router.get('/api/get-schedule-center-by-date', centerController.getScheduleByDate);
    router.get('/api/get-extra-infor-center-by-id', centerController.getExtraInforCenterById);
    router.get('/api/get-profile-center-by-id', centerController.getProfileCenterById);

    router.post('/api/own-book-appointment', ownController.postBookAppointment);

    return app.use("/", router);
};
module.exports = initWebRoutes;