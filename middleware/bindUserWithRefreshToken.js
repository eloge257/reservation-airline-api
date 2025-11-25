const jwt = require("jsonwebtoken");
const express = require("express");
const dotenv = require("dotenv");
const { query } = require("../utils/db");
// const PROFILS = require("../constants/PROFILS");
const { DEFAULT_JWT_REFRESH_PRIVATE_KEY } = require("../config/app");
const { Op } = require("sequelize");
dotenv.config();

/**
 * Permet de modifier la requerte en verifiant l'access token et le refresh token
 * @param {express.Request} request
 * @param {express.Response} response
 * @param {express.NextFunction} next
 */
const bindUserWithRefreshToken = (request, response, next) => {
  // console.log({ device: request.device.parser.get_type() })
  const bearer = request.headers.authorization;
  const bearerToken = bearer && bearer.split(" ")[1];
  const accessToken = bearerToken;
  const refreshToken = request.headers["x-refresh-token"];
  if (accessToken) {
    jwt.verify(
      accessToken,
      process.env.JWT_PRIVATE_KEY,
      async (error, tokenData) => {
        if (tokenData) {
          const freshUser = ''
          if (freshUser) {
            if (refreshToken) {
              
            } else {
              request.authStatus = "MISSING_REFRESH_TOKEN";
              next();
            }
          } else {
            request.authStatus = "INVALID_USER";
            next();
          }
        } else {
          request.authStatus = "INVALID_ACCESS_TOKEN";
          next();
        }
      }
    );
  } else {
    request.authStatus = "MISSING_ACCESS_TOKEN";
    next();
  }
};
module.exports = bindUserWithRefreshToken;
