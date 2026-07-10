export type JsonLdValue =
	| string
	| number
	| boolean
	| null
	| readonly JsonLdValue[]
	| { readonly [key: string]: JsonLdValue }

interface JsonLdProps {
	readonly data: JsonLdValue
}

const serializeJsonLd = (data: JsonLdValue): string =>
	JSON.stringify(data).replaceAll('<', '\\u003c')

const JsonLd = ({ data }: JsonLdProps) => (
	<script type="application/ld+json">{serializeJsonLd(data)}</script>
)

export default JsonLd
