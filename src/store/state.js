export default {
  status: "init",
  song: null,
  candidates: [],
  get winner() {
    return [...this.candidates].sort((a, b) => b.votes - a.votes)[0];
  },
};
