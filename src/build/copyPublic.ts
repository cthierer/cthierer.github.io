import fs from 'node:fs/promises'

const copyPublic = async (publicDir: string, outputDir: string) => {
	await fs.mkdir(outputDir, { recursive: true })
	await fs.cp(publicDir, outputDir, {
		recursive: true,
		force: true,
	})
}

export default copyPublic
