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
  honors?: string[],
  relatedCoursework?: string[],
}

function DegreeDescription({
  children,
  level,
  program,
  date,
  honors = [],
  relatedCoursework = [],
}: DegreeDescriptionProps) {
  return (
    <Item>
      <Item.Content>
        <Item.Header as="h4" style={{ marginBottom: 0 }}>
          {`${level}, ${program}`}
        </Item.Header>
        <Item.Meta>
          {`${date.monthShort} ${date.year}`}
        </Item.Meta>
        <Item.Description>
          <List>
            {honors.length > 0 && (
              <List.Item>
                <List.Header>Honors</List.Header>
                <List>
                  {honors.map(honor => (
                    <List.Item key={honor}><em>{honor}</em></List.Item>
                  ))}
                </List>
              </List.Item>
            )}
            {relatedCoursework.length > 0 && (
              <List.Item>
                <List.Header>Related coursework</List.Header>
                <List>
                  {relatedCoursework.map(course => (
                    <List.Item key={course}>{course}</List.Item>
                  ))}
                </List>
              </List.Item>
            )}
          </List>
        </Item.Description>
        <Item.Description style={{ marginTop: '2em' }}>
          {children}
        </Item.Description>
      </Item.Content>
    </Item>
  )
}

DegreeDescription.defaultProps = {
  honors: [],
  relatedCoursework: [],
}

export default DegreeDescription
