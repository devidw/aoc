<script lang="ts">
  import { main } from "./lib.js"
  import map from "./map.json"

  const out = main(map)
</script>

<table>
  {#each map as y_line, y}
    <tr>
      {#each y_line as x_char, x}
        <td>
          {#if out.history.has(`${x}_${y}`)}
            X
          {:else}
            {map[y][x]}
          {/if}
        </td>
      {/each}
    </tr>
  {/each}
</table>

<style>
  td {
    font-family: monospace;
    font-size: 10px;
  }
</style>
