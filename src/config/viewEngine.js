import express from "express";
import cors from "cors";

let configViewEngine = (app) => {
    app.use(cors({ credentials: true, origin: true }));
    app.use(express.static("./src/public"));
    app.set("view engine", "ejs"); //jsp, blade for if esle
    app.set("views", "./src/views")
}

module.exports = configViewEngine;