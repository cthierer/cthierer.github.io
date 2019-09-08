/**
 * @flow
 */

import React, { Fragment } from 'react'
import { Segment, Label, Header } from 'semantic-ui-react'

type Library = string

type Skill = {
  title: string,
  libraries: Library[],
}

type Collection = {
  title: string,
  skills: Skill[],
}

type SkillsExplorerProps = {
  collections: Collection[],
}

const colors = ['violet', 'teal', 'yellow', 'grey']

const SkillsExplorer = function SkillsExplorer({
  collections = [],
}: SkillsExplorerProps) {
  return (
    <>
      <Header as="h4" textAlign="center" attached="top" inverted>
        Libraries, frameworks, &amp; technologies
      </Header>
      <Segment padded attached>
        {collections.map(({ title: collectionTitle, skills = [] }, idx) => (
          <Fragment key={collectionTitle}>
            <Label ribbon color={colors[idx]}>
              {collectionTitle}
            </Label>
            <Segment compact basic>
              <Label.Group
                key={collectionTitle}
                color={colors[idx]}
                size="huge"
              >
                {skills.map(({ title: skillTitle, libraries = [] }) => (
                  <>
                    <Label>{skillTitle}</Label>
                    {libraries
                      && libraries.length > 0
                      && libraries.map(library => (
                        <Label key={library}>{library}</Label>
                      ))}
                  </>
                ))}
              </Label.Group>
            </Segment>
          </Fragment>
        ))}
      </Segment>
    </>
  )
}

export default SkillsExplorer
