import {scandir, writeAtomicFile} from "@anio-software/fs"
import path from "node:path"
import fs from "node:fs/promises"

function defaultTransformSourceCode(relative_path, contents) {
	return null
}

export default async function(fourtune_session) {
	let preprocess = {}

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

	//
	// scan src/ for files place them inside build/
	//
	const source_files = await scandir(
		path.join(fourtune_session.project.root, "src"), {
			filter({type}) {
				return type === "file"
			}
		}
	)

	for (const {relative_path} of source_files) {
		const source_path = path.join(fourtune_session.project.root, "src", relative_path)
		const destination_path = path.join(fourtune_session.project.root, "build", "src", relative_path)

		const content = (await fs.readFile(source_path)).toString()
		const transformed_source_code = await preprocess.transformSourceCode(relative_path, content)

		//
		// 'null' means copy the file and do not process the file
		//
		if (transformed_source_code === null) {
			await fs.copyFile(source_path, destination_path)
		} else {
			await writeAtomicFile(destination_path, transformed_source_code)
		}
	}

	for (const fn of preprocess.runCustomFunctions) {
		await fn()
	}
}
