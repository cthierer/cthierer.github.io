/**
 * @flow
 */

import React, { Component } from 'react'
import type { Node } from 'react'
import {
  Container,
  Icon,
  Menu,
  Responsive,
  Segment,
  Sidebar,
} from 'semantic-ui-react'
import NavMenu from './NavMenu'
import breakpoints from '../../theme/breakpoints'

type SidebarPageContainerProps = {
  children: Node,
  siteTitle: string,
}

type SidebarPageContainerState = {
  sidebarOpened: boolean,
}

export default class SidebarPageContainer
  extends Component<SidebarPageContainerProps, SidebarPageContainerState> {
  state = { sidebarOpened: false }

  handleSidebarHide = () => this.setState({ sidebarOpened: false })

  handleToggle = () => this.setState({ sidebarOpened: true })

  render() {
    const { children, siteTitle } = this.props
    const { sidebarOpened } = this.state

    return (
      <Responsive
        as={Sidebar.Pushable}
        maxWidth={breakpoints.xs.maxWidth}
      >
        <Sidebar
          as={Menu}
          animation="push"
          inverted
          onHide={this.handleSidebarHide}
          vertical
          visible={sidebarOpened}
        >
          <NavMenu />
        </Sidebar>
        <Sidebar.Pusher dimmed={sidebarOpened}>
          <Segment inverted vertical>
            <Container>
              <Menu
                inverted
                pointing
                secondary
                size="large"
              >
                <Menu.Item onClick={this.handleToggle}>
                  <Icon name="sidebar" />
                </Menu.Item>
                <Menu.Item>
                  <Menu.Header>{siteTitle}</Menu.Header>
                </Menu.Item>
              </Menu>
            </Container>
          </Segment>

          {children}
        </Sidebar.Pusher>
      </Responsive>
    )
  }
}
