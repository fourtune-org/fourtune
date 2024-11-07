import fs from "node:fs/promises"
import path from "node:path"
import _generateSyncAsyncVariantFromString from "./_generateAsyncSyncVariantFromString.mjs"

export default function(source_path, variant = "async") {
	return async function(fourtune_session) {
		const contents = await fs.readFile(
			path.join(
				fourtune_session.getProjectRoot(), source_path
			)
		)

		return _generateSyncAsyncVariantFromString(
			contents, variant
		)
	}
}
