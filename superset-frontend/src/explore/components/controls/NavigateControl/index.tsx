/**
 * NavigateControl Component
 * This component renders a rectangle box that opens a popover with some text when clicked.
 */

import React, { useState } from 'react';
import Button from 'src/components/Button'; // Assuming you have a Popover and Button component
import { Popover } from 'antd';
import { Select } from 'src/components';
import PropTypes from 'prop-types';
import ControlHeader from 'src/explore/components/ControlHeader'; // Importing ControlHeader
import { CloseOutlined, PlusOutlined } from '@ant-design/icons'; // Assuming you are using Ant Design icons
import {
  AddControlLabel,
  AddIconButton,
  HeaderContainer,
  LabelsContainer,
} from 'src/explore/components/controls/OptionControls';
import Icons from 'src/components/Icons';
import { useTheme } from '@superset-ui/core';

const NavigateControl = ({...props }) => {
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [selections, setSelections] = useState({}); // To store selections
  const columnOptions = [
    { value: 'country', label: 'Country', values: ['India', 'USA', 'Canada'] },
    { value: 'city', label: 'City', values: ['New York', 'Toronto', 'Mumbai'] },
  ];

  const handleOpenPopover = () => {
    setPopoverVisible(true);
  };

  const handleClosePopover = () => {
    setPopoverVisible(false);
  };

  const handleAddItem = () => {
    if (selectedColumn && inputValue) {
      setSelections({
        ...selections,
        [selectedColumn]: inputValue,
      });
      setSelectedItems([...selectedItems, selectedColumn]);
      setInputValue(''); // Clear input after adding
    }
  };

  const popoverContent = (
    <div>

      <Select
        placeholder="Select Column"
        style={{ width: '100%', marginBottom: '10px' }}
        onChange={setSelectedColumn}
      >
        {columnOptions.map((option) => (
          <Select.Option key={option.value} value={option.value}>
            {option.label}
          </Select.Option>
        ))}
      </Select>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Select
          placeholder="Select Value"
          style={{ width: '48%' }}
          onChange={setSelectedColumn}
        >
          {selectedColumn && columnOptions.find(col => col.value === selectedColumn)?.values.map((value) => (
            <Select.Option key={value} value={value}>
              {value}
            </Select.Option>
          ))}
        </Select>

        <input
          type="text"
          placeholder="Enter corresponding value"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          style={{ width: '48%' }}
        />
      </div>

      <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={handleClosePopover}>Close</Button>
        <Button type="primary" onClick={handleAddItem}>Save</Button>
      </div>
    </div>
  );
  //const { theme } = props;
  const theme = useTheme();
  return (
    <div>
      {/* Control Header */}
      ;
      <HeaderContainer>
        <ControlHeader {...props} />
        <AddIconButton data-test="add-filter-button">
          <Icons.PlusLarge
            iconSize="s"
            iconColor={theme.colors.grayscale.light5}
          />
        </AddIconButton>,

      </HeaderContainer>

      <Popover
        content={popoverContent}
        title="Navigate Control"
        trigger="click"
        visible={popoverVisible}
        onVisibleChange={setPopoverVisible}
        forceRender={true} // Optional: Use if you want to render the popover even when not visible
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
                  onClick={() => setSelectedItems(selectedItems.filter(i => i !== item))}
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
  controlLabel: PropTypes.string.isRequired, // Control label is required
  columnOptions: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    values: PropTypes.arrayOf(PropTypes.string).isRequired, // Values for the selected column
  })).isRequired, // Column options are required
};

export default NavigateControl;