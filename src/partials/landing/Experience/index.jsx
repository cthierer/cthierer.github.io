/**
 * @flow
 */

import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import { Item } from 'semantic-ui-react'
import { DateTime } from 'luxon'
import injectStyles from 'react-jss'
import NavigableSection from '../../../containers/NavigableSection'
import WorkExperience from './WorkExperience'

const styles = {
  experienceList: {
    marginTop: '3em',
  },
}

type ExperienceSectionProps = {
  classes: { [string]: string },
}

function ExperienceSection({
  classes,
}: ExperienceSectionProps) {
  return (
    <StaticQuery
      query={graphql`{
        markdownRemark(frontmatter: { slug: { eq: "experience" } feed:{ eq: "landing" } }) {
          frontmatter {
            title
          }
          html
        }
        allMarkdownRemark(
          filter: { frontmatter: { feed: { eq: "experience" } } }
          sort: { fields: frontmatter___start_date order: DESC }
        ) {
          edges {
            node {
              frontmatter {
                title
                company
                role
                start_date
                end_date
                logo {
                  link {
                    childImageSharp {
                      resize(width:80 height:80 quality:100 toFormat:PNG) {
                        src
                      }
                    }
                  }
                }
                tags
              }
              html
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
          edges: experiences = [],
        } = {},
      }) => (
        <NavigableSection id="experience" title={sectionTitle} routable>
          <div className={classes.experienceList}>
            <Item.Group divided relaxed="very">
              {experiences.map(({
                node: {
                  frontmatter: {
                    title,
                    company,
                    role,
                    start_date: startDate,
                    end_date: endDate,
                    tags = [],
                    logo: {
                      link: {
                        childImageSharp: {
                          resize: {
                            src: logoSrc,
                          } = {},
                        } = {},
                      } = {},
                    } = {},
                  } = {},
                  html,
                } = {},
              } = {}) => (
                <WorkExperience
                  key={title}
                  title={role}
                  organization={company}
                  logo={logoSrc}
                  dateStart={DateTime.fromISO(startDate)}
                  dateEnd={DateTime.fromISO(endDate)}
                  tags={tags}
                >
                  {/* eslint-disable-next-line react/no-danger */}
                  <div dangerouslySetInnerHTML={{ __html: html }} />
                </WorkExperience>
              ))}
            </Item.Group>
          </div>
        </NavigableSection>
      )}
    />

  )
}

export default injectStyles(styles)(ExperienceSection)
