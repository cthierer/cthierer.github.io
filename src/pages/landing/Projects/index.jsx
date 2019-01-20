/**
 * @flow
 */

import React from 'react'
import { Card } from 'semantic-ui-react'
import { DateTime } from 'luxon'
import NavigableSection from '../../../containers/NavigableSection'
import LeadParagraph from '../../../components/Content/LeadParagraph'
import ProjectCard from './ProjectCard'
import wallabyIcon from '../../../../content/projects/wallaby/wallaby.svg'

function ProjectsSection() {
  return (
    <NavigableSection id="projects" title="Projects" routable>
      <LeadParagraph>
        Lorem ipsum.
      </LeadParagraph>
      <Card.Group centered itemsPerRow={4} stackable>
        <ProjectCard
          logo={wallabyIcon}
          name="wallaby"
          color="#2b76cb"
          dateStart={DateTime.fromObject({ month: 12, year: 2016 })}
          tags={['javascript', 'es6', 'riot', 'express']}
        >
          <p>An injectable application to bookmark your place in the Marvel Comics web reader.</p>
        </ProjectCard>
      </Card.Group>
    </NavigableSection>
  )
}

export default ProjectsSection
