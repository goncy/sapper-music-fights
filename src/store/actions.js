import ws from "../websocket";

import state from "./state";
import api from "./resources";

export function vote(id) {
  state.votes[id]++;

  ws.emit("votes", state.votes);
}

export async function getCurrent() {
  const player = await api.player.fetch();

  if (!player.is_playing) {
    return Promise.reject("Music is not playing");
  }

  return {...player.item, remaining_ms: player.item.duration_ms - player.progress_ms};
}

export function getRecommendations(id) {
  return api.recommendations.fetch(id);
}

export function playNext() {
  return api.player.play(state.candidates[0].uri);
}
