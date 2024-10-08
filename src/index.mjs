import createFourtuneSession from "./lib/init/createFourtuneSession.mjs"
import build_stages from "./stages/build/index.mjs"
import process from "node:process"
import initGenericProject from "./lib/initGenericProject.mjs"
import writeProjectInitFile from "./lib/writeProjectInitFile.mjs"

export default async function(project_root, command) {
	const saved_cwd = process.cwd()

	try {
		process.chdir(project_root)

		const fourtune_session = await createFourtuneSession(project_root)

		if ("preinit" in fourtune_session.project.config) {
			const {preinit} = fourtune_session.project.config

			if (!Array.isArray(preinit)) {
				throw new Error(
					`preinit must be an array of functions.`
				)
			}

			for (const fn of preinit) {
				await fn(
					fourtune_session.public_interface
				)
			}
		}

		await fourtune_session.initializeTarget()

		if (command === "build") {
			for (const stage of build_stages) {
				await stage(fourtune_session)
			}
		} else if (command === "init-project") {
			await initGenericProject(fourtune_session.public_interface)

			if ("initProject" in fourtune_session.target_integration) {
				const {initProject} = fourtune_session.target_integration

				await initProject(
					fourtune_session.public_interface,
					async (name, contents, {overwrite = false} = {}) => {
						return await writeProjectInitFile(
							fourtune_session.public_interface, {name, contents}, overwrite
						)
					}
				)
			}
		}

		for (const warning of fourtune_session.project.warnings) {
			console.log(warning.id, warning.message)
		}
	} finally {
		process.chdir(saved_cwd)
	}
}
