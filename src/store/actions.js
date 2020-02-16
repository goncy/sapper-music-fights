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

      setTimeout(() => api.player.play(state.winner.uri), state.song.remaining_ms);
      setTimeout(loop, state.song.remaining_ms + 5000);
    }
  } catch (e) {
    console.warn("ERROR: ", e);

    state.status = "ready";

    return setTimeout(loop, 10000);
  }
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
  if (state.token.access) return Promise.reject("A user is already authorized");

  return api.authorization
    .exchange(code)
    .then((response) => {
      state.token.access = response.access_token;
      state.token.refresh = response.refresh_token;
      state.status = "ready";

      loop();
    })
    .catch((e) => {
      console.log(e);

      state.status = "error";
    })
    .finally(() => {
      ws.emit("status", state.status);
    });
}
