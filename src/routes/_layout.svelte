<script>
  import axios from "axios";
  import io from "socket.io-client";
  import {onMount} from "svelte";

  const socket = io("ws://localhost:3000", {transports: ["websocket"]});

  let status = "pending";
  let code;

  socket.on("status", (_status) => (status = _status));

  onMount(() => {
    code = new URLSearchParams(window.location.search).get("code");

    if (code) {
      axios.post(`api/authorize?code=${code}`);
    }
  });
</script>

<style>
  main {
    margin: 0 auto;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
  }
</style>

<main>
  {#if status === 'pending'}
    <span>Cargando...</span>
  {:else if status === 'error'}
    <span>Hubo un error, intenta de nuevo mas tarde</span>
  {:else if status === 'init'}
    {#if code}
      <span>Autorizando...</span>
    {:else}
      <a
        href="https://accounts.spotify.com/authorize?redirect_uri=http%3A%2F%2Flocalhost%3A3000&client_id=cd164d11dbbc448fa9252811ea156a0c&response_type=code&scope=user-read-private%20user-read-email%20playlist-read-private%20user-library-read%20user-library-modify%20user-top-read%20playlist-read-collaborative%20playlist-modify-public%20playlist-modify-private%20user-follow-read%20user-follow-modify%20user-read-currently-playing%20user-modify-playback-state%20user-read-recently-played%20user-read-playback-state">
        Autorizar
      </a>
    {/if}
  {:else}
    <slot />
  {/if}
</main>
