/**
 * @flow
 */

import React, { Component } from 'react'
import type { Node, Element } from 'react'
import {
  Container,
  Menu,
  Responsive,
  Segment,
  Visibility,
} from 'semantic-ui-react'
import injectStyles from 'react-jss'
import breakpoints from '../../theme/breakpoints'
import { important } from '../../theme/utils'

const styles = {
  topBar: {
    borderRadius: important('0'),
  },
}

type TopbarPageContainerProps = {
  children: Node,
  siteTitle: string,
  classes: { [string]: string },
  navMenu: Element<*>,
}

type TopbarPageContainerState = {
  fixed: boolean,
}

class TopbarPageContainer extends Component<
  TopbarPageContainerProps,
  TopbarPageContainerState,
> {
  state = { fixed: false }

  hideFixedMenu = () => this.setState({ fixed: false })

  showFixedMenu = () => this.setState({ fixed: true })

  render() {
    const {
      children,
      classes,
      siteTitle,
      navMenu,
    } = this.props
    const { fixed } = this.state

    return (
      <Responsive minWidth={breakpoints.sm.minWidth}>
        <Visibility
          once={false}
          onBottomPassed={this.showFixedMenu}
          onBottomPassedReverse={this.hideFixedMenu}
        >
          <Segment className={classes.topBar} inverted>
            <Menu
              fixed={fixed ? 'top' : null}
              inverted
              pointing={!fixed}
              secondary={!fixed}
              size="large"
            >
              <Container>
                <Menu.Item>
                  <Menu.Header content={siteTitle} />
                </Menu.Item>
                {navMenu}
              </Container>
            </Menu>
          </Segment>
        </Visibility>

        {children}
      </Responsive>
    )
  }
}

export default injectStyles(styles)(TopbarPageContainer)
