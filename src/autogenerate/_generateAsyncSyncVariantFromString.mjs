export default function(source, variant = "async") {
	const lines = source.toString().split("\n")

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
