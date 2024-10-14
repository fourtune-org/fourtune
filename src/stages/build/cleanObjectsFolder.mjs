import {mkdirp, clean} from "@anio-software/fs"
import path from "node:path"

export default async function(fourtune_session) {
	const objects_path = path.join(fourtune_session.project.root, "objects")

	await mkdirp(objects_path)
	await clean(objects_path)
}
