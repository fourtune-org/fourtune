import path from "node:path"

export default async function(fourtune_session) {
	await fourtune_session.target_integration.initializeTarget(
		fourtune_session.public_interface
	)

	fourtune_session.target_hooks_locked = true

	//
	// examine config.autogenerate and friends
	//
	if ("autogenerate" in fourtune_session.project.config) {
		let autogenerate = []

		if (!Array.isArray(fourtune_session.project.config.autogenerate)) {
			for (const file in fourtune_session.project.config.autogenerate) {
				autogenerate.push({
					create: file,
					from: fourtune_session.project.config.autogenerate[file]
				})
			}
		}

		for (const entry of autogenerate) {
			const relative_path = path.join("src", "auto", entry.create)
			const absolute_path = path.join(fourtune_session.project.root, relative_path)

			fourtune_session.files_to_autogenerate.push({
				relative_path,
				absolute_path ,
				async generateFileSourceCode() {
					return await entry.from(fourtune_session.public_interface)
				}
			})
		}
	}
}
