import _generateSyncAsyncVariantFromString from "./_generateAsyncSyncVariantFromString.mjs"
import type {
	FourtuneSession,
	FourtuneAutogenerateGenerateAsyncSyncVariantFromString as Impl
} from "@fourtune/types/fourtune/v0/"

const impl : Impl = function(source: string, variant = "async") {
	return async function(fourtune_session: FourtuneSession) {
		return _generateSyncAsyncVariantFromString(
			source, variant
		)
	}
}

export default impl
