import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button  from 'src/components/Button'; // Assuming you're using Ant Design for UI components
import { Popover } from 'antd'; // Assuming you're using Ant Design for UI components
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-github';
import {
    css,t, withTheme
  } from '@superset-ui/core';
import ControlHeader from 'src/explore/components/ControlHeader'; // Adjust the import path as needed

const propTypes = {
  value: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
};

const defaultProps = {
  value: '',
  onChange: () => {},
};

class JsonEditorControl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPopoverVisible: false,
      editorValue: props.value || '',
    };
  }
  

  handlePopoverVisibility = (visible) => {
    this.setState({ isPopoverVisible: visible });
  };

  handleSave = () => {
    const { editorValue } = this.state;
    this.props.onChange(editorValue);
    this.setState({ isPopoverVisible: false });
  };

  handleCancel = () => {
    this.setState({ isPopoverVisible: false, editorValue: this.props.value || '' });
  };

  handleEditorChange = (newValue) => {
    this.setState({ editorValue: newValue });
  };

  render() {
    const { label } = this.props;
    const { theme } = this.props;
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
          tabSize = {defaultTabSize}
          defaultValue = ''
          wrapEnabled
          editorProps={{ $blockScrolling: true }}
          width="100%"
          height="200px"
          fontSize={14}
          style={{
            border: `1px solid ${theme.colors.grayscale.light2}`,
            background: theme.colors.secondary.light5,
            maxWidth: theme.gridUnit * 100,
          }}
        />
        <div style={{ marginTop: '10px', textAlign: 'right' }}>
          <Button placement="top" onClick={this.handleCancel} css={css`margin-right: ${theme.gridUnit * 2}px;`}>
          {t('Close')}
          </Button>
          <Button placement="top" type="primary" onClick={this.handleSave}>
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
          <Button>{t('Input form json')}</Button>
        </Popover>
      </div>
    );
  }
}

JsonEditorControl.propTypes = propTypes;
JsonEditorControl.defaultProps = defaultProps;

export default withTheme(JsonEditorControl);