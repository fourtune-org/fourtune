import path from "node:path"
import {getBuildPath, getObjectsPath} from "../../getPath.mjs"

function checkFrozen(
	fourtune_session, op
) {
	if (fourtune_session.is_frozen) {
		throw new Error(
			`Cannot do operation "${op}" because session is frozen.`
		)
	}
}

export function createPublicInterfaceObject(
	fourtune_session
) {
	return {
		// can be used by user
		user_data: {},

		getProjectRoot() {
			return fourtune_session.project.root
		},

		getProjectConfig() {
			return fourtune_session.project.config
		},

		emitWarning(id, meta) {
			process.stderr.write(
				`[warning] ${id} ${JSON.stringify(meta)}\n`
			)
		},

		emitError(id, meta) {
			process.stderr.write(
				`[error] ${id} ${JSON.stringify(meta)}\n`
			)
		},

		async getDependency(dependency_name) {
			const {dependency} = await fourtune_session.core.loadRealmDependency(
				fourtune_session.project.root, fourtune_session.project.config.realm, dependency_name
			)

			return dependency
		},

		hooks: {
			register(id, fn) {
				checkFrozen(fourtune_session, "hooks.register")

				fourtune_session.hooks.push({id, fn})
			}
		},

		input: {
			getSourceFiles() {
				return fourtune_session.input.source_files
			},

			getAssetFiles() {
				return fourtune_session.input.assets
			}
		},

		autogenerate: {
			addFourtuneFile(file_path, generator, generator_args = []) {
				checkFrozen(fourtune_session, "autogenerate.addFourtuneFile")

				fourtune_session.files_to_autogenerate.push({
					file_path: path.join("fourtune", path.normalize(file_path)),
					generator,
					generator_args
				})
			},

			addUserFile(file_path, generator, generator_args = []) {
				checkFrozen(fourtune_session, "autogenerate.addUserFile")

				fourtune_session.files_to_autogenerate.push({
					file_path: path.join("user", path.normalize(file_path)),
					generator,
					generator_args
				})
			}
		},

		objects: {
			addObject(file_path, generator, generator_args) {
				checkFrozen(fourtune_session, "objects.addObject")

				fourtune_session.objects_to_generate.push({
					file_path: path.normalize(file_path),
					generator,
					generator_args
				})
			}
		},

		products: {
			addProduct(
				product_name
			) {
				checkFrozen(fourtune_session, "products.addProduct")

				const product_ref = {
					product_name,
					distributables: []
				}

				fourtune_session.products_to_generate.push(product_ref)

				const product = {
					addDistributable(
						name, file_name, generator, generator_args = []
					) {
						product_ref.distributables.push({
							name,
							file_name,
							generator,
							generator_args
						})

						return product
					}
				}

				return product
			}
		},

		paths: {
			getBuildPath(...parts) {
				return getBuildPath("", ...parts)
			},

			getBuildPathFromProjectRoot(...parts) {
				return getBuildPath(fourtune_session.project.root, ...parts)
			},

			getObjectsPath(...parts) {
				return getObjectsPath("", ...parts)
			},

			getObjectsPathFromProjectRoot(...parts) {
				return getObjectsPath(fourtune_session.project.root, ...parts)
			}
		}
	}
}
