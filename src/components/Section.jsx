/**
 * @flow
 */

import React from 'react'
import type { Node } from 'react'
import { Segment, Header, Container } from 'semantic-ui-react'
import injectStyles from 'react-jss'
import { important } from '../theme/utils'

const styles = {
  section: {
    padding: important('8em 0'),
  },
  sectionHeader: {
    fontSize: important('2em'),
  },
}

export type SectionProps = {
  children: Node,
  classes: { [string]: string },
  title: string,
}

function Section({ children, classes, title }: SectionProps) {
  return (
    <Segment className={classes.section} vertical>
      <Container text>
        <Header as="h3" className={classes.sectionHeader}>
          {title}
        </Header>
        {children}
      </Container>
    </Segment>
  )
}

export default injectStyles(styles)(Section)
