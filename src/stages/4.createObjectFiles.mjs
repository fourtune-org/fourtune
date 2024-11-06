import {writeAtomicFile} from "@anio-software/fs"
import {getObjectsPath} from "../getPath.mjs"

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
				getObjectsPath(
					fourtune_session.project.root,
					entry.file_path
				),
				object,
				{create_parents: true}
			)
		}
	}
}
