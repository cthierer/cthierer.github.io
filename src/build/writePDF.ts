import { spawn } from 'node:child_process'
import path from 'node:path'

const runProcess = (command: string, args: readonly string[], cwd: string): Promise<void> =>
	new Promise((resolve, reject) => {
		const child = spawn(command, args, { cwd, stdio: 'inherit' })

		child.once('error', error => {
			reject(new Error(`Unable to start ${command}: ${error.message}`, { cause: error }))
		})

		child.once('close', (exitCode, signal) => {
			if (exitCode === 0) {
				resolve()
				return
			}

			const reason = exitCode !== null ? `exit code ${exitCode}` : `signal ${signal ?? 'unknown'}`
			reject(new Error(`${command} failed with ${reason}`))
		})
	})

const writePDF = async (cwd: string, outputDir: string, sourcePath: string) => {
	const inputFile = path.join(outputDir, sourcePath)
	const inputFileExt = path.extname(inputFile)
	if (inputFileExt !== '.html') {
		throw new Error(`cannot convert ${sourcePath} to PDF: must be an HTML file`)
	}
	const pdfFile = inputFile.substring(0, inputFile.length - 4) + 'pdf'

	await runProcess(
		'weasyprint',
		['--media-type', 'print', '--pdf-tags', '--pdf-variant', 'pdf/ua-1', inputFile, pdfFile],
		cwd,
	)
}

export default writePDF
