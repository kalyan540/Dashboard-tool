import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button  from 'src/components/Button'; // Assuming you're using Ant Design for UI components
import { Popover } from 'antd';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-github';
import { css, t, withTheme } from '@superset-ui/core';
import ControlHeader from 'src/explore/components/ControlHeader';
import 'primeicons/primeicons.css'; // Import PrimeIcons CSS

interface JsonEditorControlProps {
  value: any;
  label: string;
  onChange: (value: any) => void;
  theme: any;
}

interface JsonEditorControlState {
  isPopoverVisible: boolean;
  editorValue: any;
}

const propTypes = {
  value: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
};

const defaultProps = {
  value: '',
  onChange: () => {},
};

class JsonEditorControl extends Component<JsonEditorControlProps, JsonEditorControlState> {
  constructor(props: any) {
    super(props);
    this.state = {
      isPopoverVisible: false,
      editorValue: JSON.stringify(props.value, null, 2), // Initialize with formatted JSON
    };
  }

  handlePopoverVisibility = (visible: boolean) => {
    this.setState({ isPopoverVisible: visible });
  };

  handleSave = () => {
    const { editorValue } = this.state;
    try {
      const parsedValue = JSON.parse(editorValue); // Parse the JSON string
      this.props.onChange(parsedValue); // Pass the updated JSON to the parent
      this.setState({ isPopoverVisible: false });
    } catch (error) {
      console.error('Invalid JSON:', error);
    }
  };

  handleCancel = () => {
    this.setState({ isPopoverVisible: false, editorValue: JSON.stringify(this.props.value, null, 2) });
  };

  handleEditorChange = (newValue: string) => {
    this.setState({ editorValue: newValue });
  };

  render() {
    const { label, theme } = this.props;
    const { isPopoverVisible, editorValue } = this.state;
    const defaultTabSize = 2;

    const popoverContent = (
      <div>
        <AceEditor
          mode="json"
          theme="github"
          onChange={this.handleEditorChange}
          value={editorValue}
          name="json-editor"
          tabSize={defaultTabSize}
          defaultValue=""
          width="300px"
          height="200px"
          fontSize={14}
          style={{
            border: `1px solid ${theme.colors.grayscale.light2}`,
            background: theme.colors.secondary.light5,
            maxWidth: theme.gridUnit * 100,
          }}
        />
        <div style={{ marginTop: '10px', textAlign: 'right' }}>
          <Button onClick={this.handleCancel} css={css`margin-right: ${theme.gridUnit * 2}px;`}>
            {t('Close')}
          </Button>
          <Button type="primary" onClick={this.handleSave}>
            {t('Save')}
          </Button>
        </div>
      </div>
    );

    return (
      <div>
        <ControlHeader {...this.props} />
        <Popover
          content={popoverContent}
          placement="bottomLeft"
          arrowPointAtCenter
          title={t('Json Editor')}
          trigger="click"
          visible={isPopoverVisible}
          onVisibleChange={this.handlePopoverVisibility}
        >
          {/* Replace the button with the three dots icon */}
          <span className="pi pi-ellipsis-v" style={{ cursor: 'pointer' }}></span>
        </Popover>
      </div>
    );
  }
}

JsonEditorControl.propTypes = propTypes;
JsonEditorControl.defaultProps = defaultProps;

export default withTheme(JsonEditorControl);