/**
 * @flow
 */

import React from 'react'
import type { Node } from 'react'
import { Item, List } from 'semantic-ui-react'
import type { DateTime } from 'luxon'

type DegreeDescriptionProps = {
  children: Node,
  level: string,
  program: string,
  date: DateTime,
  gpa?: number,
  honors?: string[],
  relatedCoursework?: string[],
}

function DegreeDescription({
  children,
  level,
  program,
  date,
  gpa,
  honors,
  relatedCoursework,
}: DegreeDescriptionProps) {
  return (
    <Item.Content>
      <Item.Header>
        {`${level}, ${program}`}
      </Item.Header>
      <Item.Meta>
        {`${date.monthShort}. ${date.year}`}
      </Item.Meta>
      <Item.Description>
        <List>
          {gpa && (
            <List.Item>
              <List.Header>GPA</List.Header>
              {`${gpa} / 4.0`}
            </List.Item>
          )}
          {honors.length > 0 && (
            <List.Item>
              <List.Header>Honors</List.Header>
              <List>
                {honors.map(honor => (<List.Item>{honor}</List.Item>))}
              </List>
            </List.Item>
          )}
          {relatedCoursework.length > 0 && (
            <List.Item>
              <List.Header>Related coursework</List.Header>
              <List>
                {relatedCoursework.map(course => (<List.Item>{course}</List.Item>))}
              </List>
            </List.Item>
          )}
        </List>
      </Item.Description>
      <Item.Description>
        {children}
      </Item.Description>
    </Item.Content>
  )
}

DegreeDescription.defaultProps = {
  gpa: 0,
  honors: [],
  relatedCoursework: [],
}

export default DegreeDescription
