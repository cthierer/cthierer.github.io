/**
 * @flow
 */

import 'semantic-ui-css/semantic.min.css'

import React from 'react'
import type { Node } from 'react'
import { StaticQuery, graphql } from 'gatsby'
import PageContainer from '../components/PageContainer'
import Footer from '../components/Footer'
import AppNavMenu from './AppNavMenu'

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
      <PageContainer siteTitle={data.site.siteMetadata.title} navMenu={(<AppNavMenu />)}>
        {children}
        <Footer />
      </PageContainer>
    )}
  />
)

export default Layout
