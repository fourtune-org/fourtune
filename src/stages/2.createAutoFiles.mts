import path from "node:path"
import {writeAtomicFile} from "@anio-software/fs"

export default {
	id: "createAutoFiles",

	async stage(fourtune_session) {
		for (const entry of fourtune_session.files_to_autogenerate) {
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
	}
}
