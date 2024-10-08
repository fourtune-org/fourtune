import {writeAtomicFile} from "@anio-software/fs"
import path from "node:path"

const files = [
	{
		name: ".editorconfig", contents:
`[*]
indent_style = tab
indent_size = 4\n`
	},

	{
		name: ".github/CODEOWNERS", contents:
`*       @dasdeo
*       @eXory2024\n`
	}
]

export default async function(fourtune_session) {
	for (const {name, contents} of files) {
		await writeAtomicFile(
			path.join(fourtune_session.getProjectRoot(), name), contents
		)
	}
}
