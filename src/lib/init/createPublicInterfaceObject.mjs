import path from "node:path"
import base_realm from "../base-realm/index.mjs"

function checkFrozen(
	fourtune_session, op
) {
	if (fourtune_session.is_frozen) {
		throw new Error(
			`Cannot do operation "${op}" because session is frozen.`
		)
	}
}

import {
	generateFromTemplate,
	generateAsyncSyncVariant,
	generateAsyncSyncVariantFromString
} from "../../autogenerate/index.mjs"

export function createPublicInterfaceObject(
	fourtune_session
) {
	const autogenerate_functions = {
		generateFromTemplate,
		generateAsyncSyncVariant,
		generateAsyncSyncVariantFromString
	}

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

		async getDependency(...args) {
			const {getDependency} = await base_realm.loadRealmDependencies(
				fourtune_session.project.root, `realm-${fourtune_session.project.config.realm}`
			)

			return getDependency(...args)
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
			...autogenerate_functions,
			addFile(file_path, generator, generator_args = []) {
				checkFrozen(fourtune_session, "autogenerate.addFile")

				fourtune_session.files_to_autogenerate.push({
					file_path: path.normalize(file_path),
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
		}
	}
}
