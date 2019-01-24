/**
 * @flow
 */

/* global window */

import React from 'react'
import injectStyles from 'react-jss'
import {
  Grid,
  List,
  Divider,
  Rail,
  Segment,
  Button,
  Icon,
  Sticky,
} from 'semantic-ui-react'
import { StaticQuery, graphql } from 'gatsby'
import { DateTime } from 'luxon'
import Address from '../components/Content/Address'
import RenderedMarkdown from '../components/Content/RenderedMarkdown'
import Duration from '../components/Content/Duration'
import FullDate from '../components/Content/FullDate'
import SEO from '../components/SEO'
import { important } from '../theme/utils'

const styles = {
  printable: {
    color: '#383838',
    fontSize: '10pt',
    '@media screen': {
      backgroundColor: '#f8f8f8',
      padding: '15px 0',
      minHeight: '100vh',
    },
  },
  container: {
    margin: 'auto',
    position: 'relative',
    '@media screen': {
      backgroundColor: '#fff',
      boxShadow: '#e8e8e8 0 0 20px',
      border: '1px solid #e8e8e8',
      padding: '12.7mm',
      minHeight: '271mm',
      width: '215.9mm',
    },
  },
  centered: {
    textAlign: 'center',
  },
  narrow: {
    margin: important('0'),
    padding: important('0'),
  },
  pageHeader: {
    fontSize: '1.8em',
    paddingBottom: '.2em',
    marginBottom: '0',
    marginTop: important('.5em'),
  },
  pageSubHeader: {
    marginTop: '0',
  },
  sectionHeader: {
    backgroundColor: '#1b1c1d',
    color: 'rgba(255,255,255,.9)',
    fontSize: '1.2em',
    lineHeght: '1.5em',
    textTransform: 'uppercase',
    display: 'block',
    paddingTop: '.25em',
    paddingBottom: '.25em',
    marginBottom: '0',
    width: '100%',
    verticalAlign: 'middle',
    '@media screen': {
      paddingLeft: '.5em',
      paddingRight: '.5em',
    },
  },
  entryHeader: {
    fontSize: '12pt',
    fontWeight: '700',
    marginTop: important('1em'),
    marginBottom: important('0'),
  },
  sectionWrapper: {
    paddingTop: important('0'),
  },
  section: {
    '& ul': {
      paddingLeft: important('25px'),
    },
    '& ul > li > p': {
      margin: '.25em 0 .5em',
    },
  },
  skillsList: {
    marginTop: important('1em'),
    '& > .item': {
      margin: '.25em 0 .5em',
    },
  },
  experience: {
    '& > .column': {
      margin: important('0'),
    },
  },
}

type ResumeProps = {
  classes: { [string]: string },
}

