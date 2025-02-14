/**
 * NavigateControl Component
 * This component renders a rectangle box that opens a popover with some text when clicked.
 */

import { Component } from 'react';
import PropTypes from 'prop-types';
import { t, withTheme, SupersetClient, styled } from '@superset-ui/core';
import ControlHeader from 'src/explore/components/ControlHeader';
import { AddControlLabel, AddIconButton, HeaderContainer, LabelsContainer } from 'src/explore/components/controls/OptionControls';
import Icons from 'src/components/Icons';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Button from 'src/components/Button'; // Assuming you have a Popover and Button component
import { Popover } from 'antd';
import { Select } from 'src/components';
import { Input } from 'src/components/Input';
import OptionWrapper from 'src/explore/components/controls/DndColumnSelectControl/OptionWrapper';
import { optionLabel } from 'src/utils/common';

const propTypes = {
  label: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  name: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.arrayOf(
    PropTypes.shape({
      selectedColumn: PropTypes.string.isRequired,
      inputValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      selectionOption: PropTypes.string.isRequired,
    })
  ),
  columns: PropTypes.arrayOf(PropTypes.object),
  isLoading: PropTypes.bool,
};

const defaultProps = {
  name: '',
  onChange: () => { },
  columns: [],
  value: [],
};

const SelectWithLabel = styled(Select)<{ labelText: string }>`
    .ant-select-selector::after {
      content: ${({ labelText }) => labelText || '\\A0'};
      display: inline-block;
      white-space: nowrap;
      color: ${({ theme }) => theme.colors.grayscale.light1};
      width: max-content;
    }
  `;

class NavigateControl extends Component {
  constructor(props: any) {
    super(props);
    console.log(props);
    this.onAddMapping = this.onAddMapping.bind(this);
    this.onRemoveMapping = this.onRemoveMapping.bind(this);
    this.onChangeMapping = this.onChangeMapping.bind(this);
    this.handleClosePopover = this.handleClosePopover.bind(this);
    this.handleAddItem = this.handleAddItem.bind(this);

    this.state = {
      values: this.props.value || [],
      isPopoverVisible: false,
      selectedColumn: '', // State for selected column in popover
      inputValue: '', // State for input value in popover
      selectionOption: null, // State for selection option in popover 
    };
  }

  createSuggestionsPlaceholder = () => {
    const optionsRemaining = this.state.suggestions?.length || 0;
    const placeholder = t('%s option(s)', optionsRemaining);
    return optionsRemaining ? placeholder : 'Value';
  };
  

  onAddMapping() {
    /*this.setState(
      prevState => ({
        values: [...prevState.values, { selectedColumn: '', inputValue: '', selectionOption: '' }],
      }),
      () => this.props.onChange(this.state.values)
    );*/
    this.setState({ isPopoverVisible: true });
  }

  onRemoveMapping(index) {
    this.setState(
      prevState => {
        const values = [...prevState.values];
        values.splice(index, 1);
        return { values };
      },
      () => this.props.onChange(this.state.values)
    );
  }

  onChangeMapping(index, field, value) {
    this.setState(
      prevState => {
        const values = [...prevState.values];
        values[index][field] = value;
        console.log(values);
        return { values };
      },
      () => this.props.onChange(this.state.values)
    );
  }

  handleOpenPopover = () => {
    this.setState({ isPopoverVisible: true });
  };

  handleClosePopover = () => {
    this.setState({ isPopoverVisible: false });
  };

  handleAddItem() {
    const { selectedColumn, inputValue, selectionOption } = this.state;
    this.setState(
      (prevState) => ({
        values: [...prevState.values, { selectedColumn, inputValue, selectionOption }],
        isPopoverVisible: false, // Close popover after adding
        selectedColumn: '', // Reset selected column
        inputValue: '', // Reset input value
        selectionOption: null, // Reset selection option
        suggestions: [], // Suggestions for select control
        selectOption: null,
        loadingComparatorSuggestions: false,
      }),
      () => this.props.onChange(this.state.values)
    );
  }

  componentDidUpdate(prevProps, prevState) {
    // Only run refreshComparatorSuggestions if selectedColumn has changed
    if (prevState.selectedColumn !== this.state.selectedColumn && this.state.selectedColumn) {
      this.refreshComparatorSuggestions();
    }
  }
  /*componentDidMount() {
    this.refreshComparatorSuggestions();
  }*/


  //label.length < 43 ? label : `${label.substring(0, 40)}...`;
  
  refreshComparatorSuggestions = () => {
    const { datasource } = this.props;
    const { selectedColumn } = this.state;

    if (selectedColumn && datasource && datasource.filter_select) {
      const controller = new AbortController();
      const { signal } = controller;
      if (this.state.loadingComparatorSuggestions) {
        controller.abort();
      }

      this.setState({ loadingComparatorSuggestions: true });
      SupersetClient.get({
        signal,
        endpoint: `/api/v1/datasource/table/${datasource.id}/column/${selectedColumn}/values/`,
      })
        .then(({ json }) => {
          console.log(json);
          this.setState({
            suggestions: json.result.map(suggestion => ({
              value: suggestion,
              label: optionLabel(suggestion),
            })),
            loadingComparatorSuggestions: false,
          });
        })
        .catch(() => {
          this.setState({ suggestions: [], loadingComparatorSuggestions: false });
        });
    }
    console.log(this.state.suggestions);
  };

