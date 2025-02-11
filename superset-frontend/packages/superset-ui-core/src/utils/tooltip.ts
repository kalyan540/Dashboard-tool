/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
//import { t } from '../translation';

const TRUNCATION_STYLE = `
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MULTILINE_STYLE = `
  width: 300px; 
  word-wrap: break-word; 
  white-space: normal;
`;

export function tooltipHtml(
  data?: string[][],
  title?: string,
  focusedRow?: number,
  customText?: string,
) {
  const titleRow = title
    ? `<span style="font-weight: 700;${TRUNCATION_STYLE}">${title}</span>`
    : '';
  
  const customTextRow = customText
    ? `<div style="font-weight: 700; margin-bottom: 8px; ${MULTILINE_STYLE}">${customText}</div>`
    : '';
  
    const Table = Array.isArray(data) && data.length > 0
    ? `<table>
          ${data
            .map((row, i) => {
              const rowStyle =
                i === focusedRow ? 'font-weight: 700;' : 'opacity: 0.8;';
              const cells = row.map((cell, j) => {
                const cellStyle = `
                  text-align: ${j > 0 ? 'right' : 'left'};
                  padding-left: ${j === 0 ? 0 : 16}px;
                  ${TRUNCATION_STYLE}
                `;
                return `<td style="${cellStyle}">${cell}</td>`;
              });
              return `<tr style="${rowStyle}">${cells.join('')}</tr>`;
            })
            .join('')}
      </table>`
    : '';//`<table><tr><td>${t('No data')}</td></tr></table>`;
  
  return `
    <div>
      ${titleRow}
      ${Table}
      ${customTextRow}
    </div>`;
}
