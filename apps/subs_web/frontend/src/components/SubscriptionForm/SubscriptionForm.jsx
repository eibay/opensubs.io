import React from 'react'
import PropTypes from 'prop-types'
import { OrderedSet } from 'immutable'

import RemoteCall from 'data/domain/RemoteCall'
import Subscription from 'data/domain/subscriptions/Subscription'
import colors from 'constants/colors'

import ErrorMessages from 'components/ErrorMessages'
import ColorPicker from 'components/ColorPicker'
import DatePicker from 'components/DatePicker'
import ServiceSelector from 'components/ServiceSelector'

const renderErrors = (remoteCall) => {
  if (remoteCall.loading || !remoteCall.data) { return null }

  return <ErrorMessages errors={remoteCall.data.get('errors')} />
}

const buildServiceOptions = (services) => {
  const servicesOptions = services.map(service => ({
    value: service.code,
    color: service.color,
    label: service.name,
  })).toJS()

  servicesOptions.push({
    value: 'custom',
    color: colors.default,
    label: 'Custom',
  })

  return servicesOptions
}

const SubscriptionForm = ({ subscription, services, onClick, onChange, remoteCall }) => {
  const handleChange = (event, attribute) => {
    onChange(attribute, event.target.value)
  }

  const handleServiceChange = (option) => {
    onChange('color', option.color)
    onChange('service_code', (option.value === 'custom' ? null : option.value))
  }

  const servicesOptions = buildServiceOptions(services)

  return (
    <div
      id="subscription-form"
      style={{ background: subscription.color, padding: 10 }}
    >
      {renderErrors(remoteCall)}
      {!subscription.id &&
        <div>
          <ServiceSelector
            className="subscription-service"
            value={subscription.service_code || 'custom'}
            options={servicesOptions}
            onChange={handleServiceChange}
          />
        </div>
      }
      <div>
        {!subscription.service_code &&
          <input
            className="subscription-name"
            type="text"
            placeholder="name"
            value={subscription.name}
            onChange={event => handleChange(event, 'name')}
          />}
      </div>
      <div>
        <input
          className="subscription-amount"
          type="number"
          placeholder="amount"
          value={subscription.amount}
          onChange={event => handleChange(event, 'amount')}
        />
      </div>
      <div>
        <select
          className="subscription-amount-currency"
          onChange={event => handleChange(event, 'amount_currency')}
          value={subscription.amount_currency}
        >
          <option value="GBP">£ (GBP)</option>
          <option value="EUR">€ (EUR)</option>
          <option value="USD">$ (USD)</option>
        </select>
      </div>
      <div>
        <select
          className="subscription-cycle"
          onChange={event => handleChange(event, 'cycle')}
          value={subscription.cycle}
        >
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      <div>
        {!subscription.service_code &&
          <ColorPicker onChange={color => onChange('color', color)} />}
      </div>
      <div>
        <DatePicker
          value={subscription.first_bill_date}
          onChange={date => onChange('first_bill_date', date)}
        />
      </div>
      <div>
        <button type="submit" onClick={onClick}>Save</button>
      </div>
    </div>
  )
}

SubscriptionForm.propTypes = {
  subscription: PropTypes.instanceOf(Subscription),
  services: PropTypes.instanceOf(OrderedSet),
  onClick: PropTypes.func,
  onChange: PropTypes.func,
  remoteCall: PropTypes.instanceOf(RemoteCall),
}

SubscriptionForm.defaultProps = {
  services: OrderedSet(),
}

export default SubscriptionForm
