/**
 * @flow
 */

import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import injectStyles from 'react-jss'
import { Grid } from 'semantic-ui-react'
import NavigableSection from '../../../containers/NavigableSection'
import LeadParagraph from '../../../components/Content/LeadParagraph'
import SkillsExplorer from './SkillsExplorer'

const styles = {
  skillsList: {
    '& li': {
      marginBottom: '.5em',
    },
  },
}

type SkillsSectionProps = {
  classes: { [string]: string },
}

function SkillsSection({ classes }: SkillsSectionProps) {
  return (
    <StaticQuery
      query={graphql`{
        markdownRemark(
          frontmatter: { slug: { eq: "skills" } feed: { eq: "landing" } }
        ) {
          frontmatter {
            title
            skillsExplorer {
              title
              skills {
                title
                libraries
              }
            }
          }
          html
        }
      }`}
      render={data => (
        <NavigableSection id="skills" title={data.markdownRemark.frontmatter.title} routable>
          <Grid container stackable verticalAlign="top">
            <Grid.Row>
              <Grid.Column width={9}>
                <LeadParagraph as="div">
                  {/* eslint-disable react/no-danger */}
                  <div
                    className={classes.skillsList}
                    dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }}
                  />
                  {/* eslint-enable react/no-danger */}
                </LeadParagraph>
              </Grid.Column>
              <Grid.Column width={7}>
                <SkillsExplorer collections={data.markdownRemark.frontmatter.skillsExplorer} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </NavigableSection>
      )}
    />

  )
}

export default injectStyles(styles)(SkillsSection)
