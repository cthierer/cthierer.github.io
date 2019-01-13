/**
 * @flow
 */

import React from 'react'
import type { Node } from 'react'
import TopbarPageContainer from './TopbarPageContainer'
import SidebarPageContainer from './SidebarPageContainer'

type NavBarProps = {
  children: Node,
  siteTitle: string,
}

export default function render({ children, siteTitle }: NavBarProps) {
  return (
    <>
      <TopbarPageContainer siteTitle={siteTitle}>{children}</TopbarPageContainer>
      <SidebarPageContainer siteTitle={siteTitle}>{children}</SidebarPageContainer>
    </>
  )
}
