import React from 'react'
import { SharedDocuments } from 'sharing'
import { connect } from 'react-redux'
import Container from './Container'
import { Empty } from 'cozy-ui/react'
import {
  FETCH_SHARINGS,
  FETCH_SHARINGS_SUCCESS,
  FETCH_SHARINGS_FAILURE
} from '../../actions'

class SharingFetcher extends React.Component {
  state = {
    error: null
  }

  async fetchSharedDocuments() {
    const { sharedDocuments } = this.props
    const { client } = this.context

    try {
      this.props.startFetch()
      this.setState({ error: null })

      const resp = await client
        .collection('io.cozy.files')
        .all({ keys: sharedDocuments })
      const files = resp.data

      this.props.fetchSuccess(files)
    } catch (e) {
      this.setState({ error: e })
      this.props.fetchFailure(e)
    }
  }

  componentDidMount() {
    this.fetchSharedDocuments()
  }

  async componentDidUpdate(prevProps) {
    const { sharedDocuments } = this.props

    const hasNewSharings =
      sharedDocuments.length !== prevProps.sharedDocuments.length ||
      sharedDocuments.find(id => !prevProps.sharedDocuments.includes(id)) !==
        undefined

    if (hasNewSharings) this.fetchSharedDocuments()
  }

  render() {
    const { sharedDocuments, ...otherProps } = this.props
    const { error } = this.state
    const { t } = this.context

    return error ? (
      <Empty
        icon="cozy"
        title={t('Sharings.unavailable.title')}
        text={t('Sharings.unavailable.message')}
      />
    ) : (
      <Container
        isTrashContext={false}
        canSort={false}
        canDrop={false}
        canUpload={false}
        canCreateFolder={false}
        {...otherProps}
      />
    )
  }
}

const ConnectedSharingFetcher = connect(null, dispatch => ({
  startFetch: () =>
    dispatch({
      type: FETCH_SHARINGS,
      meta: {
        cancelSelection: true
      }
    }),
  fetchSuccess: files =>
    dispatch({
      type: FETCH_SHARINGS_SUCCESS,
      fileCount: files.length,
      files
    }),
  fetchFailure: e =>
    dispatch({
      type: FETCH_SHARINGS_FAILURE,
      error: e
    })
}))(SharingFetcher)

const SharingsContainer = props => (
  <SharedDocuments>
    {({ sharedDocuments }) => (
      <ConnectedSharingFetcher {...props} sharedDocuments={sharedDocuments} />
    )}
  </SharedDocuments>
)

export default SharingsContainer
