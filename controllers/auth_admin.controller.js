const express = require("express")
const Validation = require("../class/Validation")
const generateToken = require('../utils/generateToken');
const TOKENS_CONFIG = require("../constants/TOKENS_CONFIG")
const dotenv = require('dotenv');
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const RESPONSE_CODES = require("../constants/RESPONSE_CODES")
const RESPONSE_STATUS = require("../constants/RESPONSE_STATUS")
const Utilisateurs = require("../models/Utilisateurs")
dotenv.config()

/**
 * Permet de vérifier la connexion d'un utilisateur
 * @author NIREMA ELOGE <nirema.eloge@mediabox.bi>
 * @param {express.Request} res 
 * @param {express.Response} res 
 */
const login = async (req, res) => {
    try {
        const { username, password, deviceInfo: deviceInfoStr } = req.body;
        // return console.log(username,"---------------------");
        
        var deviceInfo
        if (deviceInfoStr) {
            deviceInfo = JSON.parse(deviceInfoStr)
        }
        const validation = new Validation(
            req.body,
            {
                password:
                {
                    required: true,
                },
            },
            {
              password:
              {
                        required: req.__('auth_riders.controller.required')
              },
            }
        );
        await validation.run();
        const isValid = await validation.isValidate()
        const errors = await validation.getErrors()
        if (!isValid) {
            return res.status(RESPONSE_CODES.UNPROCESSABLE_ENTITY).json({
                statusCode: RESPONSE_CODES.UNPROCESSABLE_ENTITY,
                httpStatus: RESPONSE_STATUS.UNPROCESSABLE_ENTITY,
                message: "Probleme de validation des donnees",
                result: errors
            })
        }
        const userObject = await Utilisateurs.findOne({
            where: { username: username, is_activated: 1 },
            attributes: ['id_utilisateurs', 'username', 'id_client', 'mot_de_passe', 'is_activated'],
         
        })
        // return console.log(userObject.toJSON(),password,"-------------------------");
        
        if (userObject) {
            const user = userObject.toJSON()
            const validPassword = await bcrypt.compare(password, user.mot_de_passe)
            if (validPassword) {
                const tokenData = {
                    user: user.id_utilisateurs,
                }
                const token = generateToken(tokenData, TOKENS_CONFIG.APP_ACCESS_TOKEN_MAX_AGE)
                const JWT_REFRESH_PRIVATE_KEY = process.env.JWT_REFRESH_PRIVATE_KEY || "\L/@B8?o4@vp-3MCt!,*\S@,e7+-TK]'a5M8o!t)!\cMqhw|aO4i8}Uq*L7,46)--}4c-]\[el/3D-G-F#pg4*FPP.xoYqa-W3,s|8.(tCa(s@uC;:L"
                const refreshToken = jwt.sign(tokenData, JWT_REFRESH_PRIVATE_KEY, {
                    expiresIn: TOKENS_CONFIG.REFRESH_TOKEN_MAX_AGE
                })
               
                let userRoles
                     userRoles = {
                        ...user,
                  }
                const { PASSWORD, ...other} = userRoles
                res.status(RESPONSE_CODES.CREATED).json({
                    statusCode: RESPONSE_CODES.CREATED,
                    httpStatus: RESPONSE_STATUS.CREATED,
                    message: "Vous êtes connecté avec succès",
                    result: {
                        ...other,
                        token,
                        REFRESH_TOKEN: refreshToken
                    }
                })
            } else {
                validation.setError('main', 'Identifiants incorrects')
                const errors = await validation.getErrors()
                res.status(RESPONSE_CODES.NOT_FOUND).json({
                    statusCode: RESPONSE_CODES.NOT_FOUND,
                    httpStatus: RESPONSE_STATUS.NOT_FOUND,
                    message: "Utilisateur n'existe pas",
                    result: errors
                })
            }
        } else {
            validation.setError('main', 'Identifiants incorrects')
            const errors = await validation.getErrors()
            res.status(RESPONSE_CODES.NOT_FOUND).json({
                statusCode: RESPONSE_CODES.NOT_FOUND,
                httpStatus: RESPONSE_STATUS.NOT_FOUND,
                message: "Utilisateur n'existe pas",
                result: errors
            })
        }
    } catch (error) {
        console.log(error)
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard",
        })
    }
}


module.exports = {
    login,
}