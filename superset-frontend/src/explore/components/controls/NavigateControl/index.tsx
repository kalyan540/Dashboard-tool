/**
 * NavigateControl Component
 * This component renders a rectangle box that opens a popover with some text when clicked.
 */

import React, { useState } from 'react';
import Button from 'src/components/Button'; // Assuming you have a Popover and Button component
import { Popover } from 'antd';
import PropTypes from 'prop-types';
import ControlHeader from 'src/explore/components/ControlHeader'; // Importing ControlHeader
import { CloseOutlined, PlusOutlined } from '@ant-design/icons'; // Assuming you are using Ant Design icons

const NavigateControl = ({ label, controlLabel }) => {
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const handleOpenPopover = () => {
    setPopoverVisible(true);
  };

  const handleClosePopover = () => {
    setPopoverVisible(false);
  };

  const handleAddItem = (item) => {
    setSelectedItems([...selectedItems, item]);
  };

  const handleRemoveItem = (itemToRemove) => {
    setSelectedItems(selectedItems.filter(item => item !== itemToRemove));
  };

  const popoverContent = (
    <div>
      {/* Placeholder for popover content */}
      <p>Select items to add...</p>
      {/* Example buttons for adding items */}
      <Button onClick={() => handleAddItem('Item 1')}>Add Item 1</Button>
      <Button onClick={() => handleAddItem('Item 2')}>Add Item 2</Button>
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
            height: '40px',
            backgroundColor: '#f0f0f0',
            color: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            borderRadius: '5px',
            padding: '0 10px',
            marginTop: '10px', // Adding some margin for spacing
          }}
          onClick={handleOpenPopover}
        >
          {selectedItems.length > 0 ? (
            selectedItems.map((item, index) => (
              <span key={index} style={{ display: 'flex', alignItems: 'center' }}>
                {item}
                <CloseOutlined 
                  style={{ marginLeft: '5px', cursor: 'pointer' }} 
                  onClick={() => handleRemoveItem(item)} 
                />
              </span>
            ))
          ) : (
            <span>Add</span>
          )}
          <PlusOutlined style={{ marginLeft: 'auto' }} />
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