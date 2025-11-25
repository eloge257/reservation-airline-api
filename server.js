// Core modules & third-party dependencies
const express = require("express");
const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path"); 
const dotenv = require("dotenv");
const cors = require("cors");
const ip = require("ip");
const { Server } = require("socket.io");
const i18n = require("i18n");
const fileUpload = require("express-fileupload");
// Custom middlewares & constants
const bindUser = require("./middleware/bindUser");
const bindUserWithRefreshToken = require("./middleware/bindUserWithRefreshToken");
const RESPONSE_CODES = require("./constants/RESPONSE_CODES");
const RESPONSE_STATUS = require("./constants/RESPONSE_STATUS");
const settings_routes = require("./routes/settings");
const stock_routes = require("./routes/stock.routes");

// Load environment variables
dotenv.config({ path: path.join(__dirname, "./.env") });

// Express app initialization
const app = express();

// Internationalization (i18n) configuration
i18n.configure({
  locales: ["fr", "en", "bi"],
  defaultLocale: "fr",
  retryInDefaultLocale: true,
  directory: path.join(__dirname, "/config/lang"),
  register: global,
  header: "accept-language",
  queryParameter: "lang",
  autoReload: true,
  syncFiles: false,
  updateFiles: false,
});
app.use(i18n.init);

// Middleware setup
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

//appeler des routes
app.use("/settings",settings_routes)
app.use("/stock",stock_routes)


// Custom middlewares
app.all("*", bindUser);
app.all("*", bindUserWithRefreshToken);

// 404 Handler
app.all("*", (req, res) => {
  res.status(RESPONSE_CODES.NOT_FOUND).json({
    statusCode: RESPONSE_CODES.NOT_FOUND,
    httpStatus: RESPONSE_STATUS.NOT_FOUND,
    message: "Route non trouvé",
    result: [],
  });
});

// Server configuration
const port = process.env.PORT || 8000;
const isHttps = false;

// let server;
// if (isHttps) {
//   const options = {
//     key: fs.readFileSync("/var/www/html/api/https/privkey.pem"),
//     cert: fs.readFileSync("/var/www/html/api/https/fullchain.pem"),
//   };
//   server = https.createServer(options, app);
// } else {
//   server = http.createServer(app);
// }

// Socket.io setup
// const io = new Server(server);
// io.on("connection", (socket)p => {
//   socket.on("join", (data) => {
//     console.log(data.userType, data.userId, "Connect to a socket");
//     socket.join(data.userId);
//   });
// });
// io.on("disconnect", () => {
//   console.log("user disconnected");
// });
// app.io = io;

// app.listen(5000, () => {
app.listen(5000, "10.238.130.227", () => {
  console.log(
    `${process.env.NODE_ENV?.toUpperCase()} - Server is running on : 172.16.0.116:${port}/`
  );
});
// Start server

// server.listen(port, () => {

//   console.log(
//     `${process.env.NODE_ENV?.toUpperCase()} - Server is running on : http://${ip.address()}:${port}/`
//   );
// });
