import path from "node:path"
import {writeAtomicFile} from "@anio-software/fs"

export default async function(fourtune_session) {
	await fourtune_session.runTargetHooks("ephemerals.pre")

	for (const entry of fourtune_session.ephemerals) {
		const ephemerals = Array.isArray(entry) ? entry : [entry]

		for (const ephemeral of ephemerals) {
			const {name, generator} = ephemeral
			let generator_args = []

			if ("generator_args" in ephemeral) {
				generator_args = ephemeral.generator_args
			}

			const source_code = await generator(
				fourtune_session.public_interface,
				...generator_args
			)

			await writeAtomicFile(
				path.join(fourtune_session.project.root, "objects", "ephemerals", name), source_code, {
					create_parents: true
				}
			)
		}
	}

	await fourtune_session.runTargetHooks("ephemerals.post")
}
