import type {ScandirEntry} from "@anio-software/fs"

import type {
	FourtuneSession,
	FourtuneConfig,
	FourtuneFileGenerator,
	FourtuneHookId,
	FourtuneHookFn,
	FourtuneInputFile,
	FourtuneRealmIntegration
} from "@fourtune/types/fourtune/v0/"

import type {
	DefaultExportObject as FourtuneCore,
	DependenciesToInstall
} from "@fourtune/types/core/v1/"

type ReplaceReturnType<T extends (...a: any) => any, TNewReturn> = (...a: Parameters<T>) => TNewReturn;

export type FileGenerator = {
	file_path: string
	generator: FourtuneFileGenerator
}

export type Distributable = ({
	name: string
}) & (({
	file_name: string,
	generator: FourtuneFileGenerator
}) | ({
	file_name: string[],
	generator: ReplaceReturnType<FourtuneFileGenerator, Promise<string[]>>
}))

export type Product = {
	product_name: string,
	distributables: Distributable[]
}

export type Hook = {
	id: FourtuneHookId,
	fn: FourtuneHookFn
}

export type Session = {
	project: {
		root: string,
		config: FourtuneConfig
	},

	raw_input: {
		source_files: ScandirEntry[],
		assets: ScandirEntry[]
	},

	input: {
		source_files: FourtuneInputFile[]|null,
		assets: FourtuneInputFile[]|null
	},

	// flag to freeze
	// files_to_autogenerate,
	// objects_to_generate, and
	// products_to_generate, and
	// hooks
	is_frozen: boolean,

	files_to_autogenerate: FileGenerator[],
	objects_to_generate: FileGenerator[],

	products_to_generate: Product[],
	hooks: Hook[],

	core: FourtuneCore,

	realm: {
		integration: FourtuneRealmIntegration,
		dependencies: DependenciesToInstall
	},

	public_interface: FourtuneSession
}
