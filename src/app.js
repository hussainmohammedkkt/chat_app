import "./../env";
const path = require("path");
const cors = require("cors");
import express from "express";
import bodyParser from "body-parser";
const chalk = require("chalk");
const cluster = require("cluster");
import { Server } from "socket.io";
const http = require("http");
const numCPUs = require("os").cpus().length;
const { setupMaster, setupWorker } = require("@socket.io/sticky");
const { createAdapter, setupPrimary } = require("@socket.io/cluster-adapter");
import { login } from "./controllers/users";
import { joinMeeting, newMeeting } from "./controllers/rooms";
import { saveMessage } from "./controllers/chats";
import moment from "moment";

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  console.log(`Spinning up ${numCPUs} worker nodes...`);

  const httpServer = http.createServer();

  setupMaster(httpServer, {
    loadBalancingMethod: "least-connection",
  });

  setupPrimary();

  httpServer.listen(3001);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  const app = express();
  app.set("views", path.join(__dirname, "/views"));
  app.set("view engine", "ejs");
  app.set("view options", {
    layout: false,
  });
  app.use(cors());
  app.use(
    bodyParser.urlencoded({
      extended: true,
      limit: "100mb",
    })
  );

  app.disable("x-powered-by");
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "GET, PUT, POST, DELETE, OPTIONS"
    );
    if ("OPTIONS" === req.method) {
      res.sendStatus(200);
    } else {
      next();
    }
  });
  app.get("/", (req, res) => {
    res.render("home");
  });

  app.post("/login", (req, res) => {
    login(req, res);
  });
  app.post("/newMeeting", (req, res) => {
    newMeeting(req, res);
  });
  app.post("/joinMeeting", (req, res) => {
    joinMeeting(req, res);
  });
  const server = http.createServer(app);
  const io = new Server(server);
  io.adapter(createAdapter());
  setupWorker(io);
  io.on("connection", (socket) => {
    console.log("User joined on worker node", cluster.worker.id);
    socket.on("join_meeting", (data) => {
      socket.join(`#meeting-${data.room_token}`);
      io.to(`#meeting-${data.room_token}`).emit("user_joined", { user_name: data.user_name });
    });
    socket.on("newmessage", (data) => {
      io.to(`#meeting-${data.room_token}`).emit("message", {
        user_name: data.user_name,
        user_id: data.user_id,
        message: data.message,
        time: moment().format("hh:mm A"),
      });
      saveMessage(data);
    });
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
}
