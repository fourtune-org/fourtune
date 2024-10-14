import {scandir, mkdirp} from "@anio-software/fs"
import path from "node:path"

export default async function(fourtune_session) {
	let entries = await scandir(
		path.join(fourtune_session.project.root, "src"), {
			filter({type}) {
				return type === "dir"
			}
		}
	)

	for (const {relative_path} of entries) {
		const target_path1 = path.join(fourtune_session.project.root, "build", "src", relative_path)
		const target_path2 = path.join(fourtune_session.project.root, "objects", "src", relative_path)

		await mkdirp(target_path1)
		await mkdirp(target_path2)
	}
}
