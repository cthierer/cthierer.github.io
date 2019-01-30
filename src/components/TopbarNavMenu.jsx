/**
 * @flow
 */

import React, { Component, Fragment } from 'react'
import { navigate } from 'gatsby'
import {
  Container,
  Menu,
  Responsive,
  Segment,
  Icon,
  Transition,
} from 'semantic-ui-react'
import injectStyles from 'react-jss'
import breakpoints from '../theme/breakpoints'
import { important } from '../theme/utils'

const styles = {
  topBar: {
    borderRadius: important('0'),
    margin: important('0'),
  },
  navMenu: {
    margin: important('0'),
  },
  fixed: {
    position: important('fixed'),
    top: important('0'),
    width: important('100%'),
    zIndex: important('201'),
  },
  fullWidth: {
    width: important('100%'),
  },
}

export type TopbarNavMenuProps = {
  siteTitle: string,
  classes: { [string]: string },
  activeNavItem?: string,
  navItems?: Array<{ id: string, route: string, title: string }>,
  affixNavMenu?: boolean,
  icon?: string,
}

type TopbarNavMenuState = {
  navMenuExpanded: boolean,
}

class TopbarNavMenu extends Component<TopbarNavMenuProps, TopbarNavMenuState> {
  static defaultProps = {
    activeNavItem: undefined,
    navItems: [],
    affixNavMenu: false,
    icon: undefined,
  }

  state = { navMenuExpanded: false }

  expandNavMenu = () => this.setState({ navMenuExpanded: true })

  collapseNavMenu = () => this.setState({ navMenuExpanded: false })

  toggleNavMenu = () => {
    const { navMenuExpanded = false } = this.state

    if (navMenuExpanded) {
      this.collapseNavMenu()
    } else {
      this.expandNavMenu()
    }
  }

  render() {
    const {
      classes,
      siteTitle,
      activeNavItem,
      navItems = [],
      affixNavMenu = false,
      icon,
    } = this.props
    const { navMenuExpanded = false } = this.state

    return (
      <Segment
        inverted
        className={`${classes.topBar} ${affixNavMenu ? classes.fixed : ''}`}
      >
        <Menu
          className={classes.navMenu}
          inverted
          pointing
          secondary
          size="large"
        >
          <Container>
            <Menu.Item>
              {icon && <Icon name={icon} />}
              &nbsp;
              <Menu.Header content={siteTitle} />
            </Menu.Item>
            <Responsive as={Fragment} minWidth={breakpoints.sm.minWidth}>
              {navItems.map(({ id, route, title }) => (
                <Menu.Item
                  key={id}
                  active={activeNavItem === id}
                  link
                  onClick={() => navigate(route)}
                >
                  {title}
                </Menu.Item>
              ))}
            </Responsive>
            <Responsive as={Fragment} maxWidth={breakpoints.xs.maxWidth}>
              <Menu.Item onClick={this.toggleNavMenu} position="right">
                <Icon
                  size="large"
                  name={navMenuExpanded ? 'caret up' : 'caret down'}
                />
              </Menu.Item>
            </Responsive>
          </Container>
        </Menu>
        <Responsive as={Fragment} maxWidth={breakpoints.xs.maxWidth}>
          <Transition
            as={Fragment}
            duration={100}
            unmountOnHide
            visible={navMenuExpanded}
            animation="slide down"
          >
            <Container>
              <Menu
                className={classes.fullWidth}
                inverted
                secondary
                vertical
                size="large"
              >
                {navItems.map(({ id, route, title }) => (
                  <Menu.Item
                    position="right"
                    key={id}
                    active={activeNavItem === id}
                    link
                    onClick={() => {
                      this.collapseNavMenu()
                      navigate(route)
                    }}
                  >
                    {title}
                  </Menu.Item>
                ))}
              </Menu>
            </Container>
          </Transition>
        </Responsive>
      </Segment>
    )
  }
}

export default injectStyles(styles)(TopbarNavMenu)
