import fs from 'node:fs/promises'
import path from 'node:path'

const escapeXml = (value: string): string =>
	value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;')

const createSitemap = (urls: readonly string[]): string => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `\t<url><loc>${escapeXml(url)}</loc></url>`).join('\n')}
</urlset>
`

const writeSitemap = async (outputDir: string, urls: readonly string[]) => {
	await fs.mkdir(outputDir, { recursive: true })
	await fs.writeFile(path.join(outputDir, 'sitemap.xml'), createSitemap(urls), 'utf8')
}

export default writeSitemap
