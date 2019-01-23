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
  Icon,
} from 'semantic-ui-react'
import { navigate } from 'gatsby'
import injectStyles from 'react-jss'
import Address from './Content/Address'
import type { AddressProps } from './Content/Address'
import { important } from '../theme/utils'

const styles = {
  siteFooter: {
    padding: important('5em 0'),
  },
  address: {
    fontStyle: important('normal'),
  },
}

type FooterProps = {
  classes: { [string]: string },
  navItems?: Array<{ id: string, route: string, title: string }>,
  address?: AddressProps,
  email?: string,
  cta?: Array<{ title: string, href: string, icon: string}>,
}

function Footer({
  classes,
  navItems = [],
  address,
  email,
  cta = [],
}: FooterProps) {
  return (
    <Segment inverted vertical className={classes.siteFooter}>
      <Container>
        <Grid divided inverted stackable>
          <Grid.Row>
            <Grid.Column as="address" width={4} className={classes.address}>
              <Header size="large" inverted as="h4">Chris Thierer</Header>
              <List inverted relaxed>
                {address && (
                  <List.Item>
                    <Address {...address} />
                  </List.Item>
                )}
                {email && (
                  <List.Item>
                    <a href={`mailto:${email}`}>{email}</a>
                  </List.Item>
                )}
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
            <Grid.Column width={8}>
              <List size="huge" inverted relaxed animated>
                {cta.map(({
                  title,
                  href,
                  route,
                  icon,
                }) => (
                  <List.Item key={href} as="a" href={href} onClick={route ? () => navigate(route) : undefined}>
                    {icon && <Icon name={icon} />}
                    <List.Content>{title}</List.Content>
                  </List.Item>
                ))}
              </List>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </Segment>
  )
}

Footer.defaultProps = {
  navItems: [],
  address: undefined,
  email: undefined,
  cta: [],
}

export default injectStyles(styles)(Footer)
