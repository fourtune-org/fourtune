export const c = {

	// @fourtune/realm-js,     platform: js
	// @fourtune/realm-web     platform: web
	// @fourtune/realm-c       platform: linux, arduino

	//
	// list of possible realms:
	//
	realm: "js|web|c",

	type: "package|app|library|class",

	platform: ["linux",  "arduino"],

	//
	// run this before initializing
	// this is here to create files before fourtune
	// is analyzing the project structure
	//
	preinit: [

	],

	//
	// short hand for search and replace pre-processing,
	//
	build_constants: {
		"version": "v1.0.0"
	},

	//
	// autogenerate places all generated files in src/auto
	//
	autogenerate: [
		{create: "sync.mjs", from: generateFromTemplate("src/template.mjs", {})},
		{create: "async.mjs", from: generateFromTemplate("src/template.mjs", {})}
	],

	// or other way:
	autogenerate: {
		"sync.mjs": generateFromTemplate("src/template.mjs", {})
	},

	//
	//
	//
	preprocess: {
		processFileContent(relative_path, file_content) {
			return null // means just copy the file natively

			return /* return altered file_content, if you want */
		},

		runCustomFunctions: [
			/* run some function */
		]
	},

	//
	// 
	//
	postprocess: [

	]
}


config flavours:

	preprocess: [fn1(), fn2(), ...],

	// process src/ folder
	preprocess: {
		transformSourceCode(relative_path, contents) {
			return "new content"
		},

		runCustomFunctions: [fn1(), fn2()]
	}

	// process build/ folder
	postprocess: [fn1(), fn2(), ...]

	postprocess: {
		transformSourceCode(relative_path, contents) {

		},

		runCustomFunctions: [fn1(), fn2()]
	}




// steps

1.) run autogenerate
2.) run preprocessing? -> place preprocessed files in build/ 
3.) run build -> place built files in dist/
4.) run postprocessing




//----
import {defineTarget} from "@fourtune/realm-js"

//
//
//      src/auto/
//              export/
//                     different/
//                          something.mjs
//
//      src/export
//                /default/
//                        another.mjs
//                /different/
//                      something.mjs
//                      somethingElse.mjs
//                something.mjs

/*
	./dist/default/module.mjs
	./dist/default/module.min.mjs
	./dist/default/source.mjs
	./dist/default/source.min.mjs
	./dist/default/types.d.ts

	./dist/different/module.mjs
	./dist/different/module.min.mjs
	./dist/different/source.mjs
	./dist/different/source.min.mjs
	./dist/different/types.d.ts
*/

// merge src/auto/export AND src/export
// merge src/export/*.mjs AND src/export/default/

// prioritize src/auto/export OVER src/export

export default {
	project: {
		realm: "js",
		//type: "package"
	},

	target: defineTarget({
		entry: "./src/index.mjs"
	})

	/*
	target: {
		entries: [{
			name: "main",
			entry: "./src/index.mjs",
			types: "./src/index.d.ts",
			bundle: true
		}]
	}*/
}
