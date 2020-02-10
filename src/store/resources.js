import axios from "axios";

const api = axios.create({baseURL: "https://api.spotify.com/v1"});

api.defaults.headers.common["Authorization"] = `Bearer ${process.env.SPOTIFY_TOKEN}`;

export default {
  recommendations: {
    fetch: (tracks, genres) =>
      api
        .get("/recommendations", {
          params: {
            market: "AR",
            seed_genres: genres ? encodeURIComponent(genres) : null,
            seed_tracks: tracks,
            limit: 4,
          },
        })
        .then((res) =>
          res.status === 200 ? res.data.tracks : Promise.reject("Failed trying to retrieve recomendations"),
        ),
  },
  player: {
    fetch: () =>
      api.get("/me/player").then((res) => (res.status === 200 ? res.data : Promise.reject("Music is not playing"))),
    play: (id) =>
      api
        .put("/me/player/play", {uris: [id]})
        .then((res) => (res.status === 200 ? res.data : Promise.reject("Failed trying to play the specified song"))),
  },
};
