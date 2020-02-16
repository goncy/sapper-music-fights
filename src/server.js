import sirv from "sirv";
import polka from "polka";
import compression from "compression";
import * as sapper from "@sapper/server";

import server from "./http";
import ws from "./websocket";
import state from "./store/state";

polka({server})
  .use(compression({threshold: 0}), sirv("static", {dev: process.env.NODE_ENV === "development"}), sapper.middleware())
  .listen(process.env.PORT, async (err) => {
    if (err) {
      console.log("error", err);
    }

    ws.on("connection", (socket) => {
      socket.emit("song", state.song);
      socket.emit("candidates", state.candidates);
      socket.emit("status", state.status);
    });
  });