function Resume({ classes }: ResumeProps) {
  return (
    <div className={classes.printable}>
      <SEO title="Resume" />
      <div className={classes.container}>
        <Rail position="right" size="mini" attached>
          <Sticky>
            <Segment compact basic>
              <Button.Group vertical>
                <Button animated primary onClick={() => window.history.back()}>
                  <Button.Content visible><Icon name="arrow left" /></Button.Content>
                  <Button.Content hidden>Back</Button.Content>
                </Button>
                <Button animated onClick={() => window.print()}>
                  <Button.Content visible><Icon name="print" /></Button.Content>
                  <Button.Content hidden>Print</Button.Content>
                </Button>
              </Button.Group>
            </Segment>
          </Sticky>
        </Rail>
        <StaticQuery
          query={graphql`{
            profileYaml {
              name
              title
              contact {
                email_main
                website_main
              }
              address {
                street
                city
                state
                zip
              }
            }
            profile: markdownRemark(
              frontmatter: { slug: { eq: "profile" } feed: { eq: "resume" } }
            ) {
              frontmatter {
                title
              }
              html
            }
            skills: markdownRemark(
              frontmatter: { slug: { eq: "skills" } feed: { eq: "resume" } }
            ) {
              frontmatter {
                title
                featuredSkills {
                  title
                  values
                }
              }
              html
            }
            experienceOverview: markdownRemark(
              frontmatter: { slug: { eq: "experience" } feed: { eq: "resume" } }
            ) {
              frontmatter {
                title
              }
            }
            experience: allMarkdownRemark(
              filter: { frontmatter: { feed: { eq: "experience" } } }
              sort: { fields: frontmatter___start_date order: DESC }
              limit: 2
            ) {
              edges {
                node {
                  frontmatter {
                    title
                    company
                    location
                    role
                    start_date
                    end_date
                  }
                  html
                }
              }
            }
            educationOverview: markdownRemark(
              frontmatter: { slug: { eq: "education" } feed: { eq: "resume" } }
            ) {
              frontmatter {
                title
              }
            }
            education: allMarkdownRemark(
              filter: { frontmatter: { feed: { eq: "education" } } }
              sort: { fields: frontmatter___end_date order: DESC }
            ) {
              edges {
                node {
                  frontmatter {
                    title
                    degree
                    program
                    affiliation
                    end_date
                  }
                }
              }
            }
          }`}
          render={({
            profileYaml: {
              name,
              title: jobTitle,
              contact: {
                email_main: email,
                website_main: website,
              } = {},
              address: {
                street,
                city,
                state,
                zip,
              } = {},
            } = {},
            profile: {
              frontmatter: {
                title: profileTitle,
              },
              html: profileBody,
            },
            skills: {
              frontmatter: {
                title: skillsTitle,
                featuredSkills = [],
              } = {},
              html: skillsBody,
            } = {},
            experienceOverview: {
              frontmatter: {
                title: experienceTitle,
              } = {},
            } = {},
            experience: {
              edges: experiences = [],
            } = {},
            educationOverview: {
              frontmatter: {
                title: educationTitle,
              } = {},
            } = {},
            education: {
              edges: degrees = [],
            } = {},
          }) => (
            <Grid padded={false} style={{ marginTop: 0 }}>
              <Grid.Row className={classes.sectionWrapper}>
                <Grid.Column width={8}>
                  <div className={classes.centered}>
                    <h1 className={classes.pageHeader}>{name}</h1>
                    <p className={classes.pageSubHeader}>{jobTitle}</p>
                    <Divider hidden />
                    <Address
                      street={street}
                      city={city}
                      state={state}
                      zip={zip}
                    />
                    <p><a href={`mailto:${email}`}>{email}</a></p>
                    <p><a href={website}>{website}</a></p>
                  </div>
                </Grid.Column>
                <Grid.Column width={8} className={classes.section}>
                  <h2 className={classes.sectionHeader}>{profileTitle}</h2>
                  <RenderedMarkdown html={profileBody} />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row className={classes.sectionWrapper}>
                <Grid.Column width={16} className={classes.section}>
                  <h2 className={classes.sectionHeader}>{skillsTitle}</h2>
                  <Grid padded={false}>
                    <Grid.Column width={8}>
                      <RenderedMarkdown html={skillsBody} />
                    </Grid.Column>
                    <Grid.Column width={8}>
                      <List className={classes.skillsList}>
                        {featuredSkills.map(({ title, values }) => (
                          <List.Item key={title}>
                            <List.Header>{title}</List.Header>
                            {values.join(', ')}
                          </List.Item>
                        ))}
                      </List>
                    </Grid.Column>
                  </Grid>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row className={classes.sectionWrapper}>
                <Grid.Column width={16} className={classes.section}>
                  <h2 className={classes.sectionHeader}>{experienceTitle}</h2>
                  <Grid padded={false} divided="vertically">
                    {experiences.map(({
                      node: {
                        frontmatter: {
                          title,
                          company,
                          location,
                          role,
                          start_date: startDate,
                          end_date: endDate,
                        } = {},
                        html: experienceDescription,
                      } = {},
                    }) => (
                      <Grid.Row key={title} className={classes.experience}>
                        <Grid.Column width={4}>
                          <h3 className={classes.entryHeader}>
                            {role}
                          </h3>
                          <p className={classes.narrow}>
                            {company}
                          </p>
                          <p className={classes.narrow}>
                            <small>{location}</small>
                          </p>
                          <p className={classes.narrow}>
                            <small>
                              <Duration
                                dateStart={DateTime.fromISO(startDate)}
                                dateEnd={DateTime.fromISO(endDate)}
                                dateEndDefault="present"
                              />
                            </small>
                          </p>
                        </Grid.Column>
                        <Grid.Column width={12}>
                          <RenderedMarkdown html={experienceDescription} />
                        </Grid.Column>
                      </Grid.Row>
                    ))}
                  </Grid>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row className={classes.sectionWrapper}>
                <Grid.Column width={16} className={classes.section}>
                  <h2 className={classes.sectionHeader}>{educationTitle}</h2>
                  <Grid padded={false}>
                    {degrees.map(({
                      node: {
                        frontmatter: {
                          title,
                          degree,
                          program,
                          affiliation,
                          end_date: awardDate,
                        } = {},
                      } = {},
                    }) => (
                      <Grid.Column key={title} width={8}>
                        <h3 className={classes.entryHeader}>{`${degree}, ${program}`}</h3>
                        <p className={classes.narrow}>{affiliation}</p>
                        <p className={classes.narrow}>
                          <FullDate as="span" value={awardDate} format="MMMM y" />
                        </p>
                      </Grid.Column>
                    ))}
                  </Grid>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          )}
        />
      </div>
    </div>
  )
}

export default injectStyles(styles)(Resume)
