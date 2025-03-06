import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'src/components/Button';
import { Popover } from 'antd';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-github';
import { css, t, withTheme } from '@superset-ui/core';
import ControlHeader from 'src/explore/components/ControlHeader';

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

class JsonEditorControl extends Component<JsonEditorControlProps, JsonEditorControlState> {
  constructor(props: any) {
    super(props);
    this.state = {
      isPopoverVisible: false,
      editorValue: props.value || '',
    };
  }

  handleSave = () => {
    const { editorValue } = this.state;
    this.props.onChange(editorValue);
    this.setState({ isPopoverVisible: false });
  };

  handleCancel = () => {
    this.setState({ isPopoverVisible: false, editorValue: this.props.value || '' });
  };

  handleEditorChange = (newValue: string) => {
    this.setState({ editorValue: newValue });
  };

  render() {
    const { label, theme } = this.props;
    const { editorValue } = this.state;
    const defaultTabSize = 2;

    return (
      <div>
        <ControlHeader {...this.props} />
        <AceEditor
          mode="json"
          theme="github"
          onChange={this.handleEditorChange}
          value={editorValue}
          name="json-editor"
          tabSize={defaultTabSize}
          width="100%"
          height="300px"
          fontSize={14}
          style={{
            border: `1px solid ${theme.colors.grayscale.light2}`,
            background: theme.colors.secondary.light5,
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
  }
}

export default withTheme(JsonEditorControl);