import fs from "node:fs/promises"
import path from "node:path"
import {isDirectorySync, isFileSync} from "@anio-software/fs"
import {ensurePackageIsInstalled} from "./ensurePackageIsInstalled.mjs"
import {ensureFourtuneConfigExists} from "./ensureFourtuneConfigExists.mjs"
import {loadFourtuneProjectConfig} from "./loadFourtuneProjectConfig.mjs"
import {validateProjectConfig} from "./validateProjectConfig.mjs"
import {normalizeConfig} from "./normalizeConfig.mjs"
import {loadProjectPackage} from "./loadProjectPackage.mjs"
import {createPublicInterfaceObject} from "./createPublicInterfaceObject.mjs"

export async function createFourtuneSession(
	project_root, /* cli options object */ {

	} = {}
) {
	if (!isDirectorySync(project_root)) {
		throw new Error(
			`The project root path "${project_root}" does not exist or is not a directory.`
		)
	} else if (!isFileSync(path.join(project_root, "package.json"))) {
		throw new Error(
			`The project root path "${project_root}" doesn't contain a package.json file.`
		)
	}

	//
	// from here on use absolute path
	//
	const resolved_project_root = await fs.realpath(project_root)
	const project_package_json = JSON.parse(
		(
			await fs.readFile(path.join(resolved_project_root, "package.json"))
		)
	)

	// don't check for the package "fourtune" when
	// we are building fourtune itself
	// otherwise this check will fail
	if (project_package_json.name !== "fourtune") {
		await ensurePackageIsInstalled(resolved_project_root, "fourtune")
	}

	await ensurePackageIsInstalled(resolved_project_root, "@fourtune/core/v1")

	await ensureFourtuneConfigExists(resolved_project_root)

	let project_config = await loadFourtuneProjectConfig(
		resolved_project_root
	)

	await validateProjectConfig(project_config)
	project_config = await normalizeConfig(project_config)

	await ensurePackageIsInstalled(
		resolved_project_root, `@fourtune/realm-${project_config.realm}`
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

		core: {
			api: (await loadProjectPackage(
				resolved_project_root, "@fourtune/core/v1"
			)).default
		},

		realm: {
			integration: await loadProjectPackage(
				resolved_project_root,
				`@fourtune/realm-${project_config.realm}/integration`
			),

			dependencies: (await loadProjectPackage(
				resolved_project_root,
				`@fourtune/realm-${project_config.realm}/integration/dependencies`
			)).default
		}
	}

	session.public_interface = createPublicInterfaceObject(
		session
	)

	for (const entry in project_config.autogenerate) {
		session.public_interface.autogenerate.addUserFile(
			entry, project_config.autogenerate[entry]
		)
	}

	return session
}
