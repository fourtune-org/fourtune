import {mkdirp, clean} from "@anio-software/fs"
import path from "node:path"

export default async function(fourtune_session) {
	const build_path = path.join(fourtune_session.project.root, "build")

	await mkdirp(build_path)
	await clean(build_path)
}
