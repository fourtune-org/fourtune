import path from "node:path"
import {createRequire} from "node:module"

export async function loadRealm(
	project_root, realm
) {
	const require = createRequire(
		path.join(project_root, "index.js")
	)

	const package_name = `@fourtune/realm-${realm}/integration`

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
