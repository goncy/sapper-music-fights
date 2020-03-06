import {vote} from "../../stores/api/actions";

export function post(req, res) {
  const votes = vote(req.query.id);

  if (votes === null) return res.end("this song is not a candidate anymore");

  res.end("success");
}
