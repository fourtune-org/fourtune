import path from "node:path"
import {scandir, remove} from "@anio-software/fs"

import type {Session} from "#~src/Session.d.mts"

export default {
	id: "removeObsoleteAutoFiles",

	async stage(fourtune_session: Session) {

		const auto_files_entries = await scandir(
			path.join(
				fourtune_session.project.root, "auto"
			), {
				allow_missing_dir: true
			}
		)

		const obsolete_auto_files = auto_files_entries.filter(({type, relative_path}) => {
			if (type !== "file") return false

			for (const {file_path} of fourtune_session.files_to_autogenerate) {
				if (file_path === relative_path) return false
			}

			return true
		})

		const obsolete_auto_dirs = auto_files_entries.filter(({type, relative_path}) => {
			if (type !== "dir") return false

			for (const {file_path} of fourtune_session.files_to_autogenerate) {
				if (file_path.startsWith(`${relative_path}/`)) {
					return false
				}
			}

			return true
		})

		const items_to_be_removed = [
			...obsolete_auto_files,
			...obsolete_auto_dirs
		]

		for (const {relative_path, absolute_path} of items_to_be_removed) {
			await remove(absolute_path)

			console.log(`\\---> removed obsolete auto file/dir auto/${relative_path}`)
		}
	}
}
