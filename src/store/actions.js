import ws from "../websocket";

import state from "./state";
import api from "./resources";

async function loop() {
  try {
    const current = await api.player.fetch();

    if (!state.song || state.song.id !== current.id) {
      state.candidates = await api.recommendations.fetch(current.id);
      state.song = current;
      state.status = "playing";

      ws.emit("song", state.song);
      ws.emit("candidates", state.candidates);
      ws.emit("status", state.status);

      setTimeout(() => {
        state.status = "finished";

        ws.emit("status", state.status);
      }, state.song.remaining_ms - 5000);

      setTimeout(() => api.player.play(state.winner.uri), state.song.remaining_ms);
      setTimeout(loop, state.song.remaining_ms + 5000);
    }
  } catch (e) {
    console.warn("ERROR: ", e);

    state.status = "init";

    return setTimeout(loop, 10000);
  }
}

function initialize() {
  loop();

  ws.on("connection", (socket) => {
    socket.emit("song", state.song);
    socket.emit("candidates", state.candidates);
    socket.emit("status", state.status);
  });
}

// Exported methods
export function vote(id) {
  const index = state.candidates.findIndex((candidate) => candidate.id === id);

  if (index === -1) {
    return null;
  }

  state.candidates[index].votes++;

  ws.emit("candidates", state.candidates);

  return state.candidates[index].votes;
}

export function authorize(code) {
  return api.authorization.exchange(code).then((response) => {
    state.token = response.access_token;
    state.refresh = response.refresh_token;

    initialize();

    return token;
  });
}
