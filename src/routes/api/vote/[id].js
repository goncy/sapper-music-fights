import {vote} from "../../../store/actions";

export function post(req, res) {
  const {id} = req.params;
  const votes = vote(id);

  if (votes === null) return res.end("this song is not a candidate anymore");

  res.end("success");
}
