/**
 * @flow
 */

import React, { Component, Fragment } from 'react'
import {
  Segment, Accordion, List, Icon,
} from 'semantic-ui-react'

/* global Event */

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

type SkillsExplorerState = {
  activeIndex: number,
}

class SkillsExplorer extends Component<
  SkillsExplorerProps,
  SkillsExplorerState,
> {
  state = { activeIndex: 0 }

  handleClick = (e: Event, { index }: { index: number }) => {
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  render() {
    const { activeIndex } = this.state
    const { collections = [] } = this.props

    return (
      <Segment inverted>
        <Accordion inverted>
          {collections.map(({ title: collectionTitle, skills }, idx) => (
            <Fragment key={collectionTitle}>
              <Accordion.Title
                active={activeIndex === idx}
                index={idx}
                onClick={this.handleClick}
              >
                <Icon name="dropdown" />
                {collectionTitle}
              </Accordion.Title>
              <Accordion.Content active={activeIndex === idx}>
                <List inverted celled>
                  {skills.map(({ title: skillTitle, libraries = [] }) => (
                    <List.Item key={skillTitle}>
                      <List.Header>{skillTitle}</List.Header>
                      {libraries && libraries.length > 0 && (
                        <List.List>
                          {libraries.map(library => (
                            <List.Item key={library} content={library} />
                          ))}
                        </List.List>
                      )}
                    </List.Item>
                  ))}
                </List>
              </Accordion.Content>
            </Fragment>
          ))}
        </Accordion>
      </Segment>
    )
  }
}

export default SkillsExplorer