  handleSelectChange = (value) => {
    this.setState({ selectionOption: value });
  };

  // Create the placeholder text for the select input
  

  renderPopoverContent() {
    const { isPopoverVisible, selectedColumn, inputValue, selectionOption, suggestions } = this.state;

    if (!isPopoverVisible) return null;

    return (
      <div className="popover-content" style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#fff' }}>
        <Select
          style={{ width: '100%', marginBottom: '10px' }}
          onChange={(value) => this.setState({ selectedColumn: value })}
          placeholder={t('%s column(s)', this.props.options.length)}
          options={this.props.options.map((column) => ({
            value: column.column_name || column.optionName || '',
            label: column.saved_metric_name || column.column_name || column.label,
            key: column.id || column.optionName || undefined,
          }))}
        />
        {console.log(selectedColumn)}
        {console.log(suggestions)}

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/*<Input
            placeholder={t('Input Value')}
            value={inputValue}
            onChange={(e) => this.setState({ inputValue: e.target.value })}
          />*/}
          <SelectWithLabel
            labelText="Comparator"
            options={suggestions}
            value={this.state.selectionOption}
            onChange={this.handleSelectChange}
            loading={this.state.loadingComparatorSuggestions}
            notFoundContent={t('Type a value here')}
            placeholder={this.createSuggestionsPlaceholder()}
          />
          <Input
            placeholder={t('ID or SlugId')}
            value={inputValue}
            onChange={(e) => this.setState({ inputValue: e.target.value })}
          />
        </div>

        <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <Button onClick={this.handleClosePopover}>{t('Close')}</Button>
          <Button type="primary" onClick={this.handleAddItem}>
            {t('Save')}
          </Button>
        </div>
      </div>
    );
  }

  render() {
    const { theme } = this.props;
    const { values } = this.state;
    return (
      <div className="navigate-control" data-test="navigate-control">
        <HeaderContainer>
          <ControlHeader {...this.props} />
        </HeaderContainer>
        <LabelsContainer>
          {values.map((mapping: { selectedColumn: string; inputValue: string; selectionOption: string }, index: number) => (
            <OptionWrapper
              key={index}
              index={index}
              label={mapping.selectionOption}
              type="no-dnd"
              clickClose={() => this.onRemoveMapping(index)}
            />
          ))}
          <Popover
            content={this.renderPopoverContent()}
            title="Navigate Control"
            trigger="click"
            visible={this.state.isPopoverVisible}
            onOpenChange={this.handleOpenPopover}
          >
            <AddControlLabel onClick={this.onAddMapping}>
              <Icons.PlusSmall iconColor={theme.colors.grayscale.light1} />
              {t('Add mapping')}
            </AddControlLabel>
          </Popover>

        </LabelsContainer>
      </div>
    );
  }
}
console.log();
NavigateControl.propTypes = propTypes;
NavigateControl.defaultProps = defaultProps;

export default withTheme(NavigateControl);


