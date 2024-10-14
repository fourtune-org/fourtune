import {writeAtomicFile} from "@anio-software/fs"
import path from "node:path"

export default async function(fourtune_session) {
	const project_root = fourtune_session.project.root

	//
	// realm could invoke ts here to
	// create the definitions for all files requested
	//
	await fourtune_session.runTargetHooks("objects.pre")

	for (const {file_path, generateObject} of fourtune_session.objects_to_generate) {
		const destination_path = path.join(
			project_root, "objects", "src", file_path
		)

		await writeAtomicFile(
			destination_path, await generateObject()
		)
	}

	await fourtune_session.runTargetHooks("objects.post")
}
