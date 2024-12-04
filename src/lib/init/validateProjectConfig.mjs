export async function validateProjectConfig(config) {
	if (!("realm" in config)) {
		throw new Error(
			`Mandatory field "realm" is missing in config.`
		)
	}

	if (!("name" in config.realm)) {
		throw new Error(
			`Mandatory field "realm.name" is missing in config.`
		)
	}

	if (!(["js"].includes(config.realm.name))) {
		throw new Error(
			`Unknown realm "${config.realm.name}".`
		)
	}
}
