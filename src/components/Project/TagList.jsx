/**
 @flow
 */

import React from 'react'
import { Header, Label, Segment } from 'semantic-ui-react'

type TagListProps = {
  tags: string[],
  title?: string,
}

function TagList({
  tags = [],
  title,
}: TagListProps) {
  return (
    <Segment basic>
      {title && <Header as="h3">{title}</Header>}
      <Label.Group>
        {tags.map(tag => <Label key={tag}>{tag}</Label>)}
      </Label.Group>
    </Segment>
  )
}

TagList.defaultProps = {
  title: 'Tags',
}

export default TagList
