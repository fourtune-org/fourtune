import {stages} from "./stages/_index.mjs"
import {createFourtuneSession} from "./lib/init/createFourtuneSession.mjs"
import {initialize} from "./lib/session/initialize.mjs"
import {runHooks} from "./lib/session/runHooks.mjs"
import writeProjectInitFile from "./lib/writeProjectInitFile.mjs"
import {initProject} from "./lib/initProject.mjs"
import {createRequire} from "node:module"
import path from "node:path"

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
		const require = createRequire(
			path.join(session.project.root, "index.js")
		)

		const dependencies = require.resolve(`@fourtune/realm-${session.project.config.realm}/integration/dependencies`)
		const {installRealmDependencies} = session.core.default

		await installRealmDependencies(
			session.project.root, session.project.config.realm, (
				await import(dependencies)
			).default, {
				force: true
			}
		)

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
	}
}
