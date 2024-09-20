import fs from "node:fs/promises"
import path from "node:path"

export default function(source, destination) {
	return async function(context) {
		const destination_path = path.join(context.root, destination)

		await fs.copyFile(
			path.join(context.root, source),
			`${destination_path}.tmp`
		)

		await fs.rename(`${destination_path}.tmp`, destination_path)
	}
}
