import axios from "axios";
import querystring from "querystring";

import state from "./state";

const api = axios.create({baseURL: "https://api.spotify.com/v1"});

export default {
  authorization: {
    exchange: (code) =>
      axios({
        method: "POST",
        url: "https://accounts.spotify.com/api/token",
        data: querystring.stringify({
          code,
          grant_type: "authorization_code",
          redirect_uri: "http://localhost:3000",
          client_id: "cd164d11dbbc448fa9252811ea156a0c",
          client_secret: "d2dfa5b921cf43948cce76fcad66e9cd",
        }),
        headers: {"content-type": "application/x-www-form-urlencoded"},
      }).then((res) => (res.status === 200 ? res.data : Promise.reject("Failed exchanging the token"))),
  },
  recommendations: {
    fetch: (tracks) =>
      api
        .get("/recommendations", {
          params: {
            market: "AR",
            seed_tracks: tracks,
            limit: 10,
          },
          headers: {
            Authorization: `Bearer ${state.token.access}`,
          },
        })
        .then((res) =>
          res.status === 200
            ? res.data.tracks.map((recommendation) => ({...recommendation, votes: 0}))
            : Promise.reject("Failed trying to retrieve recomendations"),
        ),
  },
  player: {
    fetch: () =>
      api
        .get("/me/player", {
          headers: {
            Authorization: `Bearer ${state.token.access}`,
          },
        })
        .then((res) =>
          res.status === 200
            ? {
                ...res.data.item,
                is_playing: res.data.is_playing,
                remaining_ms: res.data.item.duration_ms - res.data.progress_ms,
              }
            : Promise.reject("Music is not playing"),
        ),
    play: (id) =>
      api
        .put(
          "/me/player/play",
          {
            uris: [id],
          },
          {
            headers: {
              Authorization: `Bearer ${state.token.access}`,
            },
          },
        )
        .then((res) => (res.status === 204 ? res.data : Promise.reject("Failed trying to play the specified song"))),
  },
};
