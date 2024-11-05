import fs from "node:fs/promises"
import {isDirectorySync} from "@anio-software/fs"
import {ensureFourtuneInstalled} from "./ensureFourtuneInstalled.mjs"
import {ensureFourtuneConfigExists} from "./ensureFourtuneConfigExists.mjs"
import {loadFourtuneProjectConfig} from "./loadFourtuneProjectConfig.mjs"
import {validateProjectConfig} from "./validateProjectConfig.mjs"
import {normalizeConfig} from "./normalizeConfig.mjs"
import {ensureFourtuneRealmInstalled} from "./ensureFourtuneRealmInstalled.mjs"
import {loadCore} from "./loadCore.mjs"
import {loadRealm} from "./loadRealm.mjs"
import {createPublicInterfaceObject} from "./createPublicInterfaceObject.mjs"

export async function createFourtuneSession(
	project_root, /* cli options object */ {

	} = {}
) {
	if (!isDirectorySync(project_root)) {
		throw new Error(
			`The project root path "${project_root}" does not exist or is not a directory.`
		)
	}

	//
	// from here on use absolute path
	//
	const resolved_project_root = await fs.realpath(project_root)

	// todo: maybe move implementation into separate folder
	await ensureFourtuneInstalled(resolved_project_root)
	await ensureFourtuneConfigExists(resolved_project_root)

	let project_config = await loadFourtuneProjectConfig(
		resolved_project_root
	)

	await validateProjectConfig(project_config)
	project_config = await normalizeConfig(project_config)

	await ensureFourtuneRealmInstalled(
		resolved_project_root,
		project_config.realm
	)

	const session = {
		project: {
			root: resolved_project_root,
			config: project_config
		},

		raw_input: {
			source_files: null,
			assets: null
		},

		input: {
			source_files: null,
			assets: null
		},

		// flag to freeze
		// files_to_autogenerate,
		// objects_to_generate, and
		// products_to_generate, and
		// hooks
		is_frozen: false,

		files_to_autogenerate: [],
		objects_to_generate: [],
		products_to_generate: [],
		hooks: [],

		core: await loadCore(resolved_project_root),
		realm: await loadRealm(
			resolved_project_root, project_config.realm
		)
	}

	session.public_interface = createPublicInterfaceObject(
		session
	)

	for (const entry in project_config.autogenerate) {
		session.public_interface.autogenerate.addFile(
			entry, project_config.autogenerate[entry]
		)
	}

	return session
}
