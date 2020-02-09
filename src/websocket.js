import io from "socket.io";

import server from "./http";

export default io(server);
