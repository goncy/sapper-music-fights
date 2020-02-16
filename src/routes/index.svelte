<script>
  import axios from "axios";
  import {onMount} from "svelte";
  import io from "socket.io-client";

  const socket = io("ws://localhost:3000", {transports: ["websocket"]});

  let status = "pending";
  let song = null;
  let candidates = [];

  onMount(() => {
    socket.on("status", (_status) => (status = _status));
    socket.on("song", (_song) => (song = _song));
    socket.on("candidates", (_candidates) => (candidates = _candidates));
  });

  function vote(id) {
    return axios.post(`api/vote/${id}`);
  }
</script>

<svelte:head>
  <title>A pelear!</title>
</svelte:head>

<main>
  {#if status === 'pending'}
    <span>Cargando...</span>
  {:else if status === 'ready'}
    <span>La musica no esta sonando</span>
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
