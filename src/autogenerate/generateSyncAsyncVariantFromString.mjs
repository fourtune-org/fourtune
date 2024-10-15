import _generateSyncAsyncVariantFromString from "./_generateSyncAsyncVariantFromString.mjs"

export default function(source, variant = "async") {
	return async function(fourtune_session) {
		return _generateSyncAsyncVariantFromString(
			source, variant
		)
	}
}
