import fs from "node:fs/promises"
import path from "node:path"

export default function(source_path, variant = "async") {
	return async function(fourtune_session) {
		const contents = await fs.readFile(
			path.join(
				fourtune_session.getProjectRoot(), source_path
			)
		)

		const lines = contents.toString().split("\n")

		let output = []

		for (let i = 0; i < lines.length; ++i) {
			const line = lines[i]
			const next_line = (lines.length > (i + 1)) ? lines[i + 1] : null

			if (next_line === null) {
				output.push(line)

				continue
			}

			if (!line.startsWith("//") && next_line.startsWith("//")) {
				output.push(
					variant === "sync" ? next_line.slice(2) : line
				)
				++i

				continue
			}

			output.push(line)
		}

		return output.join("\n")
	}
}
