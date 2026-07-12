import Config from '../config/Config'
import Entry from '../content/Entry'
import { JsonLdValue } from './JsonLd'

interface ProfileJsonLdOptions {
	readonly config: Config
	readonly content: readonly Entry[]
	readonly canonicalUrl: string
	readonly profileImage: string
	readonly dateModified: string
}

const isString = (value: unknown): value is string => typeof value === 'string'

const getAreas = (entry: Entry): string[] => {
	const { areas } = entry.data

	if (Array.isArray(areas)) {
		return areas.filter(isString)
	}

	if (isString(areas)) {
		return [areas]
	}

	return []
}

const getProfile = (content: readonly Entry[], config: Config) => {
	const entry = content.find(
		item => item.category === 'resume' && item.data.archetype === 'profile',
	)

	return {
		name: isString(entry?.data.name) ? entry.data.name : config.siteTitle,
		headline: isString(entry?.data.headline) ? entry.data.headline : undefined,
		location: isString(entry?.data.location) ? entry.data.location : undefined,
	}
}

const getLinks = (content: readonly Entry[]) =>
	content
		.filter(entry => entry.data.archetype === 'link')
		.map(entry => ({
			category: entry.category,
			href: isString(entry.data.href) ? entry.data.href : '',
			areas: getAreas(entry),
		}))
		.filter(link => link.href)

const makeAbsoluteUrl = (href: string, siteUrl: string): string => new URL(href, siteUrl).toString()

const getEmail = (content: readonly Entry[]): string | undefined =>
	getLinks(content).find(link => link.href.startsWith('mailto:') && link.areas.includes('resume'))
		?.href

const getSameAs = (content: readonly Entry[], siteUrl: string): string[] =>
	getLinks(content)
		.filter(link => link.category === 'social')
		.filter(link => link.href.startsWith('http://') || link.href.startsWith('https://'))
		.map(link => makeAbsoluteUrl(link.href, siteUrl))

const createProfileJsonLd = ({
	config,
	content,
	canonicalUrl,
	profileImage,
	dateModified,
}: ProfileJsonLdOptions): JsonLdValue => {
	const profile = getProfile(content, config)
	const personId = new URL('/#person', config.siteUrl).toString()
	const profilePageId = new URL('/#profile-page', config.siteUrl).toString()
	const email = getEmail(content)
	const sameAs = getSameAs(content, config.siteUrl)

	return {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'Person',
				'@id': personId,
				name: profile.name,
				...(profile.headline ? { jobTitle: profile.headline } : {}),
				...(profile.location
					? {
							homeLocation: {
								'@type': 'Place',
								name: profile.location,
							},
						}
					: {}),
				url: canonicalUrl,
				image: profileImage,
				...(email ? { email } : {}),
				...(sameAs.length > 0 ? { sameAs } : {}),
			},
			{
				'@type': 'ProfilePage',
				'@id': profilePageId,
				url: canonicalUrl,
				name: config.homePage.title,
				description: config.homePage.description,
				dateModified,
				mainEntity: {
					'@id': personId,
				},
			},
		],
	}
}

export default createProfileJsonLd
