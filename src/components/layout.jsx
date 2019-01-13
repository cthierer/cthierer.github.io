/**
 * @flow
 */

import React from 'react'
import type { Node } from 'react'
import { StaticQuery, graphql } from 'gatsby'
import 'semantic-ui-css/semantic.min.css'
import PageContainer from './PageContainer'
import Footer from './Footer'

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
      <PageContainer siteTitle={data.site.siteMetadata.title}>
        {children}
        <Footer />
      </PageContainer>
    )}
  />
)

export default Layout
