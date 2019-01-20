/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

export { wrapRootElement } from './src/hooks'

export const onRenderBody = (
  { setBodyAttributes },
) => {
  setBodyAttributes({
    style: { scrollBehavior: 'smooth' },
  })
}
