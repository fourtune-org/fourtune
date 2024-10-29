import path from "node:path"
import {isFileSync} from "@anio-software/fs"

export async function ensureFourtuneConfigExists(project_root) {
	if (!isFileSync(path.join(project_root, "fourtune.config.mjs"))) {
		throw new Error(
			`fourtune.config.mjs at the project root "${project_root}" does not exist or is not a file.`
		)
	}
}
