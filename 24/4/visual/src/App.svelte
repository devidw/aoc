<script lang="ts">
  import { main } from "./lib.js"
  import matrix from "./matrix.json"
  import test_matrix from "./test_matrix.json"

  const all = main(test_matrix)
  console.log(all.length)

  function flatten(input: number[][][]) {
    const cords: string[] = []

    for (const match of input) {
      for (const one of match) {
        cords.push(`${one[0]}:${one[1]}`)
      }
    }

    return cords
  }

  const flat = flatten(all)
</script>

<table>
  {#each test_matrix as line, y}
    <tr>
      {#each line as char, x}
        <td
          title={`${x}:${y}`}
          class={flat.includes(`${x}:${y}`) ? "active" : ""}
        >
          {char}
        </td>
      {/each}
    </tr>
  {/each}
</table>

<style>
  :global(body) {
    background: black;
    color: white;
  }

  .active {
    background: #800;
  }

  td {
    font-family: monospace;
    font-size: 10px;
  }
</style>
