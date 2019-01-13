/**
 * @flow
 */

import React from 'react'
import { Item } from 'semantic-ui-react'
import { DateTime } from 'luxon'
import Section from '../components/Section'
import WorkExperience from '../components/WorkExperience'

function ExperienceSection() {
  return (
    <Section title="Experience">
      <Item.Group>
        <WorkExperience
          title="Senior Web Engineer"
          organization="Bethesda Softworks"
          dateStart={DateTime.fromObject({ month: 6, year: 2016 })}
          responsibilities={['thing1', 'thing2', 'thing3']}
        />
      </Item.Group>
    </Section>
  )
}

export default ExperienceSection
