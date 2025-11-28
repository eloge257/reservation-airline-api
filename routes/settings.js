const express = require("express");
const  reservationController  = require("../controllers/reservation.controller");
const  authController  = require("../controllers/auth_admin.controller");




const settings_routes =  express.Router();

settings_routes.post("/login",authController.login)
settings_routes.post('/client',reservationController.createClient)
settings_routes.post('/airport',reservationController.createAirport)
settings_routes.post('/reservations',reservationController.createReservations)
settings_routes.post('/vol',reservationController.createVol)
settings_routes.post('/typevol',reservationController.createTypeVol)
settings_routes.get('/reservations',reservationController.findAll)
settings_routes.put('/reservations/:id_reservations',reservationController.changeStatut)
settings_routes.put('/vol/:id_vol',reservationController.changeStatutVol)
settings_routes.put('/activ_desactiv_client/:id_client',reservationController.activ_desactiv_client)
settings_routes.get('/reservationsList',reservationController.findAllReservation)
settings_routes.get('/vol',reservationController.findAllVol)
settings_routes.get('/airports',reservationController.findAllairports)
settings_routes.get('/client',reservationController.findAllclient)











module.exports = settings_routes