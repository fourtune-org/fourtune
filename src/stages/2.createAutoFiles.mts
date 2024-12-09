import path from "node:path"
import {writeAtomicFile} from "@aniojs/node-fs"

export default {
	id: "createAutoFiles",

	async stage(fourtune_session) {
		const auto_files = [
			...getAutoFilesOfType("fourtune"),
			...getAutoFilesOfType("synthetic:async.sync"),
			...getAutoFilesOfType("synthetic:user")
		]

		for (const entry of auto_files) {
			const source = await entry.generator(
				fourtune_session.public_interface,
				entry.file_path,
				entry.generator_args
			)

			await writeAtomicFile(
				path.join(
					fourtune_session.project.root,
					"auto", entry.file_path
				),
				source,
				{create_parents: true}
			)
		}

		function getAutoFilesOfType(type) {
			return fourtune_session.files_to_autogenerate.filter(e => {
				return e.type === type
			})
		}
	}
}
