import path from "node:path"
import {writeAtomicFile} from "@anio-software/fs"

export default async function(fourtune_session) {
	for (const {relative_path, generateDistributableFileContents} of fourtune_session.distributables) {
		const source_code = await generateDistributableFileContents()

		await writeAtomicFile(
			path.join(fourtune_session.project.root, relative_path), source_code, {
				create_parents: true
			}
		)
	}
}
