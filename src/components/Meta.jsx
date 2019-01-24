/**
 * @flow
 */

import React from 'react'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'

type MetaProps = {
  description?: ?string,
  lang?: string,
  meta?: Array<*>,
  keywords?: string[],
  title: string,
}

const detailsQuery = graphql`
  query DefaultMetaQuery {
    site {
      siteMetadata {
        title
        description
        author
      }
    }
  }
`

function Meta({
  description, lang, meta, keywords = [], title,
}: MetaProps) {
  return (
    <StaticQuery
      query={detailsQuery}
      render={(data) => {
        const metaDescription = description || data.site.siteMetadata.description
        return (
          <Helmet
            htmlAttributes={{
              lang,
            }}
            title={title}
            titleTemplate={`%s | ${data.site.siteMetadata.title}`}
            meta={[
              {
                name: 'description',
                content: metaDescription,
              },
              {
                property: 'og:title',
                content: title,
              },
              {
                property: 'og:description',
                content: metaDescription,
              },
              {
                property: 'og:type',
                content: 'website',
              },
              {
                name: 'twitter:card',
                content: 'summary',
              },
              {
                name: 'twitter:creator',
                content: data.site.siteMetadata.author,
              },
              {
                name: 'twitter:title',
                content: title,
              },
              {
                name: 'twitter:description',
                content: metaDescription,
              },
            ]
              .concat(
                keywords.length > 0
                  ? {
                    name: 'keywords',
                    content: keywords.join(', '),
                  }
                  : [],
              )
              .concat(meta)}
          />
        )
      }}
    />
  )
}

Meta.defaultProps = {
  description: undefined,
  lang: 'en',
  meta: [],
  keywords: [],
}

export default Meta
