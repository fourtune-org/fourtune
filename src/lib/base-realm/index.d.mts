// taken from @fourtune/types
// will be replaced in the future with package

export type LoadRealmDependenciesResult = {
	getDependency(name : string) : any|null
	getPathOfDependency(name : string) : string|null
	getDependencyVersion(name : string) : string|null
	loadDependencyPackageJSON(name : string) : any|null
}

export type LoadRealmDependencies = (
	project_root : string,
	realm : string
) => Promise<LoadRealmDependenciesResult|null>

export type InstallRealmDependencies = (
	project_root : string,
	realm : string,
	dependencies : {
		[name: string] : {
			version : string,
			import_code?: string
		}
	}
) => Promise<void>

export type FindProjectRootFromDirectory = (
	project_root : string
) => Promise<string|false>

export type DefaultExportObject = {
	loadRealmDependencies : LoadRealmDependencies,
	installRealmDependencies : InstallRealmDependencies,
	findProjectRootFromDirectory : FindProjectRootFromDirectory
}

declare const loadRealmDependencies : LoadRealmDependencies
declare const installRealmDependencies : InstallRealmDependencies
declare const findProjectRootFromDirectory : FindProjectRootFromDirectory

export {
	loadRealmDependencies,
	installRealmDependencies,
	findProjectRootFromDirectory
}

declare const _default : DefaultExportObject = {
	loadRealmDependencies,
	installRealmDependencies,
	findProjectRootFromDirectory
}

export default _default
