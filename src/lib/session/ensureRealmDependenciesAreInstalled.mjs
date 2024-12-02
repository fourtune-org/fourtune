export async function ensureRealmDependenciesAreInstalled(
	fourtune_session
) {
	const {installRealmDependencies, loadRealmDependency} = fourtune_session.core.api

	await installRealmDependencies(
		fourtune_session.project.root,
		fourtune_session.project.config.realm,
		fourtune_session.realm.dependencies
	)

	for (const dependency_name in fourtune_session.realm.dependencies.dependencies) {
		fourtune_session.realm.loaded_dependencies.set(
			dependency_name, await loadRealmDependency(
				fourtune_session.project.root,
				fourtune_session.project.config.realm,
				dependency_name
			)
		)
	}
}
