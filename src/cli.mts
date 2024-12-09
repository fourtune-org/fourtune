#!/usr/bin/env node
import {fourtune} from "./main.mjs"

const project_root = process.argv[2]

if (process.argv[3] === "-ci") {
	await fourtune(project_root, {initialize_project: true})
	await fourtune(project_root, {initialize_project: false})
} else {
	await fourtune(
		project_root, {
			initialize_project: process.argv[3] === "-init-project"
		}
	)
}
