<script>
  import axios from "axios";
  import {onMount} from "svelte";
  import {goto} from "@sapper/app";

  let isAuthorized = false;
  let error = null;

  onMount(() => {
    const url = new URLSearchParams(window.location.search);
    const code = url.get("code");

    if (code) {
      axios
        .post(`api/authorize?code=${code}`)
        .then(() => (isAuthorized = true))
        .catch(() => (error = "Error authorizing"));
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
  {#if error}
    <span>{error}</span>
  {:else if isAuthorized}
    <slot />
  {:else}
    <a
      href="https://accounts.spotify.com/authorize?redirect_uri=http%3A%2F%2Flocalhost%3A3000&client_id=cd164d11dbbc448fa9252811ea156a0c&response_type=code&scope=user-read-private%20user-read-email%20playlist-read-private%20user-library-read%20user-library-modify%20user-top-read%20playlist-read-collaborative%20playlist-modify-public%20playlist-modify-private%20user-follow-read%20user-follow-modify%20user-read-currently-playing%20user-modify-playback-state%20user-read-recently-played%20user-read-playback-state">
      Autorizar
    </a>
  {/if}
</main>
