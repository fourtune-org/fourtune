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

