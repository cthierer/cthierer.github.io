/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

/* eslint-disable import/prefer-default-export */

require('semantic-ui-css/semantic.min.css')

exports.wrapRootElement = require('./src/hooks').wrapRootElement
