/**
 * @flow
 */

import React from 'react'
import { Item } from 'semantic-ui-react'
import { DateTime } from 'luxon'
import NavigableSection from '../../../containers/NavigableSection'
import WorkExperience from './WorkExperience'

function ExperienceSection() {
  return (
    <NavigableSection id="experience" title="Experience" routable>
      <Item.Group>
        <WorkExperience
          title="Senior Web Engineer"
          organization="Bethesda Softworks"
          dateStart={DateTime.fromObject({ month: 6, year: 2016 })}
          responsibilities={['thing1', 'thing2', 'thing3']}
        />
      </Item.Group>
    </NavigableSection>
  )
}

export default ExperienceSection
