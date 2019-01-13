/**
 * @flow
 */

import React, { Component } from 'react'
import { Segment, Accordion } from 'semantic-ui-react'

type SkillsExplorerProps = {}

type SkillsExplorerState = {
  activeIndex: number,
}

class SkillsExplorer extends Component<SkillsExplorerProps, SkillsExplorerState> {
  state = { activeIndex: 0 }

  handleClick = (e, { index }) => {
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  render() {
    const { activeIndex } = this.state

    return (
      <Segment inverted>
        <Accordion inverted>
          <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick}>
            Clientside
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 0}>
            <ul>
              <li><p>client1</p></li>
              <li><p>client2</p></li>
            </ul>
          </Accordion.Content>
          <Accordion.Title active={activeIndex === 1} index={1} onClick={this.handleClick}>
            Serverside
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 1}>
            <ul>
              <li><p>server1</p></li>
              <li><p>server2</p></li>
            </ul>
          </Accordion.Content>
        </Accordion>
      </Segment>
    )
  }
}

export default SkillsExplorer
