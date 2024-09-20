import fs from "node:fs/promises"
import path from "node:path"

export default function(source, items, destination) {
	return async function(context) {
		let source_code = (await fs.readFile(
			path.join(context.root, source)
		)).toString()

		for (const search in items) {
			const replace = items[search]

			source_code = source_code.split(search).join(replace)
		}

		const destination_path = path.join(context.root, destination)

		await fs.writeFile(`${destination_path}.tmp`, source_code)
		await fs.rename(`${destination_path}.tmp`, destination_path)
	}
}
