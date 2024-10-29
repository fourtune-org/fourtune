import path from "node:path"
import {remove} from "@anio-software/fs"

export default {
	id: "cleanup",

	async stage(fourtune_session) {
		await remove(
			path.join(
				fourtune_session.project.root,
				"dist"
			)
		)

		await remove(
			path.join(
				fourtune_session.project.root,
				".fourtune",
				"v0",
				"objects"
			)
		)

		await remove(
			path.join(
				fourtune_session.project.root,
				".fourtune",
				"v0",
				"build"
			)
		)
	}
}
