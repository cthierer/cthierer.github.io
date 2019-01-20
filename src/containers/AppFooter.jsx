/**
 * @flow
 */

import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import Footer from '../components/Footer'

function select({ allNavYaml: { edges = [] } = {} } = {}) {
  return edges.map(({ node }) => node)
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
    }`}
    render={data => (
      <Footer navItems={select(data)} />
    )}
  />
)
