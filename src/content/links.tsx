import { Gamepad2 } from 'lucide-react'
import Email from '../components/icons/Email'
import GitHub from '../components/icons/GitHub'
import LinkedIn from '../components/icons/LinkedIn'
import Resume from '../components/icons/Resume'
import { useContent } from './ContentContext'
import Entry from './Entry'

export type LinkArea = 'header' | 'footer' | 'cta' | 'resume'

export interface ContentLink {
	readonly slug: string
	readonly title: string
	readonly name: string
	readonly category: string
	readonly href: string
	readonly label: string
	readonly order: number
	readonly decorator?: React.ReactNode
}

interface UseLinksOptions {
	readonly area: LinkArea
	readonly category?: string | readonly string[]
}

const iconRegistry: Record<string, React.ReactNode> = {
	email: <Email />,
	github: <GitHub />,
	linkedin: <LinkedIn />,
	mobygames: <Gamepad2 aria-hidden="true" />,
	resume: <Resume />,
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

const matchesCategory = (entry: Entry, category?: string | readonly string[]) => {
	if (!category) {
		return true
	}

	if (Array.isArray(category)) {
		return category.includes(entry.category)
	}

	return entry.category === category
}

const toContentLink = (entry: Entry): ContentLink | null => {
	if (entry.data.archetype !== 'link') {
		return null
	}

	const { href, label, slug, icon, order } = entry.data

	if (!isString(href) || !isString(label) || !isString(slug)) {
		return null
	}

	return {
		slug,
		title: (entry.data.title as string) ?? entry.name,
		name: entry.name,
		category: entry.category,
		href,
		label,
		order: typeof order === 'number' ? order : Number.MAX_SAFE_INTEGER,
		decorator: isString(icon) ? iconRegistry[icon] : undefined,
	}
}

export const useLinks = ({ area, category }: UseLinksOptions): ContentLink[] => {
	const content = useContent()

	return content
		.filter(entry => matchesCategory(entry, category))
		.filter(entry => getAreas(entry).includes(area))
		.map(toContentLink)
		.filter((link): link is ContentLink => link !== null)
		.sort((linkA, linkB) => linkA.order - linkB.order || linkA.name.localeCompare(linkB.name))
}
