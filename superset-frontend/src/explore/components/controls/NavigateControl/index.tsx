/**
 * NavigateControl Component
 * This component renders a rectangle box that opens a popover with some text when clicked.
 */

import React, { useState, useEffect, useRef } from 'react';
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
import AdhocMetric from 'src/explore/components/controls/MetricControl/AdhocMetric';
import Icons from 'src/components/Icons';
import { useTheme, css, t, styled, SupersetTheme, ensureIsArray } from '@superset-ui/core';
import { InputRef } from 'antd-v5';
import { Input } from 'src/components/Input';


const NavigateControl = ({ columns = [], selectedMetrics = [], ...props }) => {
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [selections, setSelections] = useState({}); // To store selections
  const [options, setOptions] = useState([]);
  console.log(columns);
  const columnOptions = [
    { value: 'country', label: 'Country', values: ['India', 'USA', 'Canada'] },
    { value: 'city', label: 'City', values: ['New York', 'Toronto', 'Mumbai'] },
  ];
  const ref = useRef<InputRef>(null);
  const theme = useTheme();

  const NavigateActionsContainer = styled.div`
    margin-top: ${theme.gridUnit * 2}px;
    display: flex;
    justify-content: space-evenly;
  `;
  const StyledInput = styled(Input)`
    margin-bottom: ${({ theme }) => theme.gridUnit * 4}px;
  `;

  
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

      <div style=" display: flex; ">
        <Select
          placeholder="Select Value"
          onChange={setSelectedColumn}
        >
          {selectedColumn && columnOptions.find(col => col.value === selectedColumn)?.values.map((value) => (
            <Select.Option key={value} value={value}>
              {value}
            </Select.Option>
          ))}
        </Select>
        <StyledInput
            data-test="adhoc-filter-simple-value"
            name="dashboard-id"
            ref={ref}
            allowClear
            onChange={(e) => setInputValue(e.target.value)}
            value={inputValue}
            placeholder={t('Dashboard ID or SlugID')}
          />
      </div>
      <NavigateActionsContainer>
        <Button buttonSize="small" onClick={handleClosePopover} cta>
          {t('Close')}
        </Button>
        <Button
          data-test="adhoc-filter-edit-popover-save-button"
          buttonStyle="primary"
          buttonSize="small"
          className="m-r-5"
          onClick={handleAddItem}
          cta
        >
          {t('Save')}
        </Button>
      </NavigateActionsContainer>
    </div>
  );
  //const { theme } = props;

  return (
    <div>
      {/* Control Header */}
      <HeaderContainer>
        <ControlHeader {...props} />
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