export function parse(input: string): string[][] {
  return input
    .trim()
    .split("\n")
    .map((line) => {
      return line.trim().split("")
    })
}

function get_player_position(matrix: string[][]) {
  for (const [y, line] of matrix.entries()) {
    for (const [x, char] of line.entries()) {
      if (char === "^") {
        return { x, y }
      }
    }
  }
}

async function main(input: string) {
  const state: {
    dir: "north" | "south" | "west" | "east"
    x: number
    y: number
  } = {
    dir: "north",
    x: 0,
    y: 0,
  }

  const map = parse(input)

  const { x, y } = get_player_position(map)!
  state.x = x
  state.y = y

  console.info({ state })

  const history = new Set<string>()

  function is_on_map(x: number, y: number) {
    return x >= 0 && x < map[0].length && y >= 0 && y < map.length
  }

  function get_next_pos(dir: "north" | "south" | "west" | "east") {
    switch (dir) {
      case "north": {
        return {
          x: state.x,
          y: state.y - 1,
        }
      }
      case "south": {
        return {
          x: state.x,
          y: state.y + 1,
        }
      }
      case "west": {
        return {
          x: state.x - 1,
          y: state.y,
        }
      }
      case "east": {
        return {
          x: state.x + 1,
          y: state.y,
        }
      }
    }
  }

  function get_next_dir(dir: "north" | "south" | "west" | "east") {
    switch (dir) {
      case "north": {
        return "east"
      }
      case "east": {
        return "south"
      }
      case "south": {
        return "west"
      }
      case "west": {
        return "north"
      }
    }
  }

  function render() {
    return map
      .map((line, y) => {
        return line
          .map((a, x) => {
            if (y === state.y && x === state.x) {
              return "X"
            }
            return a
          })
          .join("")
      })
      .join("\n")
  }

  while (true) {
    const next_pos = get_next_pos(state.dir)

    const ok = is_on_map(next_pos.x, next_pos.y)

    if (!ok) {
      break
    }

    const char = map[next_pos.y][next_pos.x]

    switch (char) {
      case ".":
      case "^": {
        state.x = next_pos.x
        state.y = next_pos.y
        history.add(`${state.x}_${state.y}`)
        break
      }
      case "#": {
        state.dir = get_next_dir(state.dir)
        break
      }
      default: {
        throw new Error(`wtf '${char}'`)
      }
    }

    console.info({ state, char })

    // await Deno.writeTextFile(
    //   new URL("./map.txt", import.meta.url).pathname,
    //   render()
    // )
  }

  return {
    // history,
    pos_count: history.size,
  }
}

const input = await Deno.readTextFile(
  new URL("./input.txt", import.meta.url).pathname
)

const out = await main(input)
console.info({ out })
