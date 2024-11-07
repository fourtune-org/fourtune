import path from "node:path"
import {createRequire} from "node:module"

export async function ensurePackageIsInstalled(
	project_root, package_name
) {
	const require = createRequire(
		path.join(project_root, "index.js")
	)

	try {
		require.resolve(package_name)
	} catch (error) {
		throw new Error(
			`Unable to locate "${package_name}" in the project root.\n` +
			`Make sure "${package_name}" is installed in the project root.\n` +
			`Error: ${error.message}.`
		)
	}
}
