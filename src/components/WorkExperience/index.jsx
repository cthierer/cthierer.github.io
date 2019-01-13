/**
 * @flow
 */

import React from 'react'
import { Item } from 'semantic-ui-react'
import type { DateTime } from 'luxon'
import Duration from '../Duration'
import BethesdaLogo from '../../../content/experience/bethesda_logo.jpg'

type WorkExperienceProps = {
  title: string,
  organization: string,
  dateStart: ?DateTime,
  dateEnd: ?DateTime,
  responsibilities: string[],
}

function WorkExperience({
  title,
  organization,
  dateStart,
  dateEnd,
  responsibilities,
}: WorkExperienceProps) {
  return (
    <Item>
      <Item.Image size="tiny" src={BethesdaLogo} />
      <Item.Content>
        <Item.Header>
          {`${title}, ${organization}`}
        </Item.Header>
        <Item.Meta>
          <Duration dateStart={dateStart} dateEnd={dateEnd} dateEndDefault="present" />
        </Item.Meta>
        <Item.Description>
          <ul>
            {responsibilities.map(responsibility => (<li>{responsibility}</li>))}
          </ul>
        </Item.Description>
      </Item.Content>
    </Item>
  )
}

export default WorkExperience
