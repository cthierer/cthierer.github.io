/**
 * @flow
 */

import React from 'react'
import { graphql } from 'gatsby'
import {
  Container,
  Header,
  Grid,
  Segment,
  Divider,
} from 'semantic-ui-react'
import injectStyles from 'react-jss'
import Layout from '../containers/Layout'
import Meta from '../components/Meta'
import RenderedMarkdown from '../components/Content/RenderedMarkdown'
import LogoCard from '../components/Project/LogoCard'
import LeadParagraph from '../components/Content/LeadParagraph'
import FullDate from '../components/Content/FullDate'
import formatMarkdown from '../content/formatMarkdown'
import LinkButton from '../components/Project/LinkButton'
import LinkGrid from '../components/Project/LinkGrid'
import TagList from '../components/Project/TagList'

const styles = {
  projectWrapper: {
    marginTop: '3em',
    marginBottom: '6em',
  },
  sidebarWrapper: {
    paddingTop: '1em',
  },
}

type ProjectDocument = {
  frontmatter: {
    title: string,
    description: string,
    publish_date: string,
    color: {
      bg: string,
    },
    logo: {
      link: {
        publicURL: string,
      },
    },
    link: string,
    repo?: {
      link: string,
    },
    ci?: {
      link: string,
    },
    docs?: {
      link: string,
    },
    tags: string[],
  },
  html: string,
}

type ProjectTemplateProps = {
  data: {
    markdownRemark: ProjectDocument,
  },
  classes: { [string]: string },
}

function ProjectTemplate({
  data: {
    markdownRemark: {
      frontmatter: {
        title,
        description,
        publish_date: publishDate,
        color: {
          bg: backgroundColor = '#000',
        } = {},
        logo: {
          link: {
            publicURL: logoSrc,
          } = {},
        } = {},
        link,
        repo = {},
        ci = {},
        docs = {},
        tags = [],
      } = {},
      html,
    } = {},
  } = {},
  classes,
}: ProjectTemplateProps) {
  return (
    <Layout activeSection="projects">
      <Meta title={title} />
      <div className={classes.projectWrapper}>
        <Container>
          <Grid reversed="computer tablet" stackable>
            <Grid.Row>
              <Grid.Column widescreen={3} largeScreen={4} computer={5} width={6}>
                <Segment>
                  <div className={classes.sidebarWrapper}>
                    {logoSrc && <LogoCard backgroundColor={backgroundColor} logoSrc={logoSrc} />}
                    <Divider hidden />
                    <LinkGrid>
                      {link && <LinkButton icon="lab" label="Demo" href={link} />}
                      {repo && <LinkButton icon="code branch" label="Code" href={repo.link} />}
                      {ci && <LinkButton icon="cogs" label="Build" href={ci.link} />}
                      {docs && <LinkButton icon="paperclip" label="Docs" href={docs.link} />}
                    </LinkGrid>
                    <TagList tags={tags} />
                  </div>
                </Segment>
              </Grid.Column>
              <Grid.Column width={10}>
                <Header as="h1">{title}</Header>
                {description && (
                  <LeadParagraph as="div">
                    {formatMarkdown(description)}
                  </LeadParagraph>
                )}
                {publishDate && <FullDate value={publishDate} format="MMMM y" />}
                <Divider hidden section />
                <RenderedMarkdown html={html} />
              </Grid.Column>
            </Grid.Row>
          </Grid>

        </Container>
      </div>
    </Layout>
  )
}

export default injectStyles(styles)(ProjectTemplate)

export const pageQuery = graphql`query($path: String!) {
  markdownRemark(frontmatter: { route: { eq: $path } }) {
    frontmatter {
      title
      description
      publish_date
      color {
        bg
      }
      logo {
        link {
          publicURL
        }
      }
      link
      repo {
        link
      }
      ci {
        link
      }
      docs {
        link
      }
      tags
    }
    html
  }
}`
