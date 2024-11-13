import path from "node:path"
import {scandir} from "@anio-software/fs"
import {ensureRealmDependenciesAreInstalled} from "./ensureRealmDependenciesAreInstalled.mjs"

function files(source, entries) {
	const files = entries.filter(({type}) => type === "file")

	return files.map(entry => {
		return {
			parents: entry.parents,
			name: entry.name,
			relative_path: entry.relative_path,
			// source means relative path (from project root)
			// to file
			source: path.join(
				path.normalize(`${source}/`), entry.relative_path
			)
		}
	})
}

function parents(file_path) {
	const parents = path.dirname(file_path).split(path.sep)

	if (parents.length === 1 && parents[0] === ".") {
		return []
	}

	return parents
}

function synthetic(
	list, dir
) {
	dir = path.normalize(`${dir}/`)

	return list.filter(entry => {
		return entry.file_path.startsWith(dir)
	}).map(entry => {
		const relative_path = entry.file_path.slice(dir.length)

		return {
			parents: parents(relative_path),
			name: path.basename(entry.file_path),
			relative_path,
			// source means relative path (from project root)
			// to file
			source: path.join(
				"auto", dir, relative_path
			),
			synthetic: true
		}
	})
}

export async function initialize(
	fourtune_session
) {
	await ensureRealmDependenciesAreInstalled(fourtune_session)

	fourtune_session.raw_input.assets = await scandir(
		path.join(fourtune_session.project.root, "assets"), {
			allow_missing_dir: true
		}
	)

	fourtune_session.raw_input.source_files = await scandir(
		path.join(fourtune_session.project.root, "src")
	)

	const assets = files("assets", fourtune_session.raw_input.assets)
	const source_files = files("src", fourtune_session.raw_input.source_files)

	const hook_args = [
		fourtune_session.public_interface,
		fourtune_session.project.config.target
	]

	const {integration} = fourtune_session.realm

	if ("preInitialize" in integration) {
		await integration.preInitialize(...hook_args, assets, source_files)
	}

	//
	// add synthetic auto files to "assets" and "source_files" array
	//
	fourtune_session.input.assets = [
		...synthetic(
			fourtune_session.files_to_autogenerate,
			"assets/"
		),
		...assets
	]

	fourtune_session.input.source_files = [
		...synthetic(
			fourtune_session.files_to_autogenerate,
			"fourtune/src"
		),
		...synthetic(
			fourtune_session.files_to_autogenerate,
			"user/src"
		),
		...source_files
	]

	await integration.initialize(
		...hook_args,
		fourtune_session.input.assets,
		fourtune_session.input.source_files
	)

	fourtune_session.is_frozen = true
}
