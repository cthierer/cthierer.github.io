/**
 * @flow
 */

import React from 'react'

export type AddressProps = {
  street?: string,
  city?: string,
  state?: string,
  zip?: string,
}

function Address({
  street,
  city,
  state,
  zip,
}: AddressProps) {
  return (
    <p>
      {street}
      {street && <br />}
      {city}
      {city && ', '}
      {state}
      {state && ' '}
      {zip}
    </p>
  )
}

Address.defaultProps = {
  street: undefined,
  city: undefined,
  state: undefined,
  zip: undefined,
}

export default Address
