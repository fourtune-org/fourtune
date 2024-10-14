import {scandir} from "@anio-software/fs"
import path from "node:path"

export default async function(fourtune_session) {
	const project_root = fourtune_session.project.root

	const entries = await scandir(
		path.join(project_root, "build", "src"), {
			filter({type}) {
				return type === "file"
			}
		}
	)

	//
	// realm could invoke ts here to
	// create the definitions for all files requested
	//
	await fourtune_session.runTargetHooks("objects.pre", [entries])

	for (const entry of entries) {
		//console.log(entry)
	}

	await fourtune_session.runTargetHooks("objects.post", [entries])
}
