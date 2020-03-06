export default {
  // Tokens
  token: {},
  // Initialize status
  status: "init",
  // Songs
  song: null,
  songs: [],
  // Song candidates
  candidates: [],
  // Song candidates winner
  get seeds() {
    return this.songs
      .map((song) => song.id)
      .slice(-5)
      .join(",");
  },
  get song() {
    return this.songs[this.songs.length - 1];
  },
  get winner() {
    return [...this.candidates].sort((a, b) => b.votes - a.votes)[0];
  },
};
