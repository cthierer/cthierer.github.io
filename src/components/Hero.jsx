/**
 * @flow
 */

import React from 'react'
import type { Node } from 'react'
import { Segment, Visibility } from 'semantic-ui-react'
import injectStyles from 'react-jss'
import breakpoints from '../theme/breakpoints'
import { important } from '../theme/utils'

const styles = {
  heroContainer: {
    minHeight: 350,
    padding: important('3em 0'),
  },
  [`@media (min-width: ${breakpoints.sm.minWidth}px)`]: {
    heroContainer: {
      minHeight: 625,
      padding: important('1em 0'),
    },
  },
}

type HeroContainerProps = {
  children: Node,
  classes: { [string]: string },
  onPass?: () => void,
  onPassReverse?: () => void,
  className?: string,
}

function HeroContainer({
  children,
  classes,
  onPass = () => undefined,
  onPassReverse = () => undefined,
  className = '',
}: HeroContainerProps) {
  return (
    <Visibility
      once={false}
      onBottomPassed={onPass}
      onBottomPassedReverse={onPassReverse}
      offset={125}
      updateOn="repaint"
    >
      <Segment inverted textAlign="center" vertical className={`${classes.heroContainer} ${className}`}>
        {children}
      </Segment>
    </Visibility>
  )
}

HeroContainer.defaultProps = {
  onPass: () => null,
  onPassReverse: () => null,
  className: '',
}

export default injectStyles(styles)(HeroContainer)
