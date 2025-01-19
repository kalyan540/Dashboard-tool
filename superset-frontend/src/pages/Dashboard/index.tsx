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
import { FC, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { UserWithPermissionsAndRoles } from 'src/types/bootstrapTypes';
import { t } from '@superset-ui/core';
import './index.css';
import { DashboardPage } from 'src/dashboard/containers/DashboardPage';
import ChatBOT from './bot';
import AlertList from '../AlertReportList';
import { addDangerToast, addSuccessToast } from 'src/components/MessageToasts/actions';

const DashboardRoute: FC = () => {
  const { idOrSlug } = useParams<{ idOrSlug: string }>();
  const [activeButton, setActiveButton] = useState<string>('Dashboard');
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
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
      `}
    </style>
  );
  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);

    // Fetch user list when the active button is "User Management"
    if (buttonName === 'User Management') {
      fetchUserList();
    }
  };
  const fetchUserList = async () => {
    try {
      // Get the base URL (e.g., http://localhost:9000)
      const baseUrl = window.location.origin;

      // Build the full URL for the API request
      const apiUrl = `${baseUrl}/users/list/`;

      // Fetch user list from the API
      const response = await fetch(apiUrl);

      // If the response is OK, save the response body as text
      if (response.ok) {
        const responseText = await response.text(); // Parse the response as text
        setHtmlContent(responseText); // Save the HTML content in state
      } else {
        console.error('Error fetching data:', response.status);
        setHtmlContent('<h2>Error loading user management page</h2>'); // Show an error message
      }
    } catch (error) {
      console.error('Error fetching user list:', error);
      setHtmlContent('<h2>Error loading user management page</h2>'); // Show an error message
    }
  };
  //return <DashboardPage idOrSlug={idOrSlug} />;

  return (
    <div style={{ display: "flex" }}>
      {/* Left Panel with Buttons */}
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
            className={`button ${activeButton === 'Assetmodal' ? 'active' : ''}`}
            onClick={() => handleButtonClick('Assetmodal')}
          >
            <img src="/static/assets/images/assetmodal.png" alt="Icon" className="icon" />
            Asset Modal
          </button>

          <button
            className={`button ${activeButton === 'Alerts' ? 'active' : ''}`}
            onClick={() => handleButtonClick('Alerts')}
          >
            <img src="/static/assets/images/Alerts.png" alt="Icon" className="icon" />
            Alerts
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

      {/* Right Panel Content */}
      <div className="right-panel">
        {activeButton === 'Dashboard' ? (
          <div className="dashboard-container">
            <DashboardPage idOrSlug={idOrSlug} />
          </div>
        ) : activeButton === 'User Management' ? (
          <>
            {injectCustomStyles()}
            <div>
              {/* Header Bar */}
              <div className="header-bar">
                <h1>User Management</h1>
              </div>
              {/* Render HTML Content */}
              <div
                dangerouslySetInnerHTML={{
                  __html: htmlContent || '<h2>Loading User Management Page...</h2>',
                }}
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
    </div>
  );

};

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

          <button
            className={`button ${activeButton === 'ChatBot' ? 'active' : ''}`}
            onClick={() => handleButtonClick('ChatBot')}
          >
            <img src="/static/assets/images/chatboticon.png" alt="Icon" className="icon" />
            ChatBot
          </button>

*/