import sirv from "sirv";
import polka from "polka";
import compression from "compression";
import * as sapper from "@sapper/server";

import {getCurrent, getRecommendations, playNext} from "./store/actions";
import state from "./store/state";
import ws from "./websocket";
import server from "./http";

const {PORT, NODE_ENV} = process.env;
const dev = NODE_ENV === "development";

async function loop() {
  try {
    const current = await getCurrent();

    if (!state.song || state.song.name !== current.name) {
      state.candidates = await getRecommendations(current.id);
      state.song = current;
      state.votes = state.candidates.reduce((acc, candidate) => ({...acc, [candidate.id]: 0}), {});

      ws.emit("song", state.song);
      ws.emit("candidates", state.candidates);
      ws.emit("votes", state.votes);

      setTimeout(playNext, state.song.remaining_ms);
      setTimeout(loop, state.song.remaining_ms + 5000);
    }
  } catch (e) {
    return setTimeout(loop, 10000);
  }
}

polka({server})
  .use(compression({threshold: 0}), sirv("static", {dev}), sapper.middleware())
  .listen(PORT, async (err) => {
    if (err) console.log("error", err);

    loop();

    ws.on("connection", (socket) => {
      socket.emit("song", state.song);
      socket.emit("candidates", state.candidates);
      socket.emit("votes", state.votes);
    });
  });
