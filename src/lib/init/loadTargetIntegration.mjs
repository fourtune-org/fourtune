import {createRequire} from "node:module"
import path from "node:path"

export default async function(project_root, project_config) {
	const project_require = createRequire(path.join(project_root, "index.js"))
	const resolve = (module) => {
		try {
			return project_require.resolve(module)
		} catch {
			return false
		}
	}

	// make sure resolve("fourtune") !== false

	const integration = resolve(`@fourtune/realm-${project_config.realm}/integration`)

	return await import(integration)
}
