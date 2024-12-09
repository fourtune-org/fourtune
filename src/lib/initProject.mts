import writeProjectInitFile from "./writeProjectInitFile.mts"

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
	},

	{
		name: `.github/workflows/cicd.yaml`, contents:
`# This is CI/CD version 0.8.0
#
# Changelog
#
# v0.4.0 - 07.09.2024 (by eXory2024)
# Add environment variable "ANIO_CICD" for scripts to detect CI.
# "ANIO_CICD" contains the current CI/CD version.
#
# v0.5.0 - 21.09.2024 (by eXory2024)
# Use "npm ci" (require package-lock.json) instead of "npm i"
#
# v0.6.0 - 24.09.2024 (by eXory2024)
# Add manual "experimental" releases.
#
# v0.7.0 - 01.11.2024 (by eXory2024)
# Add repository name to environment (ANIO_CICD_REPO)
#
# v0.8.0 - 09.12.2024 (by eXory2024)
# Bump node version to v22
#

name: CI/CD

on:
  push:

jobs:
  # Run tests for on push
  test:
    name: Run Unit tests
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [22.x]
    env:
      ANIO_CICD: "v0.8.0"
      ANIO_CICD_REPO: "\${{ github.repository }}"
    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js \${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: \${{ matrix.node-version }}

      - name: "Install node modules (if present)"
        run: bash -c 'if [ -f package.json ]; then npm ci ; fi'

      - name: "Run .cicd/test.sh script (if present)"
        run: bash -c 'if [ -f ./.cicd/test.sh ]; then ./.cicd/test.sh ; fi'

  # Publish for tags starting with "v"
  publish:
    name: Deployment
    runs-on: ubuntu-latest
    needs: test
    if: startsWith(github.ref, 'refs/tags/v')
    permissions:
      id-token: write
    env:
      ANIO_CICD: "v0.8.0"
      ANIO_CICD_REPO: "\${{ github.repository }}"
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 22.x
          registry-url: "https://registry.npmjs.org"

      - name: "Install node modules (if present)"
        run: bash -c 'if [ -f package.json ]; then npm ci ; fi'

      #
      # Make sure package.json's version field and
      # tag name are consistent.
      #
      - name: "Validate package.json version (if present)"
        run: bash -c 'if [ -f package.json ]; then clean_ver="$(printf "%s" "\${{ github.ref_name }}" | cut -c2-)" ; grep -q "\\"$clean_ver\\"" package.json ; fi'

      - name: "Run .cicd/deploy.sh script"
        run: ./.cicd/deploy.sh
        env:
          RELEASE_VERSION: \${{ github.ref_name }}

          NODE_AUTH_TOKEN: \${{ secrets.ANIO_NPM_TOKEN }}
          NPM_TOKEN: \${{ secrets.ANIO_NPM_TOKEN }}

          ANIO_SH_DEPLOY_URL: \${{ secrets.ANIO_SH_DEPLOY_URL }}
          ANIO_SH_DEPLOY_KEY: \${{ secrets.ANIO_SH_DEPLOY_KEY }}
`
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
