import state from "../../../store/state";
import {vote} from "../../../store/actions";

export function post(req, res) {
  const {id} = req.params;

  if (state.votes[id] === undefined) return res.end("this song is not a candidate anymore");

  vote(id);

  res.end("success");
}
