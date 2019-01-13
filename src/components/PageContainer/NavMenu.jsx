/**
 * @flow
 */

import React from 'react'
import { Menu } from 'semantic-ui-react'

export default function NavMenu() {
  return (
    <>
      <Menu.Item as="a" active>Home</Menu.Item>
      <Menu.Item as="a">Skills</Menu.Item>
      <Menu.Item as="a">Projects</Menu.Item>
      <Menu.Item as="a">Experience</Menu.Item>
      <Menu.Item as="a">Education</Menu.Item>
    </>
  )
}
