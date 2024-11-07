export async function validateProjectConfig(config) {
	if (!("realm" in config)) {
		throw new Error(
			`Mandatory field "realm" is missing in config.`
		)
	}

	if (!(["js"].includes(config.realm))) {
		throw new Error(
			`Unknown realm "${config.realm}".`
		)
	}
}
