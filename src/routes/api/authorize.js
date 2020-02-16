import {authorize} from "../../store/actions";

export function post(req, res) {
  authorize(req.query.code)
    .then(() => {
      res.end("success");
    })
    .catch(() => {
      res.end("authorization failed");
    });
}
