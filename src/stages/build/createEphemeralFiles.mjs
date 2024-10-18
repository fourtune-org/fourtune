import path from "node:path"
import {writeAtomicFile} from "@anio-software/fs"

export default async function(fourtune_session) {
	await fourtune_session.runTargetHooks("ephemerals.pre")

	for (const {name, generator, generator_args} of fourtune_session.ephemerals) {
		const source_code = await generator(...generator_args)

		await writeAtomicFile(
			path.join(fourtune_session.project.root, "objects", "ephemerals", name), source_code, {
				create_parents: true
			}
		)
	}

	await fourtune_session.runTargetHooks("ephemerals.post")
}
