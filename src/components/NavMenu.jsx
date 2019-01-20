/**
 * @flow
 */

import React from 'react'
import { navigate } from 'gatsby'
import { Menu } from 'semantic-ui-react'

export type NavMenuProps = {
  active?: string,
}

function NavMenu({
  active,
}: NavMenuProps) {
  return (
    <>
      <Menu.Item active={active === 'home'} link content="Home" onClick={() => navigate('/#/')} />
      <Menu.Item active={active === 'skills'} link content="Skills" onClick={() => navigate('/#/skills')} />
      <Menu.Item active={active === 'projects'} link content="Projects" onClick={() => navigate('/#/projects')} />
      <Menu.Item active={active === 'experience'} link content="Experience" onClick={() => navigate('/#/experience')} />
      <Menu.Item active={active === 'education'} link content="Education" onClick={() => navigate('/#/education')} />
    </>
  )
}

NavMenu.defaultProps = {
  active: 'home',
}

export default NavMenu
