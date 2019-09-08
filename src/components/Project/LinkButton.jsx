/**
 * @flow
 */

import React from 'react'
import type { Node } from 'react'
import { Button, Icon } from 'semantic-ui-react'

type LinkButtonProps = {
  icon: string,
  href: string,
  label: string,
  children?: Node,
}

function LinkButton({
  icon, href, label, children,
}: LinkButtonProps) {
  return (
    <Button link href={href} size="big" animated="vertical">
      <Button.Content visible>
        <Icon name={icon} fitted />
      </Button.Content>
      <Button.Content hidden>{label || children}</Button.Content>
    </Button>
  )
}

LinkButton.defaultProps = {
  children: null,
}

export default LinkButton
