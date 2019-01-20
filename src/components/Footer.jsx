/**
 * @flow
 */

import React from 'react'
import {
  Segment,
  Container,
  Grid,
  Header,
  List,
  Menu,
} from 'semantic-ui-react'
import { navigate } from 'gatsby'
import injectStyles from 'react-jss'
import { important } from '../theme/utils'

const styles = {
  siteFooter: {
    padding: important('5em 0'),
  },
}

type FooterProps = {
  classes: { [string]: string },
  navItems?: Array<{ id: string, route: string, title: string }>,
}

function Footer({ classes, navItems = [] }: FooterProps) {
  return (
    <Segment inverted vertical className={classes.siteFooter}>
      <Container>
        <Grid divided inverted stackable>
          <Grid.Row>
            <Grid.Column width={4}>
              <Header inverted as="h4">Chris Thierer</Header>
              <List inverted>
                <List.Item>
                  <p>Catonsville, MD</p>
                </List.Item>
                <List.Item>
                  <p>hello@christhierer.com</p>
                </List.Item>
                <List.Item>
                  <List link horizontal inverted>
                    <List.Item>GitHub</List.Item>
                    <List.Item>LinkedIn</List.Item>
                  </List>
                </List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={4}>
              <Header inverted as="h4">Links</Header>
              <Menu compact inverted vertical borderless>
                <List link inverted>
                  {navItems.map(({ id, title, route }) => (
                    <List.Item key={id} as="a" onClick={() => navigate(route)}>
                      {title}
                    </List.Item>
                  ))}
                </List>
              </Menu>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </Segment>
  )
}

Footer.defaultProps = {
  navItems: [],
}

export default injectStyles(styles)(Footer)
