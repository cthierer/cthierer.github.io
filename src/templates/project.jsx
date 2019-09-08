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
  Label,
  Button,
} from 'semantic-ui-react'
import Layout from '../containers/Layout'
import Meta from '../components/Meta'
import RenderedMarkdown from '../components/Content/RenderedMarkdown'
import LogoCard from '../components/Project/LogoCard'
import LeadParagraph from '../components/Content/LeadParagraph'
import FullDate from '../components/Content/FullDate'
import formatMarkdown from '../content/formatMarkdown'
import LinkButton from '../components/Project/LinkButton'

type ProjectDocument = {
  frontmatter: {
    title: string,
    description: string,
    publish_date: string,
    color: {
      bg: string,
      theme: string,
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
          theme: themeColor = 'black',
        } = {},
        logo: { link: { publicURL: logoSrc } = {} } = {},
        link,
        repo = {},
        ci = {},
        docs = {},
        tags = [],
      } = {},
      html,
    } = {},
  } = {},
}: ProjectTemplateProps) {
  return (
    <Layout activeSection="projects">
      <Meta title={title} />
      <Segment inverted color={themeColor} attached style={{ border: 'none' }}>
        <Divider hidden />
        <Container text>
          <Grid stackable>
            <Grid.Row>
              <Grid.Column width={10}>
                <Header as="h1" size="huge" inverted>
                  {title}
                  <Header.Subheader>
                    {publishDate && (
                      <FullDate value={publishDate} format="MMMM y" />
                    )}
                  </Header.Subheader>
                </Header>
                {description && (
                  <LeadParagraph as="div">
                    {formatMarkdown(description)}
                  </LeadParagraph>
                )}
                <Divider hidden />
                {tags && tags.length > 0 && (
                  <Label.Group color={themeColor}>
                    {tags.map(tag => (
                      <Label>{tag}</Label>
                    ))}
                  </Label.Group>
                )}
              </Grid.Column>
              <Grid.Column width={6}>
                {logoSrc && (
                  <LogoCard
                    backgroundColor={backgroundColor}
                    logoSrc={logoSrc}
                  />
                )}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </Segment>
      <Segment text attached="bottom" color={themeColor} inverted>
        <Container text>
          <Button.Group attached="bottom" color={themeColor}>
            {link && <LinkButton icon="lab" label="Demo" href={link} />}
            {repo && (
              <LinkButton icon="code branch" label="Code" href={repo.link} />
            )}
            {ci && <LinkButton icon="cogs" label="Build" href={ci.link} />}
            {docs && (
              <LinkButton icon="paperclip" label="Docs" href={docs.link} />
            )}
          </Button.Group>
        </Container>
      </Segment>
      <Divider hidden />
      <Container text>
        <RenderedMarkdown html={html} />
        <Divider hidden section />
      </Container>
    </Layout>
  )
}

export default ProjectTemplate

export const pageQuery = graphql`
  query($path: String!) {
    markdownRemark(frontmatter: { route: { eq: $path } }) {
      frontmatter {
        title
        description
        publish_date
        color {
          bg
          theme
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
  }
`
