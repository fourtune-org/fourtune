import createPublicInterface from "./createPublicInterface.mjs"
import loadFourtuneProjectConfiguration from "./loadFourtuneProjectConfiguration.mjs"
import loadTargetIntegration from "./loadTargetIntegration.mjs"
import initializeTarget from "./initializeTarget.mjs"

export default async function(project_root) {
	const project_config = await loadFourtuneProjectConfiguration(project_root)

	// await validateFourtuneProjectConfiguration()

	const target_integration = await loadTargetIntegration(project_root, project_config)

	let fourtune_session = {
		project: {
			root: project_root,
			config: project_config,
			warnings: []
		},

		source_files: [],

		files_to_autogenerate: [],
		distributables: [],

		target_integration,

		target_hooks: [],
		target_hooks_locked: false,

		async runTargetHooks(id, args = []) {
			const hooks = fourtune_session.target_hooks.filter(hook => {
				return hook.id === id
			})

			for (const hook of hooks) {
				await hook.fn(
					fourtune_session.public_interface, ...args
				)
			}
		},

		public_interface: {},

		async initializeTarget() {
			return await initializeTarget(fourtune_session)
		}
	}

	fourtune_session.public_interface = createPublicInterface(fourtune_session)

	return fourtune_session
}
