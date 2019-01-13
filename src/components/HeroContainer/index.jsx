/**
 * @flow
 */

import React from 'react'
import type { Node } from 'react'
import { Segment } from 'semantic-ui-react'
import injectStyles from 'react-jss'
import breakpoints from '../../theme/breakpoints'
import { important } from '../../theme/utils'

const styles = {
  heroContainer: {
    minHeight: 350,
    padding: important('1em 0'),
  },
  [`@media (min-width: ${breakpoints.sm.minWidth}px)`]: {
    heroContainer: {
      minHeight: 700,
      padding: important('1em 0'),
    },
  },
}

type HeroContainerProps = {
  children: Node,
  classes: { [string]: string },
}

function HeroContainer({ children, classes }: HeroContainerProps) {
  return (
    <Segment inverted textAlign="center" vertical className={classes.heroContainer}>
      {children}
    </Segment>
  )
}

export default injectStyles(styles)(HeroContainer)
