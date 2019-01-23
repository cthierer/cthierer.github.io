/**
 * @flow
 */

import React from 'react'

type RenderedMarkdownProps = {
  html: string,
  as?: string,
}

export default function RenderedMarkdown({ html, as: Wrapper = 'div' }: RenderedMarkdownProps) {
  // eslint-disable-next-line react/no-danger
  return <Wrapper dangerouslySetInnerHTML={{ __html: html }} />
}

RenderedMarkdown.defaultProps = {
  as: 'div',
}
