/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

exports.wrapRootElement = require('./src/hooks').wrapRootElement

exports.onRenderBody = ({ setBodyAttributes }) => {
  setBodyAttributes({
    style: { scrollBehavior: 'smooth' },
  })
}
