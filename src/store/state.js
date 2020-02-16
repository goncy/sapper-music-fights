export default {
  // Tokens
  token: {},
  // Initialize status
  status: "init",
  // Current song
  song: null,
  // Song candidates
  candidates: [],
  // Song candidates winner
  get winner() {
    return [...this.candidates].sort((a, b) => b.votes - a.votes)[0];
  },
};
