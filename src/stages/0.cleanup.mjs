import path from "node:path"
import {remove} from "@anio-software/fs"
import {getBuildPath, getObjectsPath} from "../getPath.mjs"

export default {
	id: "cleanup",

	async stage(fourtune_session) {
		await remove(
			path.join(
				fourtune_session.project.root,
				"dist"
			)
		)

		await remove(getObjectsPath(fourtune_session.project.root))
		await remove(getBuildPath(fourtune_session.project.root))
	}
}
