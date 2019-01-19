/**
 * @flow
 */

import React from 'react'
import { Menu } from 'semantic-ui-react'

export type NavMenuProps = {
  active?: string,
}

function NavMenu({
  active,
}: NavMenuProps) {
  return (
    <>
      <Menu.Item
        as="a"
        active={active === 'home'}
      >
        Home
      </Menu.Item>
      <Menu.Item as="a" active={active === 'skills'}>Skills</Menu.Item>
      <Menu.Item as="a" active={active === 'projects'}>Projects</Menu.Item>
      <Menu.Item as="a" active={active === 'experience'}>Experience</Menu.Item>
      <Menu.Item
        as="a"
        active={active === 'education'}
      >
        Education
      </Menu.Item>
    </>
  )
}

NavMenu.defaultProps = {
  active: 'home',
}

export default NavMenu
