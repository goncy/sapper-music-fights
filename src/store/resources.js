import axios from "axios";

const api = axios.create({baseURL: "https://api.spotify.com/v1"});

api.defaults.headers.common[
  "Authorization"
] = `Bearer BQDAsn9htWqSPHm_ttewUZZGYWb70EfiwcBN1vP5hUgpEnB0cZSSyjUAgnty-KklrxbAsUEED17Ghk_vg2Im7RRFTIUY4n-loHNfuVOEbWs4Kswg7cc4c5rO1etBWxbXtkeLtViAlKjf-shsuiPLwcTu8Y5jxFOpcy_mB1sXULNt82-J7T4UOlonBomVkCJmf1-CEnUiP8rgdKBztafYweHxJEkKewbv96NGs1bYok81lrDn5QRggfibTvbQ68xlG7W74buBxvg`;

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
