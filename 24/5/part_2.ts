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

function get_middle(series: number[]) {
  return series.at(Math.floor(series.length / 2))!
}

export function get_rule_sets(row: number[], order: number[][]) {
  const filtered_order = order.filter((a) => {
    return row.includes(a[0]) && row.includes(a[1])
  })

  return filtered_order
}

function per_series_rules(series: number[], order: number[][]) {
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

export function sort(row: number[], order: number[][]) {
  const new_one = [...row].sort((a, b) => {
    const local_rules = per_series_rules([a, b], order)
    const found = local_rules.get(a)

    if (!found) {
      return 0
    }

    // [a, b]
    if ([...found].includes(b)) {
      return -1
    }

    return 1
  })

  return new_one.reverse()
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
  const bad_ones = []

  for (const one of series) {
    const ok = is_valid(one)

    if (ok) {
      good_ones.push(series_i)
    } else {
      bad_ones.push(series_i)
    }

    series_i++
  }

  let bad_sum = 0

  bad_ones.map((i) => {
    const row = series[i]
    const fixed = sort(row, order)
    const middle = get_middle(fixed)
    bad_sum += middle
  })

  return {
    good_len: good_ones.length,
    bad_len: bad_ones.length,
    good_ones,
    bad_ones,
    bad_sum,
  }
}
