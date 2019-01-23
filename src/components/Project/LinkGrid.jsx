/**
 * @flow
 */

import React, { Children } from 'react'
import type { Node } from 'react'
import { Grid } from 'semantic-ui-react'

type LinkGridProps = {
  children: Node,
}

function LinkGrid({
  children,
}: LinkGridProps) {
  const childArr = Children.toArray(children)
  const numChildren = childArr.length

  if (numChildren < 1) {
    return <></>
  }

  return (
    <Grid columns={2} stretched padded>
      <Grid.Row>
        <Grid.Column>{childArr[0]}</Grid.Column>
        {childArr[1] && <Grid.Column>{childArr[1]}</Grid.Column>}
      </Grid.Row>
      {numChildren > 2 && (
        <Grid.Row>
          <Grid.Column>{childArr[2]}</Grid.Column>
          {childArr[3] && <Grid.Column>{childArr[3]}</Grid.Column>}
        </Grid.Row>
      )}
    </Grid>
  )
}

export default LinkGrid
