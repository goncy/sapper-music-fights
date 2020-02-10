import ws from "../websocket";

import state from "./state";
import api from "./resources";

async function getCurrent() {
  const player = await api.player.fetch();

  if (!player.is_playing) {
    return Promise.reject("Music is not playing");
  }

  return {...player.item, remaining_ms: player.item.duration_ms - player.progress_ms};
}

function getRecommendations(track) {
  return api.recommendations
    .fetch(track)
    .then((recommendations) => recommendations.map((recommendation) => ({...recommendation, votes: 0})));
}

function playNext() {
  return api.player.play(state.winner.uri);
}

async function loop() {
  try {
    const current = await getCurrent();

    if (!state.song || state.song.name !== current.name) {
      state.candidates = await getRecommendations(current.id);
      state.song = current;

      ws.emit("song", state.song);
      ws.emit("candidates", state.candidates);

      setTimeout(playNext, state.song.remaining_ms);
      setTimeout(loop, state.song.remaining_ms + 5000);
    }
  } catch (e) {
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

export function initialize() {
  loop();

  ws.on("connection", (socket) => {
    socket.emit("song", state.song);
    socket.emit("candidates", state.candidates);
  });
}
