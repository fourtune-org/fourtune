import path from "node:path"
import {writeAtomicFile} from "@anio-software/fs"

export default {
	id: "createObjectFiles",

	async stage(fourtune_session) {
		for (const entry of fourtune_session.objects_to_generate) {
			const object = await entry.generator(
				fourtune_session.public_interface,
				entry.file_path,
				entry.generator_args
			)

			await writeAtomicFile(
				path.join(
					fourtune_session.project.root,
					".fourtune",
					"v0",
					"objects",
					entry.file_path
				),
				object,
				{create_parents: true}
			)
		}
	}
}
