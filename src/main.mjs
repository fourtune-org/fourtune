import {stages} from "./stages/_index.mjs"
import {createFourtuneSession} from "./lib/init/createFourtuneSession.mjs"
import {initialize} from "./lib/session/initialize.mjs"
import {runHooks} from "./lib/session/runHooks.mjs"
import writeProjectInitFile from "./lib/writeProjectInitFile.mjs"
import {initProject} from "./lib/initProject.mjs"

import removeObsoleteAutoFiles from "./stages/1.removeObsoleteAutoFiles.mjs"
import createAutoFiles from "./stages/2.createAutoFiles.mjs"

export async function fourtune(
	project_root, {
		initialize_project = false
	} = {}
) {
	const session = await createFourtuneSession(process.argv[2])

	await initialize(session)

	process.chdir(project_root)

	if (!initialize_project) {
		for (const {id, stage} of stages) {
			console.log(id)

			await runHooks(session, `pre-${id}`)
			await stage(session)
			await runHooks(session, `post-${id}`)
		}
	} else {
		await initProject(session.public_interface)

		if ("initializeProject" in session.realm.integration) {
			const {integration} = session.realm

			await integration.initializeProject(
				session.public_interface, async (name, contents, {overwrite = false} = {}) => {
					return await writeProjectInitFile(
						session.public_interface, {name, contents}, overwrite
					)
				}
			)
		}

		// todo: should invoke hook?
		await removeObsoleteAutoFiles.stage(session)
		await createAutoFiles.stage(session)
	}
}
