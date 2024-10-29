import path from "node:path"
import {createRequire} from "node:module"

export async function ensureFourtuneInstalled(project_root) {
	const require = createRequire(
		path.join(project_root, "index.js")
	)

	try {
		require.resolve("fourtune")
	} catch {
		throw new Error(
			`Unable to locate "fourtune" in the project root.\n` +
			`Make sure "fourtune" is installed in the project root.`
		)
	}
}
