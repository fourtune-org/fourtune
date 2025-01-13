export async function runHooks(
	fourtune_session, hook_id
) {
	console.log(`Running hook ${hook_id}`)

	if ("runHook" in fourtune_session.realm.integration) {
		const {runHook} = fourtune_session.realm.integration

		await runHook(
			fourtune_session.public_interface,
			hook_id
		)
	}
}
