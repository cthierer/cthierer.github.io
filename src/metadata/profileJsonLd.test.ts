import assert from 'node:assert/strict'
import test from 'node:test'
import type Config from '../config/Config'
import type Entry from '../content/Entry'
import createProfileJsonLd from './profileJsonLd'

const config: Config = {
	favIcon: 'favicon.svg',
	pages: [],
	profileImage: '/assets/profile-image.webp',
	resumeDownload: '/resume.pdf',
	siteTitle: 'Fallback Site Title',
	siteUrl: 'https://example.test',
	socialImage: '/assets/social-image.png',
}

const profile: Entry = {
	category: 'resume',
	data: {
		archetype: 'resume-section',
		headline: 'Software Engineering Leader',
		kind: 'profile',
		location: 'Baltimore/DC area',
		name: 'Chris Thierer',
	},
	html: '',
	markdown: '',
	name: 'resume/Profile.md',
}

test('uses the resume profile section for Person JSON-LD', () => {
	const jsonLd = createProfileJsonLd({
		canonicalUrl: 'https://example.test/resume.html',
		config,
		content: [profile],
		dateModified: '2026-08-08T00:00:00.000Z',
		description: 'Test resume',
		profileImage: 'https://example.test/assets/profile-image.webp',
		title: 'Resume',
	})

	assert.deepEqual(jsonLd, {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@id': 'https://example.test/#person',
				'@type': 'Person',
				homeLocation: {
					'@type': 'Place',
					name: 'Baltimore/DC area',
				},
				image: 'https://example.test/assets/profile-image.webp',
				jobTitle: 'Software Engineering Leader',
				name: 'Chris Thierer',
				url: 'https://example.test/resume.html',
			},
			{
				'@id': 'https://example.test/#profile-page',
				'@type': 'ProfilePage',
				dateModified: '2026-08-08T00:00:00.000Z',
				description: 'Test resume',
				mainEntity: {
					'@id': 'https://example.test/#person',
				},
				name: 'Resume',
				url: 'https://example.test/resume.html',
			},
		],
	})
})
