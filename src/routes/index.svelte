<script>
  import io from "socket.io-client";
  import axios from "axios";

  const socket = io("ws://localhost:3000", { transports: ["websocket"] });

  let song;
  let candidates;

  socket.on("song", _song => (song = _song));
  socket.on("candidates", _candidates => (candidates = _candidates));

  function vote(id) {
    return axios.post(`api/vote/${id}`);
  }
</script>

<svelte:head>
  <title>Let them fight!</title>
</svelte:head>

<main>
  {#if song}
    <h3>Currently playing: {song.name}</h3>
  {/if}
  {#if candidates}
    <ul>
      {#each candidates as candidate}
        <li>
          {candidate.name}: {candidate.votes}
          <button on:click={() => vote(candidate.id)}>Vote!</button>
        </li>
      {/each}
    </ul>
  {/if}
</main>
