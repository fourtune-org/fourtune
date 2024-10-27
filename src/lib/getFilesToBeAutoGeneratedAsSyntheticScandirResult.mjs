import path from "node:path"

function parents(file_path) {
	const parents = path.dirname(file_path).split(path.sep)

	if (parents.length === 1 && parents[0] === ".") {
		return []
	}

	return parents
}

export default function(fourtune_session) {
	const project_root = fourtune_session.project.root
	const result = []

	for (const {file_path} of fourtune_session.files_to_autogenerate) {
		result.push({
			type: "file",
			parents: ["auto", ...parents(file_path)],
			name: path.basename(file_path),
			path: path.join("auto", file_path),
			relative_path: path.join("auto", file_path),
			absolute_path: path.join(
				project_root, "auto", file_path
			)
		})
	}

	return result
}
