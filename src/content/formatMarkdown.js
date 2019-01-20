/**
 * @flow
 */

import remark from 'remark'
import remarkToReact from 'remark-react'

const engine = remark().use(remarkToReact)

export default function formatMarkdown(md: string) {
  return engine.processSync(md).contents
}
