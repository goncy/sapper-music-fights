<script>
  import io from "socket.io-client";
  import axios from "axios";

  const socket = io("ws://localhost:3000", {transports: ["websocket"]});

  let song = null;
  let candidates = [];
  let status = "init";

  socket.on("song", (_song) => (song = _song));
  socket.on("candidates", (_candidates) => (candidates = _candidates));
  socket.on("status", (_status) => (status = _status));

  function vote(id) {
    return axios.post(`api/vote/${id}`);
  }
</script>

<svelte:head>
  <title>Let them fight!</title>
</svelte:head>

<main>
  {#if status === 'init'}
    <span>Music is not playing</span>
  {:else}
    <h3>Currently playing: {song.artists[0].name} - {song.name}</h3>
    {#if candidates}
      <ul>
        {#each candidates as candidate}
          <li>
            <span>{candidate.artists[0].name} - {candidate.name}: {candidate.votes}</span>
            {#if status === 'playing'}
              <button on:click={() => vote(candidate.id)}>Vote!</button>
            {/if}
          </li>
        {/each}
      </ul>
    {/if}
  {/if}
</main>
