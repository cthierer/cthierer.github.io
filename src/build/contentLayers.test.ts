import assert from 'node:assert/strict'
import test from 'node:test'
import type Entry from '../content/Entry'
import { validateResumeSections } from '../content/validateResumeSections'
import { getCoverLetter } from '../content/coverLetter'
import { mergeFrontmatter, resolveMarkdownLayers, type MarkdownSource } from './contentLayers'

const source = (
	name: string,
	data: Record<string, unknown>,
	markdown = '',
	sourceDirectory = 'content',
): MarkdownSource => ({ data, markdown, name, sourceDirectory })

const profile = {
	archetype: 'resume-section',
	headline: 'Engineer',
	kind: 'profile',
	location: 'Baltimore',
	name: 'Chris',
	order: 20,
	published: true,
	title: 'Profile',
}

test('mergeFrontmatter recursively patches plain objects, replaces atomic values, and removes null fields', () => {
	const updatedDate = new Date('2026-08-08T00:00:00.000Z')

	assert.deepEqual(
		mergeFrontmatter(
			{
				array: ['before'],
				date: new Date('2026-08-07T00:00:00.000Z'),
				nested: { keep: true, remove: 'value' },
				scalar: 'before',
			},
			{
				array: ['after'],
				date: updatedDate,
				nested: { add: true, remove: null },
				scalar: 'after',
			},
		),
		{
			array: ['after'],
			date: updatedDate,
			nested: { add: true, keep: true },
			scalar: 'after',
		},
	)
})

test('content layers inherit blank Markdown bodies and replace nonblank bodies', async () => {
	const base = source('resume/Profile.md', profile, 'Baseline body')
	const patch = source('resume/Profile.md', { headline: 'Teacher' }, '   \n', 'variants/one')
	const replacement = source('resume/Profile.md', {}, 'Variant body', 'variants/two')

	const inherited = await resolveMarkdownLayers([[base], [patch]])
	assert.equal(inherited[0]?.markdown, 'Baseline body')
	assert.equal(inherited[0]?.data.headline, 'Teacher')

	const replaced = await resolveMarkdownLayers([[base], [replacement]])
	assert.equal(replaced[0]?.markdown, 'Variant body')
})

test('a published false patch suppresses an inherited entry', async () => {
	const content = await resolveMarkdownLayers([
		[source('resume/Profile.md', profile)],
		[source('resume/Profile.md', { published: false }, '', 'variants/one')],
	])
	assert.deepEqual(content, [])
})

test('validation happens after resolution and names contributing layers', async () => {
	await assert.rejects(
		resolveMarkdownLayers([
			[source('resume/Profile.md', profile)],
			[source('resume/Profile.md', { headline: null }, '', 'variants/one')],
		]),
		/Invalid resolved frontmatter in resume\/Profile\.md \(from content, variants\/one\)/,
	)
})

test('resume sections reject duplicate orders and singleton kinds', () => {
	const entry = (name: string, order: number, kind: string): Entry => ({
		category: 'resume',
		data: { archetype: 'resume-section', kind, order },
		html: '',
		markdown: '',
		name,
	})

	assert.throws(
		() =>
			validateResumeSections([
				entry('resume/Profile.md', 20, 'profile'),
				entry('resume/Skills.md', 20, 'skills'),
			]),
		/Duplicate resume section order 20/,
	)
	assert.throws(
		() =>
			validateResumeSections([
				entry('resume/Profile.md', 20, 'profile'),
				entry('resume/About.md', 30, 'profile'),
			]),
		/Duplicate resume section kind "profile"/,
	)
})

test('cover letters accept parser dates, default their closing, and reject duplicates', async () => {
	const letter = (name: string, date: Date | string) =>
		source(
			name,
			{
				archetype: 'cover-letter',
				date,
				greeting: 'Dear team,',
				published: true,
				recipient: { organization: 'Example' },
				title: 'Letter',
			},
			'Hello.',
		)
	const content = await resolveMarkdownLayers([
		[letter('cover-letter/Letter.md', new Date('2026-08-12T00:00:00.000Z'))],
	])
	assert.equal(content[0]?.data.date instanceof Date, true)
	assert.equal(getCoverLetter(content)?.closing, 'Sincerely,')
	await assert.rejects(
		resolveMarkdownLayers([
			[letter('cover-letter/One.md', '2026-08-12'), letter('cover-letter/Two.md', '2026-08-13')],
		]),
		/Only one published cover letter/,
	)
	await assert.rejects(
		resolveMarkdownLayers([[letter('cover-letter/Letter.md', 'not-a-date')]]),
		/Cover letter date must be a valid date/,
	)
	const blankLetter = letter('cover-letter/Letter.md', '2026-08-12')
	await assert.rejects(
		resolveMarkdownLayers([[{ ...blankLetter, markdown: '   ' }]]),
		/Published cover letter must have a Markdown body/,
	)
})
