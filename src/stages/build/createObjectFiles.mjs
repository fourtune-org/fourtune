import path from "node:path"

export default async function(fourtune_session) {
	const project_root = fourtune_session.project.root

	//
	// realm could invoke ts here to
	// create the definitions for all files requested
	//
	await fourtune_session.runTargetHooks("objects.pre")

	for (const entry of fourtune_session.objects_to_generate) {
		console.log(entry)
	}

	await fourtune_session.runTargetHooks("objects.post")
}
