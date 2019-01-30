/**
 * @flow
 */

import React from 'react'
import { Container } from 'semantic-ui-react'
import injectStyles from 'react-jss'
import Layout from '../containers/Layout'
import Meta from '../components/Meta'

const styles = {
  contentWrapper: {
    marginTop: '3em',
    marginBottom: '6em',
    minHeight: 'calc(100vh - 400px)',
  },
}

type NotFoundPageProps = {
  classes: { [string]: string },
}

const NotFoundPage = ({ classes }: NotFoundPageProps) => (
  <Layout>
    <Meta title="404: Not found" />
    <Container text>
      <div className={classes.contentWrapper}>
        <h1>Not found</h1>
        <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
      </div>
    </Container>
  </Layout>
)

export default injectStyles(styles)(NotFoundPage)
