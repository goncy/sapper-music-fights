import ws from "../../websocket";

import state from "./state";
import api from "./resources";

async function loop() {
  try {
    const current = await api.player.fetch();

    if (current.remaining_ms <= 10000 && state.status !== "imminent") {
      state.status = "imminent";

      ws.emit("status", state.status);

      setTimeout(() => {
        if (state.winner) {
          api.player.play(state.winner.uri);
        }
      }, current.remaining_ms - 1000);
    } else if (!state.song || state.song.id !== current.id) {
      state.songs.push(current);
      state.candidates = await api.recommendations.fetch(state.seeds);
      state.status = "playing";

      ws.emit("song", state.song);
      ws.emit("candidates", state.candidates);
      ws.emit("status", state.status);
    } else if (!current.is_playing) {
      if (state.winner) {
        api.player.play(state.winner.uri);
      } else {
        api.player.play(current.uri);
      }
    }
  } catch (e) {
    console.warn("ERROR: ", e);

    state.status = "ready";

    ws.emit("status", state.status);
  }

  setTimeout(loop, 5000);
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
      state.status = "sync";

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
