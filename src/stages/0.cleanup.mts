import path from "node:path"
import {remove} from "@aniojs/node-fs"
import {getBuildPath, getObjectsPath} from "../getPath.mts"
import type {Session} from "#~src/Session.d.mts"

export default {
	id: "cleanup",

	async stage(fourtune_session: Session) {
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
