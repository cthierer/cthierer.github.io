/**
 * @flow
 */

import React from 'react'
import { connect } from 'react-redux'
import { StaticQuery, graphql } from 'gatsby'
import TopbarNavMenu from '../components/TopbarNavMenu'
import type { State } from '../store'

function mapStateToProps({
  nav: {
    activeSection = 'home',
    navMenuAffixed = false,
  } = {},
}: State) {
  return {
    activeNavItem: activeSection,
    affixNavMenu: navMenuAffixed,
  }
}

function select({ allNavYaml: { edges = [] } = {} } = {}) {
  return edges.map(({ node }) => node)
}

export default connect(mapStateToProps)(({ children, ...props }) => (
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
      <TopbarNavMenu navItems={select(data)} {...props} />
    )}
  />
))
