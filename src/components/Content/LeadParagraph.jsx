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
  },
}

type LeadParagraphProps = {
  as?: string,
  classes: { [string]: string },
  children: Node,
}

function LeadParagraph({ as: ContentElement = 'p', classes, children }: LeadParagraphProps) {
  return (
    <ContentElement className={classes.lead}>
      {children}
    </ContentElement>
  )
}

LeadParagraph.defaultProps = {
  as: 'p',
}

export default injectStyles(styles)(LeadParagraph)
