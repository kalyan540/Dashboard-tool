/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership. The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'src/components';
import { Input, Button, Tooltip } from 'antd';
import ControlHeader from 'src/explore/components/ControlHeader';

interface Mapping {
  column: string;
  value: string;
  userInput: string;
}

interface MappingSelectionControlProps {
  onChange: (mappings: Mapping[]) => void;
  value?: Mapping[];
  datasource: any;
}

const MappingSelectionControl: React.FC<MappingSelectionControlProps> = ({
  onChange,
  value = [],
  datasource,
}) => {
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const [columnValues, setColumnValues] = useState<string[]>([]);
  const [mappings, setMappings] = useState<Mapping[]>(value);

  useEffect(() => {
    if (selectedColumn) {
      const uniqueValues = datasource?.data?.map((row: any) => row[selectedColumn]) || [];
      setColumnValues([...new Set(uniqueValues)]);
    }
  }, [selectedColumn, datasource]);

  const handleColumnChange = (column: string) => {
    setSelectedColumn(column);
    setMappings([]); // Reset mappings when column changes
  };

  const handleMappingChange = (index: number, field: keyof Mapping, newValue: string) => {
    const newMappings = mappings.map((mapping, i) =>
      i === index ? { ...mapping, [field]: newValue } : mapping
    );
    setMappings(newMappings);
    onChange(newMappings);
  };

  const addMapping = () => {
    if (selectedColumn) {
      setMappings([...mappings, { column: selectedColumn, value: '', userInput: '' }]);
    }
  };

  return (
    <div>
      <ControlHeader {...{ description: 'Select a column and map values' }} />
      <Tooltip title="Mapping Selection" trigger="click">
        <div style={{ padding: 10, background: '#f5f5f5', borderRadius: 5 }}>
          <Select
            placeholder="Select column"
            value={selectedColumn}
            onChange={handleColumnChange}
            options={datasource?.columns?.map((col: any) => ({ label: col.column_name, value: col.column_name }))}
            style={{ width: '100%', marginBottom: 10 }}
          />
          {mappings.map((mapping, index) => (
            <div key={index} style={{ display: 'flex', gap: 8, marginBottom: 5 }}>
              <Select
                placeholder="Select value"
                value={mapping.value}
                onChange={val => handleMappingChange(index, 'value', val)}
                options={columnValues.map(value => ({ label: value, value }))}
                style={{ flex: 1 }}
              />
              <Input
                placeholder="Enter input"
                value={mapping.userInput}
                onChange={e => handleMappingChange(index, 'userInput', e.target.value)}
                style={{ flex: 1 }}
              />
            </div>
          ))}
          <Button onClick={addMapping} style={{ width: '100%', marginTop: 10 }}>
            + Add Mapping
          </Button>
        </div>
      </Tooltip>
    </div>
  );
};

MappingSelectionControl.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.array,
  datasource: PropTypes.object.isRequired,
};

export default MappingSelectionControl;
