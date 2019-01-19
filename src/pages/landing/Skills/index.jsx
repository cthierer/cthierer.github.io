/**
 * @flow
 */

import React from 'react'
import { Grid } from 'semantic-ui-react'
import NavigableSection from '../../../containers/NavigableSection'
import LeadParagraph from '../../../components/Content/LeadParagraph'
import SkillsExplorer from './SkillsExplorer'

export default function SkillsSection() {
  return (
    <NavigableSection id="skills" title="Skills">
      <Grid container stackable verticalAlign="middle">
        <Grid.Row>
          <Grid.Column width={8}>
            <ul>
              <li><LeadParagraph>skill 1</LeadParagraph></li>
              <li><LeadParagraph>skill 2</LeadParagraph></li>
              <li><LeadParagraph>skill 3</LeadParagraph></li>
            </ul>
          </Grid.Column>
          <Grid.Column floated="right" width={6}>
            <SkillsExplorer />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </NavigableSection>
  )
}
