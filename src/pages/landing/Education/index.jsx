/**
 * @flow
 */

import React from 'react'
import { Item } from 'semantic-ui-react'
import { DateTime } from 'luxon'
import NavigableSection from '../../../containers/NavigableSection'
import umbcLogo from '../../../../content/experience/umbc_logo.jpg'
import DegreeDescription from './DegreeDescription'

function EducationSection() {
  return (
    <NavigableSection id="education" title="Education" routable>
      <Item.Group>
        <Item>
          <Item.Image size="tiny" src={umbcLogo} />
          <DegreeDescription
            level="Bachelors of Science"
            program="Computer Science"
            date={DateTime.fromObject({ month: 5, year: 2011 })}
            gpa={3.8}
            honors={['Magna cum laude']}
            relatedCoursework={['course1', 'course2', 'course3', 'course4']}
          >
            <p>Lorem ipsum</p>
            <ul>
              <li>item1</li>
              <li>item2</li>
              <li>item3</li>
            </ul>
          </DegreeDescription>
          <DegreeDescription
            level="Masters of Science"
            program="Information Systems"
            date={DateTime.fromObject({ month: 5, year: 2015 })}
            gpa={3.73}
            relatedCoursework={['course1', 'course2', 'course3']}
          >
            <p>Lorem ipsum</p>
            <ul>
              <li>item1</li>
              <li>item2</li>
              <li>item3</li>
            </ul>
          </DegreeDescription>
        </Item>
      </Item.Group>
    </NavigableSection>
  )
}

export default EducationSection
