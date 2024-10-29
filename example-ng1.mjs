import {defineTarget as jsTarget} from "@fourtune/realm-js"
import {defineTarget as cTarget} from "@fourtune/realm-c"

// ^-- support more than one realm simultaneously

export const c1 = [
	jsTarget(),
	cTarget()
]

// for things like /src/export and /auto/export scan use
// "presets":

import {
	defineJSPackageTarget
} from "@fourtune/realm-js/target/package"


/*

	target2/
			auto/
			src/
	target1/
			auto/
			src/

 */

export const c2 = [
	defineJSPackageTarget({
		type: "async/sync",

		root: ".",

		function_name: "scandir",

		autogenerate: {}
	})
]
//---v



/*
In fourtune you have:
A Project with multiple or one TARGET

A Target with multiple or one PRODUCT

A Product with multiple or one DISTRIBUTABLE


src/export/async/MyExport.mts
src/export/sync/MyExportSync.mts

to skip: --skip-distributable-type "types"
to skip: --skip-distributable-types "types,source"

to skip: --skip-product "async"
to skip: --skip-products "async,sync"

[to skip: --skip-targets "realm-js/target/package"]

target: realm-js/target/package

		product: async
			distributable types:
							bundle,
							bundle.min,
							source,
							source.min,
							types

			distributable: index.mjs
			distributable: index.min.mjs
			distributable: source.min.mjs
			distributable: index.d.mts

		product: sync
			distributable: index.mjs
			distributable: index.min.mjs
			distributable: source.min.mjs
			distributable: index.d.mts

*/

/*

	./dist/package/async/index.mjs


*/

import autogenerate from "fourtune"

// (inside realm impl):
import {autogenerate, target} from "fourtune/api"

export const c3 = [
	autogenerateSyncAsyncVariant(
		"export/ScandirOptions<X>Type.d.mts",
		"template/ScandirOptionsType.d.mts"
	),

	autogenerate("src/myFile", function() {
		return "contents of my file"
	}),

	conditionalTarget({
		condition() {

		},

		name: "package",

		products: []
	}),

	preprocessFile(),

	target({
		name: "package",

		products: [{
			name: "async",
			distributables: [{
			//	id: "bundle"
				file_name: "index.mjs",
				generate() {
					return "contents of index.mjs"
				}
			}]
		}]
	})
]

// ./dist/<product>/<distributable>

export default {
	realm: "js",
	type: "package:async/sync",

	target: {
		function_name: "scandir"
	},

	autogenerate: {
		"./src/": ""
	}
}


