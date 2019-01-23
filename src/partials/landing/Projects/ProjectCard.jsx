/**
 * @flow
 */

import React from 'react'
import type { Node } from 'react'
import { navigate } from 'gatsby'
import {
  Card,
  Image,
  Label,
} from 'semantic-ui-react'
import injectStyles from 'react-jss'
import type { DateTime } from 'luxon'
import Duration from '../../../components/Content/Duration'

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
  route: string,
}

function ProjectCard({
  children,
  classes,
  color,
  logo,
  name,
  dateStart,
  dateEnd,
  tags = [],
  route,
}: ProjectCardProps) {
  return (
    <Card link onClick={() => navigate(route)}>
      <div className={classes.projectLogoWrapper} style={{ backgroundColor: color }}>
        {logo && <Image style={{ height: '100%', maxHeight: '100%' }} centered src={logo} />}
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
        <Label.Group>
          {tags.map(tag => (<Label key={tag}>{tag}</Label>))}
        </Label.Group>
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
