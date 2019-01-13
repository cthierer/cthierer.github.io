/**
 * @flow
 */

import React from 'react'
// import { Link } from 'gatsby'
import { Container, Header, Button } from 'semantic-ui-react'
import injectStyles from 'react-jss'
import Layout from '../components/layout'
// import Image from '../components/image'
import SEO from '../components/seo'
import HeroContainer from '../components/HeroContainer'
import SkillsSection from '../sections/Skills'
import ProjectsSection from '../sections/Projects'
import ExperienceSection from '../sections/Experience'
import EducationSection from '../sections/Education'
import breakpoints from '../theme/breakpoints'
import { important } from '../theme/utils'

const styles = {
  mainTitle: {
    fontSize: important('2em'),
    fontWeight: important('normal'),
    marginBottom: important(0),
    marginTop: important('1.5em'),
  },
  subTitle: {
    fontSize: important('1.5em'),
    fontWeight: important('normal'),
    marginTop: important('0.5em'),
  },
  [`@media (min-width: ${breakpoints.sm.minWidth}px)`]: {
    mainTitle: {
      fontSize: important('4em'),
      marginTop: important('3em'),
    },
    subTitle: {
      fontSize: important('1.7em'),
      marginTop: important('1.5em'),
    },
  },
}

type IndexPageProps = {
  classes: { [string]: string },
}

const IndexPage = ({ classes }: IndexPageProps) => (
  <Layout>
    <SEO title="Home" keywords={['gatsby', 'application', 'react']} />
    <HeroContainer>
      <Container text>
        <Header as="h1" inverted className={classes.mainTitle}>
          developer. baltimore local. cat owner.
        </Header>
        <Header as="h2" inverted className={classes.subTitle}>
          Full-stack web application developer, with a focus on NodeJS and Javascript.
          Passionate about finding creative ways to use and integrate technology.
        </Header>
        <Button.Group>
          <Button
            primary
            size="huge"
            icon="mail"
            labelPosition="left"
            content="Email"
          />
          <Button
            primary
            size="huge"
            icon="file"
            labelPosition="left"
            content="Resume"
          />
          <Button
            primary
            size="huge"
            icon="github"
            labelPosition="left"
            content="GitHub"
          />
          <Button
            primary
            size="huge"
            icon="linkedin"
            labelPosition="left"
            content="LinkedIn"
          />
        </Button.Group>
      </Container>
    </HeroContainer>
    <SkillsSection />
    <ProjectsSection />
    <ExperienceSection />
    <EducationSection />
  </Layout>
)

export default injectStyles(styles)(IndexPage)
