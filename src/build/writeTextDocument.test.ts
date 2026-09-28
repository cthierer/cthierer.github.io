import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import { writeTextDocument } from './writeTextDocument'

test('text siblings require HTML paths and use LF with one final newline', async t => {
	const root = await fs.mkdtemp(path.join('/tmp', 'text-document-'))
	t.after(() => fs.rm(root, { recursive: true, force: true }))
	await writeTextDocument(root, '/nested/resume.html', 'md', 'one\r\ntwo\n\n')
	assert.equal(await fs.readFile(path.join(root, 'nested', 'resume.md'), 'utf8'), 'one\ntwo\n')
	await assert.rejects(
		writeTextDocument(root, '/nested/resume.pdf', 'txt', 'no'),
		/must be an HTML path/,
	)
})
