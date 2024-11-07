export async function normalizeConfig(
	config
) {
	return {
		target: {},
		autogenerate: {},
		...config
	}
}
