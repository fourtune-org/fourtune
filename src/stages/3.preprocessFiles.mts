import path from "node:path"
import {mkdirp, writeAtomicFile} from "@anio-software/fs"
import type {ScandirEntry} from "@anio-software/fs"
import fs from "node:fs/promises"
import {getBuildPath} from "../getPath.mjs"
import type {Session} from "#~src/Session.d.mts"

function canPreprocess(file_path: string) {
	if (file_path.endsWith(".d.mts")) {
		return true
	} else if (file_path.endsWith(".mts")) {
		return true
	} else if (file_path.endsWith(".html")) {
		return true
	} else if (file_path.endsWith(".mjs")) {
		return true
	} else if (file_path.endsWith(".txt")) {
		return true
	} else if (file_path.endsWith(".c")) {
		return true
	} else if (file_path.endsWith(".js")) {
		return true
	} else if (file_path.endsWith(".css")) {
		return true
	} else if (file_path.endsWith(".styl")) {
		return true
	} else if (file_path.endsWith(".vue")) {
		return true
	}

	return false
}

async function processFile(
	fourtune_session: Session,
	src: string,
	dest: string
) {
	let source : Buffer|string = await fs.readFile(src)

	if (canPreprocess(src)) {
		source = source.toString()

		// todo: do preprocessing
	}

	await writeAtomicFile(
		dest,
		source,
		{create_parents: true}
	)
}

async function processInputFiles(
	fourtune_session: Session,
	build_base: string,
	files: ScandirEntry[],
	dest: string
) {
	for (const entry of files) {
		if (entry.type !== "file") continue

		await processFile(
			fourtune_session,
			entry.absolute_path,
			path.join(build_base, dest, entry.relative_path)
		)
	}
}

export default {
	id: "preprocessFiles",

	async stage(fourtune_session: Session) {
		const build_base = getBuildPath(fourtune_session.project.root)

		await mkdirp(build_base)
		await mkdirp(path.join(build_base, "src"))
		await mkdirp(path.join(build_base, "assets"))
		await mkdirp(path.join(build_base, "auto"))

		await processInputFiles(
			fourtune_session,
			build_base,
			fourtune_session.raw_input.source_files,
			"src"
		)

		await processInputFiles(
			fourtune_session,
			build_base,
			fourtune_session.raw_input.assets,
			"assets"
		)

		for (const entry of fourtune_session.files_to_autogenerate) {
			await processFile(
				fourtune_session,
				path.join(
					fourtune_session.project.root,
					"auto", entry.file_path
				),
				path.join(build_base, "auto", entry.file_path)
			)
		}
	}
}
