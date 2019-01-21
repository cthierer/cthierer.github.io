/**
 * @flow
 */

import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import { Item, Grid } from 'semantic-ui-react'
import { DateTime } from 'luxon'
import injectStyles from 'react-jss'
import NavigableSection from '../../../containers/NavigableSection'
import DegreeDescription from './DegreeDescription'

const styles = {
  schoolList: {
    marginTop: '3em',
  },
}

type EducationSectionProps = {
  classes: { [string]: string },
}

function EducationSection({
  classes,
}: EducationSectionProps) {
  return (
    <StaticQuery
      query={graphql`{
        markdownRemark(frontmatter: { slug: { eq: "education" } feed:{ eq: "landing" } }) {
          frontmatter {
            title
          }
          html
        }
        allMarkdownRemark(
          filter: { frontmatter: { feed: { eq: "education" } } }
          sort: { fields: frontmatter___end_date order: ASC }
        ) {
          group(field:frontmatter___affiliation) {
            fieldValue
            edges {
              node {
                html
                frontmatter {
                  title
                  degree
                  program
                  honors
                  end_date
                  coursework {
                    title
                  }
                  logo {
                    link {
                      childImageSharp {
                        resize(width:100 height:100 quality:100) {
                          src
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }`}
      render={({
        markdownRemark: {
          frontmatter: {
            title: sectionTitle,
          } = {},
        } = {},
        allMarkdownRemark: {
          // $FlowFixMe doesn't support grouped properties here
          group: schools = [],
        } = [],
      }) => (
        <NavigableSection id="education" title={sectionTitle} routable>
          <div className={classes.schoolList}>
            {schools.map(({
              fieldValue,
              edges: degrees = [],
            }) => (
              <Item.Group key={fieldValue}>
                <Item>
                  <Item.Image size="tiny" src={degrees[0].node.frontmatter.logo.link.childImageSharp.resize.src} />
                  <Item.Content>
                    <Grid stackable>
                      <Grid.Row columns={degrees.length}>
                        {degrees.map(({
                          node: {
                            frontmatter: {
                              title: degreeTitle,
                              degree,
                              program,
                              honors = [],
                              end_date: endDate,
                              coursework = [],
                            } = {},
                            html: description,
                          } = {},
                        }) => (
                          <Grid.Column key={degreeTitle}>
                            <DegreeDescription
                              level={degree}
                              program={program}
                              date={DateTime.fromISO(endDate)}
                              honors={honors || []}
                              relatedCoursework={coursework.map(({ title }) => title)}
                            >
                              {/* eslint-disable-next-line react/no-danger */}
                              <div dangerouslySetInnerHTML={{ __html: description }} />
                            </DegreeDescription>
                          </Grid.Column>
                        ))}
                      </Grid.Row>
                    </Grid>
                  </Item.Content>
                </Item>
              </Item.Group>
            ))}
          </div>
        </NavigableSection>
      )}
    />
  )
}

export default injectStyles(styles)(EducationSection)
