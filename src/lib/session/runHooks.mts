export async function runHooks(
	fourtune_session, hook_id
) {
	for (const hook of fourtune_session.hooks) {
		if (hook.id === hook_id) {
			await hook.fn(fourtune_session.public_interface)
		}
	}
}
