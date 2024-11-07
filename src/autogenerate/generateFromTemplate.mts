import path from "node:path"
import fs from "node:fs/promises"
import type {
	FourtuneSession,
	FourtuneAutogenerateGenerateFromTemplate as Impl
} from "@fourtune/types/fourtune/v0/"

const impl : Impl = function(
	source_path: string,
	items: {[search: string]: string}
) {
	return async function(fourtune_session: FourtuneSession) {
		let source = (await fs.readFile(
			path.join(fourtune_session.getProjectRoot(), source_path)
		)).toString()
		
		for (const search in items) {
			const replace = items[search]

			if (source.indexOf(search) === -1) {
				// todo: use correct warning
				fourtune_session.emitWarning(
					`generateFromTemplate.unused_template_key`, ``, {
						relative_path: source_path,
						key: search
					}
				)
			}

			source = source.split(search).join(replace)
		}

		return source
	}
}

export default impl
