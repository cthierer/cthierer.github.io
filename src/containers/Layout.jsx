/**
 * @flow
 */

import React from 'react'
import type { Node } from 'react'
import { StaticQuery, graphql } from 'gatsby'
import AppNavMenu from './AppNavMenu'
import AppFooter from './AppFooter'

type LayoutProps = {
  activeSection?: string,
  children: Node,
}

const Layout = ({ children, activeSection }: LayoutProps) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={() => (
      <>
        <AppNavMenu activeSection={activeSection} />
        {children}
        <AppFooter />
      </>
    )}
  />
)

Layout.defaultProps = {
  activeSection: undefined,
}

export default Layout
