import { createContext, useContext } from 'react'
import Entry from './Entry'

const ContentContext = createContext<Entry[] | null>(null)

export default ContentContext

export const useContent = (): Entry[] => {
	const content = useContext(ContentContext)

	if (!content) {
		throw new Error('useContent must be used inside a ContentProvider')
	}

	return content
}

export const useContentEntry = (name: string): Entry | null => {
	const content = useContent()

	for (const entry of content) {
		if (entry.name === name) {
			return entry
		}
	}

	return null
}
