/**
 * NavigateControl Component
 * This component renders a rectangle box that opens a popover with some text when clicked.
 */

import React, { useState } from 'react';
import Button from 'src/components/Button'; // Assuming you have a Popover and Button component
import Popover from 'src/components/Popover'; // Importing Popover
import PropTypes from 'prop-types';
import ControlHeader from 'src/explore/components/ControlHeader'; // Importing ControlHeader

const NavigateControl = ({ label, controlLabel }) => {
  const [popoverVisible, setPopoverVisible] = useState(false);

  const handleOpenPopover = () => {
    setPopoverVisible(true);
  };

  const handleClosePopover = () => {
    setPopoverVisible(false);
  };

  const popoverContent = (
    <div>
      <p>This is the Navigate Control popover!</p>
      <Button onClick={handleClosePopover}>Close</Button>
    </div>
  );

  return (
    <div>
      {/* Control Header */}
      <ControlHeader label={controlLabel} />

      <Popover
        content={popoverContent}
        title="Navigate Control"
        trigger="click"
        visible={popoverVisible}
        onVisibleChange={setPopoverVisible}
      >
        <div
          style={{
            width: '200px',
            height: '100px',
            backgroundColor: '#007bff',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            borderRadius: '5px',
            marginTop: '10px', // Adding some margin for spacing
          }}
        >
          {label || 'Click Me'}
        </div>
      </Popover>
    </div>
  );
};

// PropTypes for NavigateControl
NavigateControl.propTypes = {
  label: PropTypes.string,
  controlLabel: PropTypes.string.isRequired, // Control label is required
};

export default NavigateControl;