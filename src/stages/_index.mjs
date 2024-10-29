import cleanup from "./0.cleanup.mjs"
import removeObsoleteAutoFiles from "./1.removeObsoleteAutoFiles.mjs"
import createAutoFiles from "./2.createAutoFiles.mjs"
import preprocessFiles from "./3.preprocessFiles.mjs"
import createObjectFiles from "./4.createObjectFiles.mjs"
import createProducts from "./5.createProducts.mjs"

export const stages = [
	cleanup,
	removeObsoleteAutoFiles,
	createAutoFiles,
	preprocessFiles,
	createObjectFiles,
	createProducts
]
