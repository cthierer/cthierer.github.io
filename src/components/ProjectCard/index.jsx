/**
 * @flow
 */

import React from 'react'
import type { Node } from 'react'
import {
  Card,
  Image,
  List,
  Label,
} from 'semantic-ui-react'
import injectStyles from 'react-jss'
import type { DateTime } from 'luxon'
import Duration from '../Duration'

const styles = {
  projectLogoWrapper: {
    height: '160px',
    padding: '1em',
  },
}

type ProjectCardProps = {
  children: Node,
  classes: { [string]: string },
  color?: string,
  logo?: ?string,
  name: string,
  dateStart?: ?DateTime,
  dateEnd?: ?DateTime,
  tags?: string[],
}

function ProjectCard({
  children,
  classes,
  color,
  logo,
  name,
  dateStart,
  dateEnd,
  tags,
}: ProjectCardProps) {
  return (
    <Card>
      <div className={classes.projectLogoWrapper} style={{ backgroundColor: color }}>
        {logo && <Image size="tiny" centered src={logo} />}
      </div>
      <Card.Content>
        <Card.Header>{name}</Card.Header>
        <Card.Meta>
          <Duration dateStart={dateStart} dateEnd={dateEnd} />
        </Card.Meta>
        <Card.Description>
          {children}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <List horizontal>
          {tags.map(tag => (<List.Item><Label>{tag}</Label></List.Item>))}
        </List>
      </Card.Content>
    </Card>
  )
}

ProjectCard.defaultProps = {
  logo: null,
  color: '#dcdcdc',
  dateStart: null,
  dateEnd: null,
  tags: [],
}

export default injectStyles(styles)(ProjectCard)
