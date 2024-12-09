import writeProjectInitFile from "./writeProjectInitFile.mjs"

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
	},

	{
		name: "LICENSE", contents:
`MIT License

Copyright (c) anio.software

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.\n`
	},

	{
		name: ".gitignore", contents:
`.DS_Store
/node_modules/
/.fourtune/
/dist/\n`,
		overwrite: false
	},

	{
		name: "README.md", contents:
`# README\n`,
		overwrite: false
	}
]

export async function initProject(fourtune_session) {
	for (const file of files) {
		let overwrite = "overwrite" in file ? file.overwrite : true

		await writeProjectInitFile(
			fourtune_session, file, overwrite
		)
	}
}
