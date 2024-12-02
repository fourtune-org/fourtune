export async function ensureRealmDependenciesAreInstalled(
	fourtune_session
) {
	const {installRealmDependencies} = fourtune_session.core.api

	await installRealmDependencies(
		fourtune_session.project.root,
		fourtune_session.project.config.realm,
		fourtune_session.realm.dependencies
	)
}
