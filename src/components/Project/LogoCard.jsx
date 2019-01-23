/**
 * @flow
 */

import React from 'react'
import injectStyles from 'react-jss'
import { Image } from 'semantic-ui-react'

const styles = {
  projectLogoCard: {
    width: '190px',
    height: '190px',
    padding: '14px',
    borderRadius: '8px',
    margin: 'auto',
  },
}

type LogoCardProps = {
  backgroundColor?: string,
  logoSrc: string,
  classes: { [string]: string },
}

function LogoCard({
  backgroundColor = '#000',
  logoSrc,
  classes,
}: LogoCardProps) {
  return (
    <div className={classes.projectLogoCard} style={{ backgroundColor }}>
      <Image src={logoSrc} centered style={{ height: '100%', maxHeight: '100%' }} />
    </div>
  )
}

LogoCard.defaultProps = {
  backgroundColor: '#000',
}

export default injectStyles(styles)(LogoCard)
