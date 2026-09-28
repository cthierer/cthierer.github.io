import { StructuredDataContext } from '../layouts/Page'
import { JsonLdValue } from '../metadata/JsonLd'
import type { DocumentFormat } from '../config/Config'

interface Route {
	readonly key: 'home' | 'resume' | 'privacy' | 'cover-letter'
	readonly outputPath: string
	readonly canonicalPath: string
	readonly title: string
	readonly description: string
	readonly formats: readonly DocumentFormat[]
	readonly element: React.ReactElement
	readonly structuredData?: (context: StructuredDataContext) => JsonLdValue
}

export default Route
