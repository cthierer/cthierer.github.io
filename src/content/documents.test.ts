import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import type Config from '../config/Config'
import { resolveMarkdownLayers } from '../build/contentLayers'
import loadMarkdown from '../build/loadMarkdown'
import {
	createCoverLetterDocument,
	createResumeDocument,
	type CoverLetterDocument,
	type ResumeDocument,
	serializeCoverLetterMarkdown,
	serializeCoverLetterText,
	serializeResumeMarkdown,
	serializeResumeText,
	serializeText,
} from './documents'

const cwd = process.cwd()
const config: Config = {
	siteUrl: 'https://example.test',
	siteTitle: 'Test Site',
	favIcon: 'favicon.svg',
	profileImage: '/profile.webp',
	socialImage: '/social.png',
	resumeDownload: '/resume.pdf',
	pages: [],
}
const content = async () =>
	resolveMarkdownLayers([await loadMarkdown(path.join(cwd, 'content'), 'content')])

test('resume document resolves ordered sections, contacts, roles, education, and canonical markdown', async () => {
	const document = createResumeDocument(await content(), config)
	assert.equal(document.profile.name, 'Chris Thierer')
	assert.deepEqual(
		document.links.map(link => link.href),
		['mailto:hello@christhierer.com', 'https://www.christhierer.com'],
	)
	assert.deepEqual(
		document.sections.map(section => section.kind),
		['metrics', 'profile', 'skills', 'experience', 'education'],
	)
	const experience = document.sections.find(section => section.kind === 'experience')
	assert.ok(experience && experience.roles.length > 0)
	const education = document.sections.find(section => section.kind === 'education')
	assert.ok(education && education.education.length > 0)
	const markdown = serializeResumeMarkdown(document)
	assert.match(markdown, /^# Chris Thierer/m)
	assert.match(markdown, /^## Experience/m)
	assert.match(markdown, /^### Engineering Manager II/m)
	assert.match(markdown, /\[hello@christhierer\.com\]\(mailto:hello@christhierer\.com\)/)
	assert.match(markdown, /- \*\*15 years — Experience\*\*/)
})

test('serializers preserve Markdown tokens, normalize ASCII text, and reject unsupported text characters', () => {
	assert.equal(
		serializeText('A **bold** [link](https://example.test)\n\n- one\n- two'),
		'A bold link (https://example.test)\n\n- one\n- two',
	)
	assert.equal(serializeText('“Café”—it’s fine…'), '"Cafe"-it\'s fine...')
	assert.throws(() => serializeText('emoji 😀'), /ASCII-normalized/)
})

test('text serializer renders inline and block HTML tokens as visible text', () => {
	assert.equal(
		serializeText(
			'Platform Reliability Team (<abbr title="Platform Reliability Team">PRT</abbr>) uses <strong>nested <em>HTML</em></strong> &amp; numeric entities: &#38; and &#x26;.',
		),
		'Platform Reliability Team (PRT) uses nested HTML & numeric entities: & and &.',
	)
	assert.equal(
		serializeText(
			'<p><abbr>PRT</abbr> &amp; <strong>nested <em>text</em></strong></p><p>Next paragraph.</p>',
		),
		'PRT & nested text\n\nNext paragraph.',
	)
	assert.throws(() => serializeText('Malformed numeric entity: &#x110000;.'), /ASCII-normalized/)
	assert.throws(
		() => serializeText('Use <abbr title="A > B">PRT</abbr> &amp; &#0;.'),
		/ASCII-normalized/,
	)
	assert.throws(() => serializeText('<span>&copy;</span>'), /ASCII-normalized/)
	assert.throws(() => serializeText('&reg;'), /ASCII-normalized/)
	assert.throws(() => serializeText('&notARealEntity;'), /ASCII-normalized/)
	assert.equal(serializeText('&madeup; R&D;'), '&madeup; R&D;')
	assert.equal(
		serializeText('`&amp; &copy; &reg;`\n\n```\n&amp; &copy; &reg;\n```'),
		'&amp; &copy; &reg;\n\n&amp; &copy; &reg;',
	)
	assert.equal(
		serializeText(
			'Visible <script type="text/plain">hidden &amp;</script><style>.hidden { color: red; }</style> text.',
		),
		'Visible text.',
	)
	assert.equal(serializeText('**Visible <script>hidden</script> text.**'), 'Visible text.')
})

test('text serializer exactly preserves visible contact and link conventions', () => {
	assert.equal(
		serializeText(
			'[person@example.test](mailto:person@example.test) [Phone](tel:555) [Baltimore](geo:1,2) [Site](https://example.test)\n\n- one\n- two\n\nInline `code` and [normal](https://normal.test).\n\n```\nblock\n```',
		),
		'person@example.test Phone Baltimore Site (https://example.test)\n\n- one\n- two\n\nInline code and normal (https://normal.test).\n\nblock',
	)
	assert.equal(serializeText('- parent\n  - child\n- sibling'), '- parent\n  - child\n- sibling')
	assert.equal(serializeText('- one\n  - two\n    - three'), '- one\n  - two\n    - three')
})

test('resume Markdown and text serializers have an exact all-section golden', () => {
	const role = (data: Record<string, unknown>, markdown = '') => ({
		data,
		markdown,
		get jobTitle() {
			return this.data.jobTitle as string
		},
		get startDate() {
			return new Date(this.data.startDate as string)
		},
		get endDate() {
			return this.data.endDate ? new Date(this.data.endDate as string) : undefined
		},
		get location() {
			return this.data.location as string
		},
		get resumeSummary() {
			return this.data.resumeSummary as string | undefined
		},
		get resumeHighlights() {
			return (this.data.resumeHighlights as string[] | undefined) ?? []
		},
	})
	const document = {
		profile: {
			entryName: 'profile',
			html: '',
			markdown: 'Profile *body*.',
			order: 20,
			title: 'About',
			kind: 'profile',
			name: 'Ada',
			headline: 'Leader',
			location: 'Baltimore',
		},
		links: [
			{
				href: 'mailto:ada@example.test',
				label: 'Email',
				name: 'email',
				order: 1,
				slug: 'email',
				title: 'Email',
				category: 'contact',
			},
			{
				href: 'tel:555',
				label: 'Phone',
				name: 'phone',
				order: 2,
				slug: 'phone',
				title: 'Phone',
				category: 'contact',
			},
			{
				href: 'geo:1,2',
				label: 'Baltimore',
				name: 'geo',
				order: 3,
				slug: 'geo',
				title: 'Baltimore',
				category: 'contact',
			},
			{
				href: 'https://example.test',
				label: 'Site',
				name: 'site',
				order: 4,
				slug: 'site',
				title: 'Site',
				category: 'contact',
			},
		],
		sections: [
			{
				entryName: 'metrics',
				html: '',
				markdown: '',
				order: 10,
				title: 'Numbers',
				kind: 'metrics',
				metrics: [{ value: '10', label: 'Years', detail: 'Delivery' }],
			},
			{
				entryName: 'profile',
				html: '',
				markdown: 'Profile *body*.',
				order: 20,
				title: 'About',
				kind: 'profile',
				name: 'Ada',
				headline: 'Leader',
				location: 'Baltimore',
			},
			{
				entryName: 'skills',
				html: '',
				markdown: '',
				order: 30,
				title: 'Skills',
				kind: 'skills',
				groups: [{ label: 'Code', items: ['TypeScript', 'Go'] }],
			},
			{
				entryName: 'prose',
				html: '',
				markdown: 'See [guide](https://guide.test) and `code`.\n\n- one\n- two',
				order: 40,
				title: 'Notes',
				kind: 'prose',
			},
			{
				entryName: 'experience',
				html: '',
				markdown: '',
				order: 50,
				title: 'Work',
				kind: 'experience',
				roles: [
					{
						experience: role({
							jobTitle: 'Manager',
							startDate: '2020-01-01',
							location: 'Remote',
							resumeSummary: 'Led.',
							resumeHighlights: ['Shipped.'],
						}),
						organization: { label: 'Org' },
					},
					{
						experience: role(
							{
								jobTitle: 'Engineer',
								startDate: '2019-01-01',
								endDate: '2020-01-01',
								location: 'Here',
							},
							'Fallback [link](https://fallback.test).',
						),
						organization: { label: 'Old' },
					},
				],
			},
			{
				entryName: 'education',
				html: '',
				markdown: '',
				order: 60,
				title: 'School',
				kind: 'education',
				education: [
					{
						degree: 'B.S.',
						program: 'CS',
						institution: 'University',
						endDate: new Date('2018-01-01'),
						honors: ['Honors'],
					},
				],
			},
		],
	} as unknown as ResumeDocument
	const expected = `# Ada\n\nLeader | Baltimore\n\n[ada@example.test](mailto:ada@example.test)\n[Phone](tel:555)\n[Baltimore](geo:1,2)\n[example.test](https://example.test)\n\n## Numbers\n\n- **10 — Years**: Delivery\n\n## About\n\nProfile *body*.\n\n## Skills\n\n- **Code:** TypeScript, Go\n\n## Notes\n\nSee [guide](https://guide.test) and \`code\`.\n\n- one\n- two\n\n## Work\n\n### Manager\n\nOrg | Jan 2020 - Present | Remote\n\nLed.\n\n- Shipped.\n### Engineer\n\nOld | Jan 2019 - Jan 2020 | Here\n\nFallback [link](https://fallback.test).\n\n## School\n\n### B.S., CS\n\nUniversity | 2018\n\n- Honors\n`
	assert.equal(serializeResumeMarkdown(document), expected)
	assert.equal(
		serializeResumeText(document),
		`Ada\n\nLeader | Baltimore\n\nada@example.test\nPhone\nBaltimore\nexample.test (https://example.test)\n\nNumbers\n\n- 10 - Years: Delivery\n\nAbout\n\nProfile body.\n\nSkills\n\n- Code: TypeScript, Go\n\nNotes\n\nSee guide (https://guide.test) and code.\n\n- one\n- two\n\nWork\n\nManager\n\nOrg | Jan 2020 - Present | Remote\n\nLed.\n\n- Shipped.\n\nEngineer\n\nOld | Jan 2019 - Jan 2020 | Here\n\nFallback link (https://fallback.test).\n\nSchool\n\nB.S., CS\n\nUniversity | 2018\n\n- Honors`,
	)
})

test('cover letter Markdown and text serializers have an exact full golden', () => {
	const document = {
		profile: { name: 'Ada', headline: 'Leader', location: 'Baltimore' },
		senderName: 'Grace',
		links: [
			{ href: 'mailto:ada@example.test', label: 'Email' },
			{ href: 'tel:555', label: 'Phone' },
			{ href: 'geo:1,2', label: 'Baltimore' },
			{ href: 'https://example.test', label: 'Site' },
		],
		letter: {
			date: '2026-08-12',
			recipient: {
				name: 'Pat',
				title: 'Director',
				organization: 'Example',
				address: ['One Way', 'Baltimore, MD'],
			},
			subject: 'RE: Role',
			greeting: 'Dear Pat,',
			markdown:
				'See [guide](https://guide.test) and `code`.\n\n- one\n- two\n  - nested\n\n```\nblock\n```',
			closing: 'Regards,',
		},
	} as unknown as CoverLetterDocument
	const markdown = `# Ada\n\nLeader | Baltimore\n\n[ada@example.test](mailto:ada@example.test)\n[Phone](tel:555)\n[Baltimore](geo:1,2)\n[example.test](https://example.test)\n\nAugust 12, 2026\n\nPat\nDirector\nExample\nOne Way\nBaltimore, MD\n\n**RE: Role**\n\nDear Pat,\n\nSee [guide](https://guide.test) and \`code\`.\n\n- one\n- two\n  - nested\n\n\`\`\`\nblock\n\`\`\`\n\nRegards,\nGrace`
	assert.equal(serializeCoverLetterMarkdown(document), markdown)
	assert.equal(
		serializeCoverLetterText(document),
		`Ada\n\nLeader | Baltimore\n\nada@example.test\nPhone\nBaltimore\nexample.test (https://example.test)\n\nAugust 12, 2026\n\nPat\nDirector\nExample\nOne Way\nBaltimore, MD\n\nRE: Role\n\nDear Pat,\n\nSee guide (https://guide.test) and code.\n\n- one\n- two\n  - nested\n\nblock\n\nRegards,\nGrace`,
	)
	assert.match(serializeCoverLetterMarkdown({ ...document, senderName: 'Ada' }), /Regards,\nAda$/)
	assert.match(
		serializeCoverLetterMarkdown({ ...document, senderName: document.profile.name }),
		/Regards,\nAda$/,
	)
})

test('document-specific text wrappers use the canonical serializers', async () => {
	const resume = createResumeDocument(await content(), config)
	assert.equal(serializeResumeText(resume), serializeText(serializeResumeMarkdown(resume)))
	const root = await fs.mkdtemp(path.join('/tmp', 'wrapper-letter-'))
	try {
		await fs.mkdir(path.join(root, 'cover-letter'))
		await fs.writeFile(
			path.join(root, 'cover-letter', 'letter.md'),
			`---\ntitle: Letter\narchetype: cover-letter\npublished: true\ndate: 2026-08-12\nrecipient:\n  organization: Example\ngreeting: Hello\n---\n\nBody.`,
		)
		const letter = createCoverLetterDocument(
			await resolveMarkdownLayers([
				await loadMarkdown(path.join(cwd, 'content'), 'content'),
				await loadMarkdown(root, '.'),
			]),
			config,
		)
		assert.ok(letter)
		assert.equal(
			serializeCoverLetterText(letter),
			serializeText(serializeCoverLetterMarkdown(letter)),
		)
	} finally {
		await fs.rm(root, { recursive: true, force: true })
	}
})

test('cover letter document serializes headers, recipient, subject, body, and sender', async t => {
	const root = await fs.mkdtemp(path.join('/tmp', 'document-letter-'))
	t.after(() => fs.rm(root, { recursive: true, force: true }))
	await fs.mkdir(path.join(root, 'cover-letter'))
	await fs.writeFile(
		path.join(root, 'cover-letter', 'letter.md'),
		`---\ntitle: Letter\narchetype: cover-letter\npublished: true\ndate: 2026-08-12\nrecipient:\n  name: Pat Person\n  title: Hiring Manager\n  organization: Example\n  address: [One Way, Baltimore]\nsubject: 'RE: Role'\ngreeting: 'Dear Pat,'\nclosing: 'Regards,'\nsender:\n  name: Sender\n---\n\nHello **there**.`,
	)
	const layered = await resolveMarkdownLayers([
		await loadMarkdown(path.join(cwd, 'content'), 'content'),
		await loadMarkdown(root, '.'),
	])
	const document = createCoverLetterDocument(layered, config)
	assert.ok(document)
	const markdown = serializeCoverLetterMarkdown(document)
	assert.match(
		markdown,
		/August 12, 2026[\s\S]*Pat Person[\s\S]*\*\*RE: Role\*\*[\s\S]*Hello \*\*there\*\*[\s\S]*Regards,[\s\S]*Sender/,
	)
})

test('layered parser content applies private contact and ordered resume overrides', async t => {
	const root = await fs.mkdtemp(path.join('/tmp', 'layered-document-'))
	t.after(() => fs.rm(root, { recursive: true, force: true }))
	const base = path.join(root, 'base')
	const overlay = path.join(root, 'overlay')
	await Promise.all([
		fs.mkdir(path.join(base, 'resume'), { recursive: true }),
		fs.mkdir(path.join(base, 'contact'), { recursive: true }),
		fs.mkdir(path.join(base, 'experience'), { recursive: true }),
		fs.mkdir(path.join(base, 'organizations'), { recursive: true }),
		fs.mkdir(path.join(overlay, 'resume'), { recursive: true }),
		fs.mkdir(path.join(overlay, 'contact'), { recursive: true }),
	])
	await fs.writeFile(
		path.join(base, 'resume', 'Profile.md'),
		`---\ntitle: Profile\narchetype: resume-section\nkind: profile\npublished: true\norder: 2\nname: Name\nheadline: Public\nlocation: Here\n---\n\nPublic profile.`,
	)
	await fs.writeFile(
		path.join(base, 'resume', 'Experience.md'),
		`---\ntitle: Experience\narchetype: resume-section\nkind: experience\npublished: true\norder: 4\nlimit: 1\n---`,
	)
	await fs.writeFile(
		path.join(base, 'resume', 'Remove.md'),
		`---\ntitle: Remove\narchetype: resume-section\nkind: prose\npublished: true\norder: 3\n---\n\nRemove me.`,
	)
	await fs.writeFile(
		path.join(base, 'contact', 'Email.md'),
		`---\ntitle: Email\narchetype: link\npublished: true\nslug: email\nlabel: Email\nhref: mailto:public@example.test\nareas: [resume]\n---`,
	)
	await fs.writeFile(
		path.join(base, 'organizations', 'Org.md'),
		`---\ntitle: Org\narchetype: organization\npublished: true\nslug: org\nlabel: Org\nlocation: Here\n---`,
	)
	await fs.writeFile(
		path.join(base, 'experience', 'Role.md'),
		`---\ntitle: Role\narchetype: experience\npublished: true\norganization: org\nstartDate: 2020-01-01\nlocation: Here\ntype: fte\nrole: fte\njobTitle: Role\n---\n\nRole body.`,
	)
	await fs.writeFile(path.join(overlay, 'resume', 'Remove.md'), `---\npublished: false\n---`)
	await fs.writeFile(
		path.join(overlay, 'resume', 'Private.md'),
		`---\ntitle: Private note\narchetype: resume-section\nkind: prose\npublished: true\norder: 3\n---\n\nPrivate prose.`,
	)
	await fs.writeFile(
		path.join(overlay, 'contact', 'Phone.md'),
		`---\ntitle: Phone\narchetype: link\npublished: true\nslug: phone\nlabel: Phone\nhref: tel:555\nareas: [resume]\n---`,
	)
	const publicDocument = createResumeDocument(
		await resolveMarkdownLayers([await loadMarkdown(base, '.')]),
		config,
	)
	const privateDocument = createResumeDocument(
		await resolveMarkdownLayers([await loadMarkdown(base, '.'), await loadMarkdown(overlay, '.')]),
		config,
	)
	assert.doesNotMatch(serializeResumeMarkdown(publicDocument), /Private prose|tel:555/)
	const markdown = serializeResumeMarkdown(privateDocument)
	assert.match(markdown, /## Private note[\s\S]*Private prose/)
	assert.doesNotMatch(markdown, /Remove me/)
	assert.match(markdown, /\[Phone\]\(tel:555\)/)
	assert.equal(
		(
			privateDocument.sections.find(section => section.kind === 'experience') as {
				roles: readonly unknown[]
			}
		).roles.length,
		1,
	)
})
