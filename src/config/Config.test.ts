import assert from 'node:assert/strict'
import test from 'node:test'
import { schema } from './Config'

const base = {
	siteUrl: 'https://example.test',
	siteTitle: 'Test',
	favIcon: 'favicon.svg',
	profileImage: '/profile.webp',
	socialImage: '/social.png',
	resumeDownload: '/resume.pdf',
}
const page = { key: 'resume', title: 'Resume', path: '/resume.html', description: 'Test' }

test('page formats default to HTML and validate document-output constraints', () => {
	assert.deepEqual(schema.parse({ ...base, pages: [page] }).pages[0]?.formats, ['html'])
	assert.deepEqual(
		schema.parse({ ...base, pages: [{ ...page, formats: ['html', 'pdf', 'md', 'txt'] }] }).pages[0]
			?.formats,
		['html', 'pdf', 'md', 'txt'],
	)
	for (const formats of [[], ['pdf'], ['html', 'html']] as const)
		assert.throws(() => schema.parse({ ...base, pages: [{ ...page, formats }] }))
	assert.throws(
		() => schema.parse({ ...base, pages: [{ ...page, pdf: true }] }),
		/legacy pdf field/,
	)
	assert.throws(
		() => schema.parse({ ...base, pages: [{ ...page, key: 'home', formats: ['html', 'txt'] }] }),
		/only for the resume/,
	)
})
