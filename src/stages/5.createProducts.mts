import path from "node:path"
import {writeAtomicFile} from "@aniojs/node-fs"

export default {
	id: "createProducts",

	async stage(fourtune_session) {
		for (const {product_name, distributables} of fourtune_session.products_to_generate) {
			console.log("> " + product_name)

			for (const distributable of distributables) {
				const base_path = path.join(
					fourtune_session.project.root, "dist", product_name
				)

				const source = await distributable.generator(
					fourtune_session.public_interface
				)

				if (Array.isArray(distributable.file_name)) {
					if (!Array.isArray(source)) {
						throw new Error(
							`You must return an array from this generator (each element for every file to be written).`
						)
					}

					if (distributable.file_name.length !== source.length) {
						throw new Error(
							`generator must return the same number of elements as files.`
						)
					}

					for (let i = 0; i < distributable.file_name.length; ++i) {
						await writeAtomicFile(
							path.join(base_path, distributable.file_name[i]),
							source[i],
							{create_parents: true}
						)
					}
				} else {
					await writeAtomicFile(
						path.join(base_path, distributable.file_name),
						source,
						{create_parents: true}
					)
				}
			}
		}
	}
}
