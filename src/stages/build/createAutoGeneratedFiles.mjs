import path from "node:path"
import {writeAtomicFile} from "@anio-software/fs"

export default async function(fourtune_session) {
	for (const {relative_path, generateFileSourceCode} of fourtune_session.files_to_autogenerate) {
		const source_code = await generateFileSourceCode()

		await writeAtomicFile(
			path.join(fourtune_session.project.root, relative_path), source_code, {
				create_parents: true
			}
		)
	}
}
