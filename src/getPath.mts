import path from "node:path"

export function getObjectsPath(
	project_root,
	...args
) {
	return path.join(
		project_root, ".fourtune", "fourtune", "v1", "objects", ...args
	)
}

export function getBuildPath(
	project_root,
	...args
) {
	return path.join(
		project_root, ".fourtune", "fourtune", "v1", "build", ...args
	)
}
