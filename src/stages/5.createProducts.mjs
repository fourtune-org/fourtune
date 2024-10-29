import path from "node:path"
import {writeAtomicFile} from "@anio-software/fs"

export default {
	id: "createProducts",

	async stage(fourtune_session) {
		for (const {product_name, distributables} of fourtune_session.products_to_generate) {
			console.log("> " + product_name)

			for (const distributable of distributables) {
				const source = await distributable.generator(
					fourtune_session.public_interface
				)

				await writeAtomicFile(
					path.join(
						fourtune_session.project.root, "dist",
						product_name, distributable.file_name
					), source, {create_parents: true}
				)
			}
		}
	}
}
