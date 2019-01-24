/**
 * @flow
 */

import { graphql } from 'gatsby'

export const fetchCtaLinks = graphql`
  fragment CtaLinks on CtaYaml {
    links {
      title
      href
      route
      icon
    }
  }
`

export default function selectCtaLinks({
  ctaYaml: { links = [] } = {},
}: {
  ctaYaml: {
    links: Array<{
      title: string,
      href?: string,
      route?: string,
      icon: string,
    }>,
  },
} = {}) {
  return links
}
