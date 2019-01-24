/**
 * @flow
 */

import React from 'react'
import {
  Container,
  Button,
  Icon,
  List,
} from 'semantic-ui-react'
import injectStyles from 'react-jss'
import { StaticQuery, graphql, navigate } from 'gatsby'
import Layout from '../containers/Layout'
import Meta from '../components/Meta'
import Hero from '../containers/NavigableHero'
import SkillsSection from '../partials/landing/Skills'
import ProjectsSection from '../partials/landing/Projects'
import ExperienceSection from '../partials/landing/Experience'
import EducationSection from '../partials/landing/Education'
import breakpoints from '../theme/breakpoints'
import { important } from '../theme/utils'
import selectCtaLinks from '../data/ctaLinks'
import formatMarkdown from '../content/formatMarkdown'
import LeadParagraph from '../components/Content/LeadParagraph'

const styles = {
  landingHero: {
    minHeight: important('calc(100vh - 72px)'),
  },
  descriptionContainer: {
    marginTop: important('1.5em'),
    marginBottom: important('1.5em'),
  },
  [`@media (min-width: ${breakpoints.sm.minWidth}px)`]: {
    taglineContainer: {
      marginTop: important('25%'),
    },
    descriptionContainer: {
      marginTop: important('3em'),
      marginBottom: important('3em'),
    },
    ctaButtonContainer: {
      position: important('absolute'),
      bottom: important('28px'),
      left: important('50%'),
      transform: important(('translateX(-50%)')),
    },
  },
  [`@media (max-width: ${breakpoints.sm.minWidth}px)`]: {
    taglineContainer: {
      '& > .item': {
        width: important('100%'),
        margin: important('0'),
        padding: important('0'),
        marginTop: important('.5em'),
        marginBottom: important('.5em'),
      },
    },
    ctaButtonContainer: {
      display: important('block'),
      paddingLeft: important('10%'),
      paddingRight: important('10%'),
      '& > .button': {
        display: important('block'),
        borderRadius: important('0'),
        textAlign: important('left'),
        '&:first-child': {
          borderTopLeftRadius: important('4px'),
          borderTopRightRadius: important('4px'),
        },
        '&:last-child': {
          borderBottomLeftRadius: important('4px'),
          borderBottomRightRadius: important('4px'),
        },
      },
    },
  },
}

type IndexPageProps = {
  classes: { [string]: string },
}

const IndexPage = ({ classes }: IndexPageProps) => (
  <Layout>
    <StaticQuery
      query={graphql`{
        ctaYaml {
            taglines {
              content
              icon
            }
            description
            ...CtaLinks
          }
      }`}
      render={data => (
        <>
          <Meta title="Home" />
          <Hero id="home" className={classes.landingHero}>
            <Container text>
              <List className={classes.taglineContainer} relaxed size="massive" horizontal>
                {data.ctaYaml.taglines.map(({ content, icon }) => (
                  <List.Item key={icon}>
                    <Icon size="large" name={icon} fitted />
                    <List.Content>{content}</List.Content>
                  </List.Item>
                ))}
              </List>
              <LeadParagraph as="div" className={classes.descriptionContainer}>
                {formatMarkdown(data.ctaYaml.description)}
              </LeadParagraph>
              <Button.Group className={classes.ctaButtonContainer}>
                {selectCtaLinks(data).map(({
                  title,
                  href,
                  route,
                  icon,
                }) => (
                  <Button
                    key={href}
                    primary
                    size="huge"
                    icon={icon}
                    labelPosition="left"
                    content={title}
                    href={href}
                    onClick={route ? () => navigate(route) : undefined}
                  />
                ))}
              </Button.Group>
            </Container>
          </Hero>
        </>
      )}
    />
    <SkillsSection />
    <ProjectsSection />
    <ExperienceSection />
    <EducationSection />
  </Layout>
)

export default injectStyles(styles)(IndexPage)
