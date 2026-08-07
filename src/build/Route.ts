import { StructuredDataContext } from '../layouts/Page'
import { JsonLdValue } from '../metadata/JsonLd'

interface Route {
	readonly outputPath: string
	readonly canonicalPath: string
	readonly title: string
	readonly description: string
	readonly element: React.ReactElement
	readonly structuredData?: (context: StructuredDataContext) => JsonLdValue
}

export default Route
