import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import RemoteCall from 'data/domain/RemoteCall'
import Subscription from 'data/domain/subscriptions/Subscription'
import getSubscriptionAction from 'data/domain/subscriptions/getSubscription/action'
import updateSubscriptionAction from 'data/domain/subscriptions/updateSubscription/action'
import ShowSubscription from './ShowSubscription'

class ShowsSubscriptionContainer extends Component {
  constructor() {
    super()

    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.handleFormChange = this.handleFormChange.bind(this)

    this.state = {
      data: new Subscription(),
    }
  }

  componentDidMount() {
    const { dispatch, params: { subscriptionId } } = this.props

    dispatch(getSubscriptionAction(subscriptionId))
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ data: nextProps.subscription })
  }

  handleFormSubmit() {
    const { dispatch, params: { subscriptionId } } = this.props
    const data = this.state.data.toMap()

    dispatch(updateSubscriptionAction(subscriptionId, { subscription: data }))
  }

  handleFormChange(attribute, value) {
    this.setState((prevState) => {
      const data = prevState.data.set(attribute, value)
      return { ...prevState, data }
    })
  }

  render() {
    const { remoteCall } = this.props
    const { data } = this.state

    return (
      <ShowSubscription
        subscription={data}
        remoteCall={remoteCall}
        onClick={this.handleFormSubmit}
        onChange={this.handleFormChange}
      />
    )
  }
}

const mapStateToProps = (state, props) => {
  const { services, subscriptions } = state
  const { params: { subscriptionId } } = props

  const subscription = subscriptions.getIn(['entities', parseInt(subscriptionId, 10)])

  const servicesRecords = services.get('ids').map(id => (
    services.getIn(['entities', id])
  ))

  return {
    subscription,
    services: servicesRecords,
    remoteCall: state.subscriptions.get('remoteCall'),
  }
}

ShowsSubscriptionContainer.propTypes = {
  params: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  remoteCall: PropTypes.instanceOf(RemoteCall),
  subscription: PropTypes.instanceOf(Subscription),
}

export default connect(mapStateToProps)(ShowsSubscriptionContainer)
