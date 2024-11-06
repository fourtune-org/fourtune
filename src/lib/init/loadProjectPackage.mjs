import path from "node:path"
import {createRequire} from "node:module"

export async function loadProjectPackage(
	project_root, package_name
) {
	const require = createRequire(
		path.join(project_root, "index.js")
	)

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
