/**
 * @flow
 */

import React from 'react'
import type { Node } from 'react'
import injectStyles from 'react-jss'
import { important } from '../../theme/utils'

const styles = {
  lead: {
    fontSize: important('1.33em'),
    '&, & p': {
      marginTop: '.5em',
      marginBottom: '.5em',
    },
  },
}

type LeadParagraphProps = {
  as?: string,
  classes: { [string]: string },
  children: Node,
  className?: string,
}

function LeadParagraph({
  as: ContentElement = 'p',
  classes,
  children,
  className = '',
}: LeadParagraphProps) {
  return (
    <ContentElement className={`${classes.lead} ${className}`}>
      {children}
    </ContentElement>
  )
}

LeadParagraph.defaultProps = {
  as: 'p',
  className: '',
}

export default injectStyles(styles)(LeadParagraph)
