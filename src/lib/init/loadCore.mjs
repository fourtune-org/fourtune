import path from "node:path"
import {createRequire} from "node:module"

export async function loadCore(project_root) {
	const require = createRequire(
		path.join(project_root, "index.js")
	)

	const package_name = `@fourtune/core`

	try {
		return await import(
			require.resolve(package_name)
		)
	} catch (error) {
		throw new Error(
			`Unable to import "${package_name}".\n` +
			`Error: ${error.message}.`
		)
	}
}
