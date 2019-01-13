/**
 * @flow
 */

import React, { Component } from 'react'
import type { Node } from 'react'
import {
  Container,
  Menu,
  Responsive,
  Segment,
  Visibility,
} from 'semantic-ui-react'
import injectStyles from 'react-jss'
import NavMenu from './NavMenu'
import breakpoints from '../../theme/breakpoints'
import { important } from '../../theme/utils'

const styles = {
  topBar: {
    borderRadius: important(0),
  },
}

type TopbarPageContainerProps = {
  children: Node,
  siteTitle: string,
  classes: { [string]: string },
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
    const { children, classes, siteTitle } = this.props
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
              // inverted={!fixed}
              pointing={!fixed}
              secondary={!fixed}
              size="large"
            >
              <Container>
                <Menu.Item>
                  <Menu.Header content={siteTitle} />
                </Menu.Item>
                <NavMenu />
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
