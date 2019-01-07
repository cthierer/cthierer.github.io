/**
 * @flow
 */

import { Link } from 'gatsby'
import React from 'react'

type HeaderProps = {
  siteTitle: string,
}

const Header = ({ siteTitle }: HeaderProps) => (
  <div
    style={{
      background: `rebeccapurple`,
      marginBottom: `1.45rem`,
    }}
  >
    <div
      style={{
        margin: `0 auto`,
        maxWidth: 960,
        padding: `1.45rem 1.0875rem`,
      }}
    >
      <h1 style={{ margin: 0 }}>
        <Link
          to="/"
          style={{
            color: `white`,
            textDecoration: `none`,
          }}
        >
          {siteTitle}
        </Link>
      </h1>
    </div>
  </div>
)

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
