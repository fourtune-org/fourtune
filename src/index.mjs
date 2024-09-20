import createFourtuneSession from "./lib/init/createFourtuneSession.mjs"
import stages from "./stages/index.mjs"

export default async function(project_root) {
	const fourtune_session = await createFourtuneSession(project_root)

	await fourtune_session.initializeTarget()

	for (const stage of stages) {
		await stage(fourtune_session)
	}

	for (const warning of fourtune_session.project.warnings) {
		console.log(warning.id, warning.message)
	}
}
