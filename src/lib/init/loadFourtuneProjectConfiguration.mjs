import path from "node:path"

export default async function(project_root) {
	const {default: config} = await import(path.join(project_root, "fourtune.config.mjs"))

	if (typeof config === "function") {
		return await config()
	}

	return config
}
