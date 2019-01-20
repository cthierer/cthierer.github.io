/**
 * @flow
 */

import 'semantic-ui-css/semantic.min.css'

import React from 'react'
import type { Node } from 'react'
import { StaticQuery, graphql } from 'gatsby'
import AppNavMenu from './AppNavMenu'
import AppFooter from './AppFooter'

type LayoutProps = {
  children: Node,
}

const Layout = ({ children }: LayoutProps) => (
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
    render={data => (
      <>
        <AppNavMenu siteTitle={data.site.siteMetadata.title} />
        {children}
        <AppFooter />
      </>
    )}
  />
)

export default Layout
