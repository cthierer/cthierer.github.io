/**
 * @flow
 */

import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import { Card } from 'semantic-ui-react'
import { DateTime } from 'luxon'
import injectStyles from 'react-jss'
import NavigableSection from '../../../containers/NavigableSection'
import LeadParagraph from '../../../components/Content/LeadParagraph'
import ProjectCard from './ProjectCard'
import formatMarkdown from '../../../content/formatMarkdown'

const styles = {
  projectCards: {
    marginTop: '3em',
  },
}

type ProjectsSectionProps = {
  classes: { [string]: string },
}

function ProjectsSection({ classes }: ProjectsSectionProps) {
  return (
    <StaticQuery
      query={graphql`{
        markdownRemark(frontmatter: { slug: { eq: "projects" } feed:{ eq: "landing" } }) {
          frontmatter {
            title
          }
          html
        }
        allMarkdownRemark(
          filter: { frontmatter: { feed: { eq: "projects" } } }
          sort: { fields: frontmatter___start_date order: DESC }
        ) {
          edges {
            node {
              frontmatter {
                title
                route
                description
                start_date
                end_date
                color {
                  bg
                }
                logo {
                  link {
                    publicURL
                  }
                }
                tags
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
          html: intro,
        },
        allMarkdownRemark: {
          edges: projects = [],
        },
      }) => (
        <NavigableSection id="projects" title={sectionTitle} routable>
          <LeadParagraph as="div">
            {/* eslint-disable react/no-danger */}
            <div
              dangerouslySetInnerHTML={{ __html: intro }}
            />
            {/* eslint-enable react/no-danger */}
          </LeadParagraph>
          <div className={classes.projectCards}>
            <Card.Group centered itemsPerRow={3} stackable>
              {projects.map(({
                node: {
                  frontmatter: {
                    title: projectName,
                    route,
                    description,
                    start_date: startDate,
                    end_date: endDate,
                    color: {
                      bg: colorBg,
                    } = {},
                    logo: {
                      link: {
                        publicURL: logoUrl,
                      },
                    },
                    tags = [],
                  } = {},
                } = {},
              }) => (
                <ProjectCard
                  key={route}
                  logo={logoUrl}
                  name={projectName}
                  color={colorBg}
                  dateStart={startDate ? DateTime.fromISO(startDate) : null}
                  dateEnd={endDate ? DateTime.fromISO(endDate) : null}
                  tags={tags}
                  route={route}
                >
                  {formatMarkdown(description)}
                </ProjectCard>
              ))}
            </Card.Group>
          </div>
        </NavigableSection>
      )}
    />

  )
}

export default injectStyles(styles)(ProjectsSection)
