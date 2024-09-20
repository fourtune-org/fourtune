import path from "node:path"
import fs from "node:fs/promises"

export default function(source_path, items) {
	return async function(fourtune_session) {
		let source = (await fs.readFile(
			path.join(fourtune_session.getProjectRoot(), source_path)
		)).toString()
		
		for (const search in items) {
			const replace = items[search]

			source = source.split(search).join(replace)
		}

		return source
	}
}
