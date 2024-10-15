import path from "node:path"

import {
	generateFromTemplate,
	generateSyncAsyncVariant,
	generateSyncAsyncVariantFromString
} from "../../autogenerate/index.mjs"

import getFilesToBeAutoGeneratedAsSyntheticScandirResult from "../getFilesToBeAutoGeneratedAsSyntheticScandirResult.mjs"

export default function(fourtune_session) {
	let public_interface = {
		user_data: {},

		getProjectRoot() {
			return fourtune_session.project.root
		},

		getProjectConfig() {
			return fourtune_session.project.config
		},

		getProjectSourceFiles() {
			return [
				...getFilesToBeAutoGeneratedAsSyntheticScandirResult(fourtune_session),
				...fourtune_session.source_files
			]
		},

		addWarning(id, message) {
			fourtune_session.project.warnings.push({id, message})
		},

		emitError(id, message) {
			process.stderr.write(`!!! [fourtune] ${id} ${message}\n`)
		},

		autogenerate: {
			warningComment() {
				return `// Warning: this file was automatically created by fourtune vXXXXX
// You will find more information about the specific fourtune version used inside the file src/auto/VERSION.txt
// You should commit this file to source control\n`
			},

			generateFromTemplate,
			generateSyncAsyncVariant,
			generateSyncAsyncVariantFromString
		},

		objects: {},

		distributables: {},

		//
		// used to hook into fourtune
		//
		hooks: {
			register(id, fn) {
				if (fourtune_session.target_hooks_locked) {
					throw new Error(
						`Cannot add hooks after target initialisation!`
					)
				}

				fourtune_session.target_hooks.push({id, fn})
			}
		},

		//
		// used for targets to set target specific data
		//
		target: {
			data: {}
		}
	}

	//
	// files that are added via this interace will be created in
	// "src/auto" folder. This is using the same internal API as the
	// "autogenerate" fourtune.config.mjs API.
	//
	// NB: functions that are used to generate autogenerated files
	// always return the source code as a string
	//
	public_interface.autogenerate.addFile = function addAutogeneratedFile(
		file_path, {generator, generator_args}
	) {
		fourtune_session.files_to_autogenerate.push({
			file_path,
			async generateFileSourceCode() {
				return await generator(public_interface, file_path, ...generator_args)
			}
		})
	}

	public_interface.objects.add = function addObject(
		file_path, {generator, generator_args}
	) {
		fourtune_session.objects_to_generate.push({
			file_path,
			async generateObject() {
				return await generator(public_interface, file_path, ...generator_args)
			}
		})
	}

	//
	//
	//
	public_interface.distributables.addFile = function addDistributionFile(
		file_path, {generator, generator_args}
	) {
		const relative_path = path.join("dist", file_path)
		const absolute_path = path.join(fourtune_session.project.root, relative_path)

		fourtune_session.distributables.push({
			relative_path,
			absolute_path,
			async generateDistributableFileContents() {
				return await generator(public_interface, file_path, ...generator_args)
			}
		})
	}

	return public_interface
}
