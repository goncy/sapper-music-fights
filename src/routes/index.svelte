<script>
  import io from "socket.io-client";
  import axios from "axios";

  const socket = io("ws://localhost:3000", { transports: ["websocket"] });

  let song;
  let candidates;
  let votes;

  socket.on("song", _song => (song = _song));
  socket.on("candidates", _candidates => (candidates = _candidates));
  socket.on("votes", _votes => (votes = _votes));

  $: console.log(song, candidates, votes);

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
  {#if candidates && votes}
    <ul>
      {#each candidates as candidate}
        <li>
          {candidate.name}: {votes[candidate.id]}
          <button on:click={() => vote(candidate.id)}>Vote!</button>
        </li>
      {/each}
    </ul>
  {/if}
</main>
