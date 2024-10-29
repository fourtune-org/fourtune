import path from "node:path"

export async function loadFourtuneProjectConfig(
	project_root
) {
	try {
		return (await import(
			path.join(project_root, "fourtune.config.mjs")
		)).default
	} catch {
		throw new Error(
			`Unable to import "fourtune.config.mjs" at the project root "${project_root}".`
		)
	}
}
