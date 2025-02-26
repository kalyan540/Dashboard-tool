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
import React, { FC, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { UserWithPermissionsAndRoles } from 'src/types/bootstrapTypes';
import { t } from '@superset-ui/core';
import './index.css';
import { DashboardPage } from 'src/dashboard/containers/DashboardPage';
import ChatBOT from './bot';
import AlertList from '../AlertReportList';
import { addDangerToast, addSuccessToast } from 'src/components/MessageToasts/actions';

import techparkJson from 'src/leftpanel/techpark.json';
import fordJson from 'src/leftpanel/ford.json';
import lonzaJson from 'src/leftpanel/lonza.json';
import npdJson from 'src/leftpanel/npd.json';
//import metricJson from 'src/leftpanel/metrics.json';

const DashboardRoute: FC = () => {
  const { idOrSlug } = useParams<{ idOrSlug: string }>();
  const [activeButton, setActiveButton] = useState<string>('Dashboard');
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [jsonContent, setJsonContent] = useState('');
  const currentUser = useSelector<any, UserWithPermissionsAndRoles>(
    state => state.user,
  );
  const injectCustomStyles = () => (
    <style>
      {`
        .panel-primary > .panel-heading {
            color: #fff !important;
            background-color: #fff !important;
            border-color: #fff !important;
        }
        .header-bar {
            background-color: #fff;
            height: 64px;
            display: flex;
            align-items: center;
            padding-left: 16px;
            box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.1);
            margin-bottom: 20px;
        }
        .header-bar h1 {
            font-size: 21px;
            font-weight: 600;
            font-family: 'Inter', Helvetica, Arial;
            color: #333;
            margin: 0;
        }

        .iframe-container {
            width: 100%;
            height: calc(100vh - 64px); /* Adjust height based on header size */
            border: none;
            overflow: hidden;
        }
      `}
    </style>
  );

  // Define the interface for button configuration
  interface ButtonConfig {
    name: string;
    type: string;
    dashboardId?: string;
    src?: string;
    schema?: any;
    suggestions?: any;
    icon?: string;
    divider?: boolean;
  }

  // Define the type for jsonFileMap
  const jsonFileMap: { [key: string]: ButtonConfig[] } = {
    Tech_Park: Object.values(techparkJson),
    ford: Object.values(fordJson),
    lonza: Object.values(lonzaJson),
    npd: Object.values(npdJson),
    //Home: Object.values(metricJson),
  };

  const buttons: ButtonConfig[] = jsonFileMap[idOrSlug || ''] || [];

  const handleButtonClick = (button: ButtonConfig) => {
    setActiveButton(button.name);
  };

  const handleOpenJsonModal = () => {
    const jsonData = JSON.stringify(jsonFileMap[idOrSlug || ''] || {}, null, 2);
    setJsonContent(jsonData);
    setShowJsonModal(true);
  };

  const handleSaveJson = () => {
    try {
      const updatedJson = JSON.parse(jsonContent);
      console.log('Updated JSON:', updatedJson);
      alert('JSON saved successfully! (Implement backend to persist changes)');
    } catch (error) {
      alert('Invalid JSON format!');
    }
  };


  const renderContent = () => {
    if (activeButton === 'Dashboard') {
      return <DashboardPage idOrSlug={idOrSlug} />;
    }

    const activeButtonConfig = buttons.find(button => button.name === activeButton);

    if (!activeButtonConfig) {
      return <div style={{ textAlign: 'center', marginTop: '20px' }}>This page is in development.</div>;
    }

    switch (activeButtonConfig.type) {
      case 'dashboard':
        if (activeButtonConfig.dashboardId && activeButtonConfig.dashboardId !== '') {
          return <DashboardPage idOrSlug={activeButtonConfig.dashboardId} />;
        } else {
          return (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', textAlign: 'center' }}>
              <h2>This page is in development.</h2>
            </div>
          );
        }
      case 'iframe':
        return (
          <>
            {injectCustomStyles()}
            <div>
              <div className="header-bar">
                <h1>User Management</h1>
              </div>
              <iframe
                src={activeButtonConfig.src}
                className="iframe-container"
                title={activeButtonConfig.name}
              />
            </div>
          </>
        );
      case 'alert':
        return <AlertList
          addDangerToast={addDangerToast(t('Hello from Dashboard screen at DangerToast'))}
          addSuccessToast={addSuccessToast(t('Hello from Dashboard screen at SuccessToast'))}
          isReportEnabled={false}
          user={currentUser}
        />;
      case 'report':
        return <AlertList
          addDangerToast={addDangerToast(t('Hello from Dashboard screen at DangerToast'))}
          addSuccessToast={addSuccessToast(t('Hello from Dashboard screen at SuccessToast'))}
          isReportEnabled={true}
          user={currentUser}
        />;
      case 'chatbot':
        console.log(activeButtonConfig.schema.columns);
        return <ChatBOT
          //schema={activeButtonConfig.schema}
          tableName={activeButtonConfig.schema.table_name}
          columns={activeButtonConfig.schema.columns}
          primaryKey={activeButtonConfig.schema.primary_key}
          foreignKeys={activeButtonConfig.schema.foreign_keys}
          queries={activeButtonConfig.suggestions}
        />;
      default:
        return <div style={{ textAlign: 'center', marginTop: '20px' }}>Unknown type: {activeButtonConfig.type}</div>;
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Left Panel with Buttons */}
      <div className="left-panel">
        <div className="buttons-container">
          {/* Home Button with Three-Dots Menu */}
          <div className="home-container">
            <button className={`button ${activeButton === 'Dashboard' ? 'active' : ''}`} onClick={() => setActiveButton('Dashboard')}>
              <img src="/static/assets/images/dashboard.png" alt="Dashboard Icon" className="icon" />
              Home
            </button>
            <div className="menu-button" onClick={handleOpenJsonModal}>
              <span className="vertical-dots">&#8942;</span> {/* Vertical three-dots menu */}
            </div>
          </div>

          {/* Dynamic Buttons from JSON */}
          {buttons.map((button, index) => (
            <React.Fragment key={index}>
              {button.divider && <div className="divider"></div>}
              <button
                key={button.name}
                className={`button ${activeButton === button.name ? 'active' : ''}`}
                onClick={() => handleButtonClick(button)}
              >
                {/* Render Icon Dynamically */}
                {button.icon && (
                  <img
                    src={button.icon}
                    alt={`${button.name} Icon`}
                    className="icon"
                  />
                )}
                {button.name}
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Right Panel Content */}
      <div className="right-panel">{renderContent()}</div>
      {/* JSON Edit Modal */}
      {showJsonModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit JSON for {idOrSlug}</h2>
            <textarea value={jsonContent} onChange={e => setJsonContent(e.target.value)} rows={15} cols={50} />
            <div className="modal-buttons">
              <button onClick={handleSaveJson}>Save</button>
              <button onClick={() => setShowJsonModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Styles */}
      <style>
        {`
          .home-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 5px;
          }
          .menu-button {
            cursor: pointer;
            padding: 5px;
            margin-left: 10px;
            display: flex;
            align-items: center;
          }
          .vertical-dots {
            font-size: 20px;
          }
          .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .modal-content {
            background: white;
            padding: 20px;
            border-radius: 5px;
            min-width: 400px;
          }
        `}
      </style>
    </div>
      
  );
};

/*return (<img src={`/static/assets/images/${button.name.toLowerCase()}.png`} alt="Button Icon" className="icon" />
  <div style={{ display: "flex" }}>
    {/* Left Panel with Buttons }
    <div className="left-panel">
      <div className="buttons-container">
        <button
          className={`button ${activeButton === 'Dashboard' ? 'active' : ''}`}
          onClick={() => handleButtonClick('Dashboard')}
        >
          <img src="/static/assets/images/dashboard.png" alt="Icon" className="icon" />
          Dashboard
        </button>

        <button
          className={`button ${activeButton === 'Analytics' ? 'active' : ''}`}
          onClick={() => handleButtonClick('Analytics')}
        >
          <img src="/static/assets/images/Analytics.png" alt="Icon" className="icon" />
          Analytics
        </button>

        <button
          className={`button ${activeButton === 'ChatBot' ? 'active' : ''}`}
          onClick={() => handleButtonClick('ChatBot')}
        >
          <img src="/static/assets/images/chatboticon.png" alt="Icon" className="icon" />
          ChatBot
        </button>


      </div>
      <div className="divider"></div>
      <div className="user-management">
        <button
          className={`button ${activeButton === 'User Management' ? 'active' : ''}`}
          onClick={() => handleButtonClick('User Management')}
        >
          <img src="/static/assets/images/user.png" alt="Icon" className="icon" />
          User Management
        </button>
      </div>
    </div>

    {/* Right Panel Content }
<div className="right-panel">
{activeButton === 'Dashboard' ? (
  <div className="dashboard-container">
    <DashboardPage idOrSlug={idOrSlug} />
  </div>
) : activeButton === 'User Management' ? (
  <>
    {injectCustomStyles()}
    <div>
      <div className="header-bar">
        <h1>User Management</h1>
      </div>
      <iframe
        src="/users/list"
        className="iframe-container"
        title="User Management"
      />
    </div>
  </>
) : activeButton === 'Alerts' ? (
  <AlertList
    addDangerToast={addDangerToast(t('Hello from Dashboard screen at DangerToast'))}
    addSuccessToast={addSuccessToast(t('Hello from Dashboard screen at SuccessToast'))}
    isReportEnabled={false}
    user={currentUser}
  />
) : activeButton === 'Reports' ? (
  <AlertList
    addDangerToast={addDangerToast(t('Hello from Dashboard screen at DangerToast'))}
    addSuccessToast={addSuccessToast(t('Hello from Dashboard screen at SuccessToast'))}
    isReportEnabled={true}
    user={currentUser}
  />
) : activeButton === 'ChatBot' ? (
  <ChatBOT />
) : activeButton === 'Analytics' ? (
  <DashboardPage idOrSlug={'15'} />
) : (
  <div>
    <h2>This page is in development.</h2>
  </div>
)}
</div>
  </div >
);

};*/

export default DashboardRoute;
/*
<button
            className={`button ${activeButton === 'Alerts' ? 'active' : ''}`}
            onClick={() => handleButtonClick('Alerts')}
          >
            <img src="/static/assets/images/Alerts.png" alt="Icon" className="icon" />
            Alerts
          </button>

          <button
            className={`button ${activeButton === 'Reports' ? 'active' : ''}`}
            onClick={() => handleButtonClick('Reports')}
          >
            <img src="/static/assets/images/Reports.png" alt="Icon" className="icon" />
            Reports
          </button>

*/