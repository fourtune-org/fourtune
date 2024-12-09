import {stages} from "./stages/_index.mts"
import {createFourtuneSession} from "./lib/init/createFourtuneSession.mts"
import {initialize} from "./lib/session/initialize.mts"
import {runHooks} from "./lib/session/runHooks.mts"
import writeProjectInitFile from "./lib/writeProjectInitFile.mts"
import {initProject} from "./lib/initProject.mts"

import removeObsoleteAutoFiles from "./stages/1.removeObsoleteAutoFiles.mts"
import createAutoFiles from "./stages/2.createAutoFiles.mts"

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

			await runHooks(session, `${id}.pre`)
			await stage(session)
			await runHooks(session, `${id}.post`)
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
