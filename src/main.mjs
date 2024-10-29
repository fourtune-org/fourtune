import {stages} from "./stages/_index.mjs"
import {createFourtuneSession} from "./lib/init/createFourtuneSession.mjs"
import {initialize} from "./lib/session/initialize.mjs"
import {runHooks} from "./lib/session/runHooks.mjs"

export async function fourtune(project_root) {
	const session = await createFourtuneSession(process.argv[2])

	await initialize(session)

	process.chdir(project_root)

	for (const {id, stage} of stages) {
		console.log(id)

		await runHooks(session, `${id}.pre`)
		await stage(session)
		await runHooks(session, `${id}.post`)
	}
}
