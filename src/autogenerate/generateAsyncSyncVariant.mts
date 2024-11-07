import fs from "node:fs/promises"
import path from "node:path"
import _generateSyncAsyncVariantFromString from "./_generateAsyncSyncVariantFromString.mjs"
import type {
	FourtuneSession,
	FourtuneAutogenerateGenerateAsyncSyncVariant as Impl
} from "@fourtune/types/fourtune/v0/"

const impl : Impl = function(source_path: string, variant = "async") {
	return async function(fourtune_session: FourtuneSession) {
		const contents = await fs.readFile(
			path.join(
				fourtune_session.getProjectRoot(), source_path
			)
		)

		return _generateSyncAsyncVariantFromString(
			contents.toString(), variant
		)
	}
}

export default impl
