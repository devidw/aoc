export type Cord = {
  x: number
  y: number
  char: string
}

export function construct_matrix(input: string) {
  return input
    .trim()
    .split("\n")
    .map((line) => {
      return line.trim().split("")
    })
}

export function get_cord_lines({
  matrix,
  x,
  y,
  distance,
}: {
  matrix: string[][]
  x: number
  y: number
  distance: number
}) {
  /**
   *
   */
  function get_x_line() {
    const line: Cord[] = []

    const start = x - distance

    const total_distance = distance + 1 + distance

    for (let i = 0; i < total_distance; i++) {
      const the_x = start + i

      const next_char = matrix[y][the_x]

      if (typeof next_char === "undefined") {
        continue
      }

      line.push({
        x: the_x,
        y,
        char: next_char,
      })
    }

    return line.filter(Boolean)
  }

  /**
   *
   */
  function get_y_line() {
    const line: Cord[] = []

    const start = y - distance

    const total_distance = distance + 1 + distance

    for (let i = 0; i < total_distance; i++) {
      const the_y = start + i

      let next_char = undefined

      if (matrix[the_y]) {
        next_char = matrix[the_y][x]
      }

      if (typeof next_char === "undefined") {
        continue
      }

      line.push({
        x,
        y: the_y,
        char: next_char,
      })
    }

    return line.filter(Boolean)
  }

  /**
   *
   */
  function get_diagonal_bottom_2_top() {
    const _doc = `
    -|0|1|2
    0|-|-|X (x=0 y=2)
    1|-|X|- (x=1 y=1)
    2|X|-|- (x=0 y=2)
    `

    const line: Cord[] = []

    const start_x = x - distance
    const start_y = y + distance

    const total_distance = distance + 1 + distance

    for (let i = 0; i < total_distance; i++) {
      const the_x = start_x + i
      const the_y = start_y - i

      let next_char = undefined

      if (matrix[the_y]) {
        next_char = matrix[the_y][the_x]
      }

      if (typeof next_char === "undefined") {
        continue
      }

      line.push({
        x: the_x,
        y: the_y,
        char: next_char,
      })
    }

    return line
  }

  /**
   *
   */
  function get_diagonal_top_2_bottom() {
    const _doc = `
    -|0|1|2
    0|X|-|- (x=0 y=0)
    1|-|X|- (x=1 y=1)
    2|-|-|x (x=2 y=2)
    `

    const line: Cord[] = []

    const start_x = x - distance
    const start_y = y - distance

    const total_distance = distance + 1 + distance

    for (let i = 0; i < total_distance; i++) {
      const the_x = start_x + i
      const the_y = start_y + i

      let next_char = undefined

      if (matrix[the_y]) {
        next_char = matrix[the_y][the_x]
      }

      if (typeof next_char === "undefined") {
        continue
      }

      line.push({
        x: the_x,
        y: the_y,
        char: next_char,
      })
    }

    return line
  }

  const x_line = get_x_line()
  const y_line = get_y_line()
  const diagonal_bottom_to_top = get_diagonal_bottom_2_top()
  const diagonal_top_to_bottom = get_diagonal_top_2_bottom()

  return { x_line, y_line, diagonal_bottom_to_top, diagonal_top_to_bottom }
}

export function maybe_get_match(needle: string, line: Cord[]) {
  const ltr = line.map((a) => a.char).join("")
  const found_ltr = ltr.indexOf(needle)

  if (found_ltr !== -1) {
    const match_cords = line.slice(found_ltr, found_ltr + needle.length)
    return match_cords
  }

  const rtl = ltr.split("").reverse().join("")
  const found_rtl = rtl.indexOf(needle)

  if (found_rtl !== -1) {
    const match_cords = line
      .reverse()
      .slice(found_rtl, found_rtl + needle.length)
    return match_cords
  }

  return null
}

export function main(matrix: string[][]) {
  const matches: Cord[][] = []

  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      // const cords = { x, y }
      // console.info({ cords })

      const lines = get_cord_lines({
        x,
        y,
        distance: 3,
        matrix,
      })

      for (const line of Object.values(lines)) {
        const mb_match = maybe_get_match("XMAS", line)

        if (mb_match) {
          matches.push(mb_match)
        }
      }
    }

    // break
  }

  return matches.map((a) => a.map((b) => [b.x, b.y]))
}

export function is_x_match(one: Cord[], two: Cord[]) {
  if (one.length !== 3 || two.length !== 3) {
    return false
  }

  if (one[1].char !== "A" || two[1].char !== "A") {
    return false
  }

  for (const letter of ["M", "S"]) {
    if (
      ![one[0].char, one[2].char].includes(letter) ||
      ![two[0].char, two[2].char].includes(letter)
    ) {
      return false
    }
  }

  return true
}

export function main_2(matrix: string[][]) {
  const matches: Cord[][][] = []

  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      // const cords = { x, y }
      // console.info({ cords })

      const lines = get_cord_lines({
        x,
        y,
        distance: 1,
        matrix,
      })

      const mb_match = is_x_match(
        lines.diagonal_bottom_to_top,
        lines.diagonal_top_to_bottom
      )

      if (mb_match) {
        matches.push([
          lines.diagonal_bottom_to_top,
          lines.diagonal_top_to_bottom,
        ])
      }
    }

    // break
  }

  return matches
}

export function flatten(input: number[][][]) {
  const cords = new Set<string>()

  for (const match of input) {
    cords.add(match.map((a) => `${a[0]}:${a[1]}`).join("_"))
  }

  return cords
}
