/**
 * @flow
 */

import React from 'react'
import type { Node } from 'react'
import { Item, Label } from 'semantic-ui-react'
import type { DateTime } from 'luxon'
import Duration from '../../../components/Content/Duration'

type WorkExperienceProps = {
  title: string,
  organization: string,
  dateStart: ?DateTime,
  dateEnd?: ?DateTime,
  logo?: string,
  children: Node,
  tags?: string[],
}

function WorkExperience({
  title,
  organization,
  dateStart,
  dateEnd,
  logo,
  children,
  tags = [],
}: WorkExperienceProps) {
  return (
    <Item>
      {logo && <Item.Image size="tiny" src={logo} />}
      <Item.Content verticalAlign="middle">
        <Item.Header>
          {`${title}, ${organization}`}
        </Item.Header>
        <Item.Meta>
          <Duration dateStart={dateStart} dateEnd={dateEnd} dateEndDefault="present" />
        </Item.Meta>
        <Item.Description>
          {children}
        </Item.Description>
        <Item.Extra>
          <Label.Group>
            {tags.map(tag => (
              <Label key={tag}>{tag}</Label>
            ))}
          </Label.Group>
        </Item.Extra>
      </Item.Content>
    </Item>
  )
}

WorkExperience.defaultProps = {
  logo: undefined,
  dateEnd: undefined,
  tags: [],
}

export default WorkExperience
