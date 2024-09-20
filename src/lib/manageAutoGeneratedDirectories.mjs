import path from "node:path"
import {scandir, isRegularDirectorySync} from "@anio-software/fs"
import fs from "node:fs/promises"
import determineFilesToBeRemoved from "./determineFilesToBeRemoved.mjs"

function determineDirectoriesManagedByFourtune(files_managed_by_fourtune) {
	let directories = new Map()

	for (const file of files_managed_by_fourtune) {
		const dirname = path.dirname(file)

		directories.set(dirname, 1)
	}

	return [...directories].map(([key, value]) => key)
}

function arrayToMap(array) {
	let map = new Map()

	for (const item of array) {
		map.set(item, 1)
	}

	return map
}

export default async function(ctx) {
	//
	// determine which files are managed by fourtune
	// so we can scrub those files and prune
	// the directories of obsolete files
	//
	const files_managed_by_fourtune = [
		...ctx.files_to_autogenerate.map(file => file.relative_path),
		...ctx.files_to_build.map(file => file.relative_path)
	]

	const directories_managed_by_fourtune = determineDirectoriesManagedByFourtune(files_managed_by_fourtune)

	//
	// place all files/folders that are on disk in this map
	// so we can later compare this array to files_managed_by_fourtune
	//
	let actual_entries_on_disk = new Map()

	//
	// make sure directories_managed_by_fourtune are all directories
	//
	for (const dir of directories_managed_by_fourtune) {
		const absolute_dir_path = path.join(ctx.root, dir)

		if (!isRegularDirectorySync(absolute_dir_path)) {
			//throw new Error(`Expected ${dir} to be a directory.`)
			await fs.mkdir(absolute_dir_path, {
				recursive: true
			})
		}

		const entries = await scandir(absolute_dir_path)

		for (const entry of entries) {
			actual_entries_on_disk.set(path.join(dir, entry.relative_path), 1)
		}
	}

	actual_entries_on_disk = [...actual_entries_on_disk].map(([key, value]) => key)

	return await determineFilesToBeRemoved(ctx, {
		directories_managed_by_fourtune,
		files_managed_by_fourtune: arrayToMap(files_managed_by_fourtune),
		actual_entries_on_disk
	})
}