/*
{this.state.values.length > 0
            ? this.state.values.map((mapping, index) => (
                <div key={index} className="mapping-row">
                  <input
                    type="text"
                    value={mapping.selectedColumn}
                    onChange={e => this.onChangeMapping(index, 'selectedColumn', e.target.value)}
                  />
                  <input
                    type="text"
                    value={mapping.inputValue}
                    onChange={e => this.onChangeMapping(index, 'inputValue', e.target.value)}
                  />
                  <input
                    type="text"
                    value={mapping.selectionOption}
                    onChange={e => this.onChangeMapping(index, 'selectionOption', e.target.value)}
                  />
                  <button onClick={() => this.onRemoveMapping(index)}>{t('Remove')}</button>
                </div>
              ))
            : (
                <AddControlLabel onClick={this.onAddMapping}>
                  <Icons.PlusSmall iconColor={theme.colors.grayscale.light1} />
                  {t('Add mapping')}
                </AddControlLabel>
              )}



import React, { useState, useRef, useEffect } from 'react';
import Button from 'src/components/Button'; // Assuming you have a Popover and Button component
import { Popover } from 'antd';
import { Select } from 'src/components';
import PropTypes from 'prop-types';
import ControlHeader from 'src/explore/components/ControlHeader'; // Importing ControlHeader
import { CloseOutlined, PlusOutlined } from '@ant-design/icons'; // Assuming you are using Ant Design icons
import {HeaderContainer,} from 'src/explore/components/controls/OptionControls';
import { useTheme, styled, t, SupersetClient } from '@superset-ui/core';
import { ColumnMeta, Dataset} from '@superset-ui/chart-controls';
import { InputRef } from 'antd-v5';
import { Input } from 'src/components/Input';
import { ExpressionTypes } from 'src/explore/components/controls/FilterControl/types';
import {AGGREGATES} from 'src/explore/constants';
import FilterDefinitionOption from 'src/explore/components/controls/MetricControl/FilterDefinitionOption';
import { optionLabel } from 'src/utils/common';

export interface SimpleExpressionType {
  expressionType: keyof typeof ExpressionTypes;
  column: ColumnMeta;
  aggregate: keyof typeof AGGREGATES;
  label: string;
}
export interface SQLExpressionType {
  expressionType: keyof typeof ExpressionTypes;
  sqlExpression: string;
  label: string;
}

export interface MetricColumnType {
  saved_metric_name: string;
}

export type ColumnType =
  | ColumnMeta
  | SimpleExpressionType
  | SQLExpressionType
  | MetricColumnType;

export interface NavigateSelectProps {
  options: ColumnType[];
  datasource: Dataset;
}

const NavigateControl = (props: NavigateSelectProps) => {
  console.log(props.options);

  const [popoverVisible, setPopoverVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [selectOption, setSelectOption] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [selections, setSelections] = useState({});
  const [loadingComparatorSuggestions, setLoadingComparatorSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<
    Record<'label' | 'value', any>[]
  >([]);
  console.log(props);
  console.log(selectedColumn);
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
  const SelectWithLabel = styled(Select)<{ labelText: string }>`
    .ant-select-selector::after {
      content: ${({ labelText }) => labelText || '\\A0'};
      display: inline-block;
      white-space: nowrap;
      color: ${({ theme }) => theme.colors.grayscale.light1};
      width: max-content;
    }
  `;

  const getOptionsRemaining = () => {
    // if select is multi/value is array, we show the options not selected
    return suggestions?.length ?? 0;
  };

  const createSuggestionsPlaceholder = () => {
    const optionsRemaining = getOptionsRemaining();
    const placeholder = t('%s option(s)', optionsRemaining);
    return optionsRemaining ? placeholder : 'Value';
  };

  const comparatorSelectProps = {
      allowClear: true,
      allowNewOptions: true,
      onChange: setSelectOption,
      ariaLabel: t('Comparator option'),
      loading: loadingComparatorSuggestions,
      notFoundContent: t('Type a value here'),
      placeholder: createSuggestionsPlaceholder()
    };
  
    useEffect(() => {
      const refreshComparatorSuggestions = () => {
        const { datasource } = props;
        const col = selectedColumn;
        console.log(col);
        console.log(datasource);
        console.log(props);
  
        if (col && datasource && datasource.filter_select) {
          const controller = new AbortController();
          const { signal } = controller;
          if (loadingComparatorSuggestions) {
            controller.abort();
          }
          setLoadingComparatorSuggestions(true);
          SupersetClient.get({
            signal,
            endpoint: `/api/v1/datasource/table/${datasource.id}/column/${col}/values/`,
          })
            .then(({ json }) => {
              setSuggestions(
                json.result.map(
                  (suggestion: null | number | boolean | string) => ({
                    value: suggestion,
                    label: optionLabel(suggestion),
                  }),
                ),
              );
              setLoadingComparatorSuggestions(false);
            })
            .catch(() => {
              setSuggestions([]);
              setLoadingComparatorSuggestions(false);
            });
        }
      };
      refreshComparatorSuggestions();
    }, [selectedColumn]);

  
  const handleOpenPopover = () => {
    setPopoverVisible(true);
    if (ref.current) {
      ref.current.focus();
    }
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
      setSelectOption(null);
    }
  };
  const renderSubjectOptionLabel = (option: ColumnType) => (
      <FilterDefinitionOption option={option} />
    );
    /*const handleInput = (e) => {
      setInputValue(e.target.value); // Directly updating input state
    };


  const popoverContent = (
    <div>

      <Select
        style={{ width: '100%', marginBottom: '10px' }}
        onChange={setSelectedColumn}
        placeholder = {t('%s column(s)', props.options.length)}
        options={props.options.map(column => ({
          value:
            ('column_name' in column && column.column_name) ||
            ('optionName' in column && column.optionName) ||
            '',
          label:
            ('saved_metric_name' in column && column.saved_metric_name) ||
            ('column_name' in column && column.column_name) ||
            ('label' in column && column.label),
          key:
            ('id' in column && column.id) ||
            ('optionName' in column && column.optionName) ||
            undefined,
          customLabel: renderSubjectOptionLabel(column),
        }))}
      />

      <div style={{ display: 'flex' }}>
        <SelectWithLabel
            options={suggestions}
            value={selectOption}
            {...comparatorSelectProps}
            
          />
         =
         <Input
          ref={ref}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={t(' id Or SlugId')}
          onClick={e => {
            // prevent closing menu when clicking on input
            e.nativeEvent.stopImmediatePropagation();
          }}
          allowClear
          value={inputValue}
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
      {/* Control Header }
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

export default NavigateControl;*/