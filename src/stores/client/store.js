import {writable} from "svelte/store";
import io from "socket.io-client";

const socket = io(process.env.URL || "/", {transports: ["websocket"]});

export const song = writable(null);
export const status = writable("pending");
export const candidates = writable([]);

socket.on("song", (_song) => song.set(_song));
socket.on("status", (_status) => status.set(_status));
socket.on("candidates", (_candidates) => candidates.set(_candidates));

socket.on("disconnect", () => status.set("disconnected"));
