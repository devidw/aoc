export function parse_order(input: string): [number, number][] {
  return input
    .trim()
    .split("\n")
    .map((a) => {
      a = a.trim()
      const [left, right] = a.split("|")
      return [Number(left), Number(right)]
    })
}

export function parse_series(input: string): number[][] {
  return input
    .trim()
    .split("\n")
    .map((a) => {
      a = a.trim()
      return a.split(",").map((a) => Number(a))
    })
}

export function main({
  order,
  series,
}: {
  order: [number, number][]
  series: number[][]
}) {
  function per_series_rules(series: number[]) {
    const rules = new Map<number, Set<number>>()

    const filtered_order = order.filter((a) => {
      return series.includes(a[0]) && series.includes(a[1])
    })

    for (const [before, after] of filtered_order) {
      if (!rules.has(after)) {
        rules.set(after, new Set([before]))
      } else {
        const match = rules.get(after)!
        match.add(before)
      }
    }

    return rules
  }

  function is_valid(row: number[]) {
    const rules = per_series_rules(row)

    // console.info(row, rules)

    for (let i = 0; i < row.length; i++) {
      const page = row[i]
      const pages_before = row.slice(0, i)
      const pages_after = row.slice(i)

      const need_before = rules.get(page)

      if (!need_before) {
        continue
      }

      for (const before of pages_before) {
        if (![...need_before].includes(before)) {
          return false
        }
      }

      for (const after of pages_after) {
        if ([...need_before].includes(after)) {
          return false
        }
      }
    }

    return true
  }

  let series_i = 0

  const good_ones = []

  for (const one of series) {
    const ok = is_valid(one)

    if (ok) {
      good_ones.push(series_i)
    }

    series_i++
  }

  /**
   * 0 1 2
   * A B C
   * - * -
   *
   * len 3
   * half 1.5
   * floor  1
   */
  function get_middle(series: number[]) {
    return series.at(Math.floor(series.length / 2))!
  }

  let sum = 0

  good_ones.forEach((i) => {
    const good_row = series[i]
    const middle = get_middle(good_row)
    // console.info(one, middle)
    sum += middle
  })

  return {
    good_len: good_ones.length,
    good_ones,
    sum,
  }
}
