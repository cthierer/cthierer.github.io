/**
 * @flow
 */

import React from 'react'
import type { DateTime } from 'luxon'

type DurationProps = {
  dateStart?: ?DateTime,
  dateEnd?: ?DateTime,
  dateEndDefault?: ?string,
}

function Duration({ dateStart, dateEnd, dateEndDefault }: DurationProps) {
  const dateStartStr = dateStart ? `${dateStart.monthShort}. ${dateStart.year}` : null
  // $FlowFixMe doesn't allow comparison of DateTime < DateTime, but this is recommended by luxon
  const showDateEnd = dateEnd && (!dateStart || (!(dateStart.hasSame(dateEnd, 'month') && dateStart.hasSame(dateEnd, 'year')) && dateStart < dateEnd))
  const dateEndStr = showDateEnd && dateEnd ? `${dateEnd.monthShort}. ${dateEnd.year}` : dateEndDefault
  const separator = dateStartStr && dateEndStr ? ' - ' : ''

  return (
    <span>
      {dateStartStr}
      {separator}
      {dateEndStr}
    </span>
  )
}

Duration.defaultProps = {
  dateStart: null,
  dateEnd: null,
  dateEndDefault: null,
}

export default Duration
