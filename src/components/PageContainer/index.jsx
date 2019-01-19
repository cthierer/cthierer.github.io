/**
 * @flow
 */

import React from 'react'
import type { Node, Element } from 'react'
import TopbarPageContainer from './TopbarPageContainer'
import SidebarPageContainer from './SidebarPageContainer'

type PageContainerProps = {
  children: Node,
  siteTitle: string,
  navMenu: Element<*>,
}

export default function render({ children, siteTitle, navMenu }: PageContainerProps) {
  return (
    <>
      <TopbarPageContainer
        siteTitle={siteTitle}
        navMenu={navMenu}
      >
        {children}
      </TopbarPageContainer>
      <SidebarPageContainer
        siteTitle={siteTitle}
        navMenu={navMenu}
      >
        {children}
      </SidebarPageContainer>
    </>
  )
}
