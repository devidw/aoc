const fs = require("fs/promises")

const left_list = []
const right_list = []
const diff_list = []

function sort_asc(a, b) {
    return a - b
}

async function debug() {
    await fs.writeFile("./debug.json", JSON.stringify({
        left_list,
        right_list,
        diff_list,
    }, null, 4))
}

async function main() {

    const raw = await fs.readFile("./input.txt")
    const str = raw.toString().trim()

    str.split("\n").forEach(line => {
        const [left_id, right_id] = line.split("   ")
        left_list.push(Number(left_id))
        right_list.push(Number(right_id))
    })

    left_list.sort(sort_asc)
    right_list.sort(sort_asc)

    left_list.forEach((left_id, index) => {
        const right_id = right_list[index]

        const tmp = [left_id, right_id].sort(sort_asc)

        const diff = tmp[1] - tmp[0]

        diff_list.push(diff)
    })

    const total_diff = diff_list.reduce((prev, curr) => {
        return prev + curr
    })

    await debug()

    console.info({ total_diff })
}

main()
