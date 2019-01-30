/**
 * @flow
 */

import React from 'react'
import { connect } from 'react-redux'
import { StaticQuery, graphql } from 'gatsby'
import TopbarNavMenu from '../components/TopbarNavMenu'
import type { State } from '../store'

function mapStateToProps(
  { nav: { activeSection, navMenuAffixed = false } = {} }: State,
  {
    activeSection: defaultSection,
  }: {
    activeSection?: string,
  },
) {
  return {
    activeNavItem: activeSection || defaultSection,
    affixNavMenu: navMenuAffixed,
  }
}

function selectNavItems({ allNavYaml: { edges = [] } = {} } = {}) {
  return edges.map(({ node }) => node)
}

function selectProfileName({
  allProfileYaml: { edges: [{ node: { name } = {} } = {}] = [] } = {},
} = {}) {
  return name
}

function selectProfileIcon({
  allProfileYaml: { edges: [{ node: { icon } = {} } = {}] = [] } = {},
} = {}) {
  return icon
}

export default connect(mapStateToProps)(props => (
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
              name
              icon
            }
          }
        }
      }
    `}
    render={data => (
      <TopbarNavMenu
        navItems={selectNavItems(data)}
        siteTitle={selectProfileName(data)}
        icon={selectProfileIcon(data)}
        {...props}
      />
    )}
  />
))
