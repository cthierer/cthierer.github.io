/**
 * @flow
 */

import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import Footer from '../components/Footer'
import selectCtaLinks from '../data/ctaLinks'

function selectNav({ allNavYaml: { edges = [] } = {} } = {}) {
  return edges.map(({ node }) => node)
}

function selectAddress({
  allProfileYaml: {
    edges: [{ node: { address } = {} } = {}] = [],
  } = {},
} = {}) {
  return address
}

function selectEmail({
  allProfileYaml: {
    edges: [{ node: { contact: { email_main: email } = {} } = {} } = {}] = [],
  } = {},
} = {}) {
  return email
}

export default () => (
  <StaticQuery
    query={graphql`
    {
      allNavYaml {
        edges {
          node {
            id
            route
            title
          }
        }
      }
      allProfileYaml {
        edges {
          node {
            address {
              street
              city
              state
              zip
            }
            contact {
              email_main
            }
          }
        }
      }
      ctaYaml {
        ...CtaLinks
      }
    }`}
    render={data => (
      <Footer
        navItems={selectNav(data)}
        address={selectAddress(data)}
        email={selectEmail(data)}
        cta={selectCtaLinks(data)}
      />
    )}
  />
)
