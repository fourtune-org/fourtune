#!/usr/bin/env node
import {fourtune} from "./main.mjs"

await fourtune(
	process.argv[2]
)
