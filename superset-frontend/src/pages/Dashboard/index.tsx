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
import React, { FC, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { UserWithPermissionsAndRoles } from 'src/types/bootstrapTypes';
import { t } from '@superset-ui/core';
import './index.css';
import { DashboardPage } from 'src/dashboard/containers/DashboardPage';
//import ChatBOT from './bot';
import AlertList from '../AlertReportList';
import { addDangerToast, addSuccessToast } from 'src/components/MessageToasts/actions';

const DashboardRoute: FC = () => {
  const { idOrSlug } = useParams<{ idOrSlug: string }>();
  const [activeButton, setActiveButton] = useState<string>('Dashboard');
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

  const jsonFileMap: { [key: string]: string } = {
    Tech_Park: 'src/leftpanel/techpark.json',
    ford: 'src/leftpanel/ford.json',
  };

  const buttons = jsonFileMap[idOrSlug || ''] || '/defaultconfig.json';

  /*useEffect(() => {
    const fetchButtons = async () => {
      try {
        const response = await fetch(jsonPath);
        if (response.ok) {
          const data = await response.json();
          setButtons(Object.values(data));
        } else {
          console.error('Failed to load JSON configuration.');
        }
      } catch (error) {
        console.error('Error fetching JSON:', error);
      }
    };

    fetchButtons();
  }, [jsonPath]);*/

  const handleButtonClick = (button: any) => {
    setActiveButton(button.name);
  };

  //return <DashboardPage idOrSlug={idOrSlug} />;

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
        return <DashboardPage idOrSlug={activeButtonConfig.dashboardId} />;
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
      default:
        return <div style={{ textAlign: 'center', marginTop: '20px' }}>Unknown type: {activeButtonConfig.type}</div>;
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Left Panel with Buttons */}
      <div className="left-panel">
        <div className="buttons-container">
          {/* Default Dashboard Button */}
          <button
            className={`button ${activeButton === 'Dashboard' ? 'active' : ''}`}
            onClick={() => setActiveButton('Dashboard')}
          >
            <img src="/static/assets/images/dashboard.png" alt="Dashboard Icon" className="icon" />
            Dashboard
          </button>

          {/* Dynamic Buttons from JSON */}
          {buttons.map(button => (
            <button
              key={button.name}
              className={`button ${activeButton === button.name ? 'active' : ''}`}
              onClick={() => handleButtonClick(button)}
            >
              <img src={`/static/assets/images/${button.name.toLowerCase()}.png`} alt="Button Icon" className="icon" />
              {button.name}
            </button>
          ))}
        </div>
      </div>

      {/* Right Panel Content */}
      <div className="right-panel">{renderContent()}</div>
    </div>
  );
};

/*return (
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