/**
 * @flow
 */

import React from 'react'
import { DateTime } from 'luxon'

const defaultFormat = 'EEEE, MMMM d, y'

type FullDateProps = {
  value: string,
  format?: string,
  as?: string,
}

function FullDate({
  value,
  format = defaultFormat,
  as: Wrapper = 'p',
}: FullDateProps) {
  return <Wrapper>{DateTime.fromISO(value).toFormat(format)}</Wrapper>
}

FullDate.defaultProps = {
  format: defaultFormat,
  as: 'p',
}

export default FullDate
