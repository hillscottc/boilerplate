import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Checkbox } from 'react-bootstrap'

const modalStyle = { position: 'fixed', zIndex: 1040, top: 0, bottom: 0, left: 0, right: 0 }

const backdropStyle = {
  ...modalStyle,
  zIndex: 'auto',
  backgroundColor: '#000',
  opacity: 0.5
}

const SubscribeModal = ({ closeSubscribeModal, showSubscribeModal, modalTitleId,
  clickSubscribe, subscriptions }) => {
  // Is user subscribed to this titleId and type?
  const isSubscribed = (subsType) => {
    const matched = subscriptions.filter(x => x.titleId === modalTitleId && x.subscriptionType === subsType)
    return matched.length > 0
  }

  return (
    <Modal
      aria-labelledby='modal-label'
      style={modalStyle}
      backdropStyle={backdropStyle}
      show={showSubscribeModal}
      onHide={closeSubscribeModal}
    >
      <Modal.Header closeButton>
        <Modal.Title>Modal heading</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>title: {modalTitleId} </div>
        <Checkbox
          defaultChecked={isSubscribed('Title')}
          onChange={(e) => clickSubscribe('Title', modalTitleId, e.target.checked)}
        >
          Notify me when title information has changed.
        </Checkbox>
        <Checkbox
          defaultChecked={isSubscribed('Bookmap')}
          onChange={(e) => clickSubscribe('Bookmap', modalTitleId, e.target.checked)}
        >
          Notify me when this bookmap is updated.
        </Checkbox>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={closeSubscribeModal}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}

SubscribeModal.propTypes = {
  closeSubscribeModal: PropTypes.func.isRequired,
  showSubscribeModal: PropTypes.bool.isRequired,
  modalTitleId: PropTypes.string.isRequired,
  clickSubscribe: PropTypes.func.isRequired,
  subscriptions: PropTypes.arrayOf(PropTypes.shape({
    contactId: PropTypes.string.isRequired,
    titleId: PropTypes.string.isRequired,
    subscriptionType: PropTypes.string.isRequired,
  })).isRequired
}

export default SubscribeModal
