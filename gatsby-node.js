/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

/* eslint-disable import/prefer-default-export */

const { resolve } = require('path')

exports.createPages = async ({ actions: { createPage }, graphql }) => {
  const projectComponent = resolve('src/templates/project.jsx')
  const {
    data: {
      allMarkdownRemark: {
        edges: pages = [],
      } = {},
    } = {},
  } = await graphql(`
    {
      allMarkdownRemark(
        filter: { frontmatter: { feed: { eq:"projects" } } }
      ) {
        edges {
          node {
            frontmatter {
              route
            }
          }
        }
      }
    }
  `)

  pages.map(({ node: { frontmatter: { route } = {} } = {} }) => createPage({
    path: route,
    component: projectComponent,
  }))
}
