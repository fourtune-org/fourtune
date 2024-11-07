import _generateSyncAsyncVariantFromString from "./_generateAsyncSyncVariantFromString.mjs"

export default function(source, variant = "async") {
	return async function(fourtune_session) {
		return _generateSyncAsyncVariantFromString(
			source, variant
		)
	}
}
