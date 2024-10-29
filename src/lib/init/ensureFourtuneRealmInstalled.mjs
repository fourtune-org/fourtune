import path from "node:path"
import {createRequire} from "node:module"

export async function ensureFourtuneRealmInstalled(
	project_root, realm
) {
	const require = createRequire(
		path.join(project_root, "index.js")
	)

	const package_name = `@fourtune/realm-${realm}`

	try {
		require.resolve(package_name)
	} catch {
		throw new Error(
			`Unable to locate "${package_name}" in the project root.\n` +
			`Make sure "${package_name}" is installed in the project root.`
		)
	}
}
