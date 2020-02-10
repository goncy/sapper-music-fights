import sirv from "sirv";
import polka from "polka";
import compression from "compression";
import * as sapper from "@sapper/server";

import {initialize} from "./store/actions";
import server from "./http";

polka({server})
  .use(compression({threshold: 0}), sirv("static", {dev: process.env.NODE_ENV === "development"}), sapper.middleware())
  .listen(process.env.PORT, async (err) => {
    if (err) console.log("error", err);

    initialize();
  });
