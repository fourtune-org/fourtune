import cleanup from "./0.cleanup.mts"
import removeObsoleteAutoFiles from "./1.removeObsoleteAutoFiles.mts"
import createAutoFiles from "./2.createAutoFiles.mts"
import preprocessFiles from "./3.preprocessFiles.mts"
import createObjectFiles from "./4.createObjectFiles.mts"
import createProducts from "./5.createProducts.mts"

export const stages = [
	cleanup,
	removeObsoleteAutoFiles,
	createAutoFiles,
	preprocessFiles,
	createObjectFiles,
	createProducts
]
