import {
	writeAtomicFile,
	isFileSync
} from "@anio-software/fs"
import path from "node:path"

export default async function(
	fourtune_session, file, overwrite = false
) {
	const {name, contents} = file
	const absolute_path = path.join(fourtune_session.getProjectRoot(), name)

	let do_write = isFileSync(absolute_path) ? overwrite : true

	if (do_write) {
		await writeAtomicFile(
			absolute_path, contents, {
				create_parents: true
			}
		)
	} else {
		fourtune_session.emitWarning(
			`overwrite`, `Not overwriting already present file "${name}".`
		)
	}
}
