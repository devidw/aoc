const fs = require("fs/promises")

/** @type {{left_id: number, right_id: number, right_count: number, sim_score:
 * number}[]} */
const the_list = []

/** @type {number[]} */
const right_ids = []

async function debug() {
    await fs.writeFile("./debug.json", JSON.stringify({
        the_list,
        right_ids,
    }, null, 4))
}

async function main() {
    const raw = await fs.readFile("./input.txt")
    const str = raw.toString().trim()

    str.split("\n").forEach(line => {
        const [left_id, right_id] = line.split("   ")

        the_list.push({
            left_id: Number(left_id),
            right_count: 0,
            sim_score: 0,
        })

        right_ids.push(Number(right_id))
    })

    the_list.forEach((the_row) => {
        const right_count = right_ids.filter(right_id => {
            return right_id === the_row.left_id
        }).length

        if (right_count === 0) {
            return
        }

        the_row.right_count = right_count
        the_row.sim_score = the_row.left_id * right_count
    })

    let total_sim = 0

    the_list.forEach(row => {
        total_sim += row.sim_score
    })

    await debug()

    console.info({ total_sim })
}

main()
