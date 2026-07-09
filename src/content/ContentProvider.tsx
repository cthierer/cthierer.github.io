import ContentContext from './ContentContext'
import Entry from './Entry'

interface ContentProviderProps {
	content: Entry[]
	children: React.ReactNode
}

const ContentProvider = ({ content, children }: ContentProviderProps) => (
	<ContentContext.Provider value={content}>{children}</ContentContext.Provider>
)

export default ContentProvider
