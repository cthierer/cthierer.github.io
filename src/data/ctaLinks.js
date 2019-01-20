/**
 * @flow
 */

import { graphql } from 'gatsby'

export const fetchCtaLinks = graphql`fragment CtaLinks on CtaYaml {
  links {
    title
    href
    icon
  }
}`

export default function selectCtaLinks({
  ctaYaml: {
    links = [],
  } = {},
}: {
  ctaYaml: {
    links: Array<{ title: string, href: string, icon: string }>,
  },
} = {}) {
  return links
}
