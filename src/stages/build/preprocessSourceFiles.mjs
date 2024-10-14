import {writeAtomicFile} from "@anio-software/fs"
import path from "node:path"
import fs from "node:fs/promises"

function defaultTransformSourceCode(relative_path, contents) {
	return null
}

export default async function(fourtune_session) {
	let preprocess = {}

	await fourtune_session.runTargetHooks("preprocess.pre")

	if (Array.isArray(fourtune_session.project.config.preprocess)) {
		preprocess.transformSourceCode = defaultTransformSourceCode

		preprocess.runCustomFunctions = fourtune_session.project.config.preprocess
	} else {
		if (typeof fourtune_session.project.config.preprocess === "object") {
			preprocess = fourtune_session.project.config.preprocess
		}

		if (!("transformSourceCode" in preprocess)) {
			preprocess.transformSourceCode = defaultTransformSourceCode
		}

		if (!("runCustomFunctions" in preprocess)) {
			preprocess.runCustomFunctions = []
		}
	}

	const source_files = fourtune_session.public_interface.getProjectSourceFiles()

	for (const {relative_path} of source_files) {
		const source_path = path.join(fourtune_session.project.root, "src", relative_path)
		const destination_path = path.join(fourtune_session.project.root, "build", "src", relative_path)

		const content = (await fs.readFile(source_path)).toString()
		let transformed_source_code = await preprocess.transformSourceCode(relative_path, content)

		if (transformed_source_code === null) {
			transformed_source_code = (await fs.readFile(
				source_path
			)).toString()
		}

		const transform_hooks = fourtune_session.target_hooks.filter(({id}) => id === "preprocess_file")

		for (const {fn} of transform_hooks) {
			transformed_source_code = await fn(
				fourtune_session.public_interface, relative_path, transformed_source_code
			)
		}

		await writeAtomicFile(destination_path, transformed_source_code)
	}

	for (const fn of preprocess.runCustomFunctions) {
		await fn()
	}

	await fourtune_session.runTargetHooks("preprocess.post")
}
