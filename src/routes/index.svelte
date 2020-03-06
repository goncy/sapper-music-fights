<script>
  import axios from "axios";

  import {status, candidates, song} from "../stores/client/store";

  function vote(id) {
    return axios.post(`api/vote?id=${id}`);
  }
</script>

<svelte:head>
  <title>A pelear!</title>
</svelte:head>

<main>
  {#if $status === 'sync'}
    <span>Cargando...</span>
  {:else if $status === 'ready'}
    <span>La musica no esta sonando</span>
  {:else}
    {#if $song}
      <h3>Currently playing: {$song.artists[0].name} - {$song.name}</h3>
    {/if}
    {#if $candidates}
      <ul>
        {#each $candidates as candidate}
          <li>
            <span>{candidate.artists[0].name} - {candidate.name}: {candidate.votes}</span>
            {#if $status !== 'imminent'}
              <button on:click={() => vote(candidate.id)}>Vote!</button>
            {/if}
          </li>
        {/each}
      </ul>
    {/if}
  {/if}
</main>
