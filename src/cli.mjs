#!/usr/bin/env node
import {fourtune} from "./main.mjs"

await fourtune(
	process.argv[2], {
		initialize_project: process.argv[3] === "-init-project"
	}
)
