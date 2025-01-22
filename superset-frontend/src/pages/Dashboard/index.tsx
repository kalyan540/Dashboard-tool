import { FC, useState, useEffect } from 'react';
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
  const [menuConfig, setMenuConfig] = useState<any>(null);
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const currentUser = useSelector<any, UserWithPermissionsAndRoles>(state => state.user);

  // Fetch the menu configuration from d1.json
  useEffect(() => {
    const fetchMenuConfig = async () => {
      try {
        const response = await fetch('/src/leftpanel/d1.json');
        if (!response.ok) throw new Error('Error loading menu config');
        const config = await response.json();
        setMenuConfig(config); // Set the menu configuration
      } catch (error) {
        console.error('Error loading menu configuration:', error);
      }
    };

    fetchMenuConfig();
  }, []);

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

  const handleButtonClick = (buttonName: string, dashboardId: string | null, src: string | null) => {
    setActiveButton(buttonName);

    // Fetch user list when the active button is "User Management"
    if (buttonName === 'User Management') {
      fetchUserList();
    }

    if (dashboardId) {
      // Update the dashboard page based on dashboardId
      setActiveButton(buttonName);
    }
  };

  const fetchUserList = async () => {
    try {
      const baseUrl = window.location.origin;
      const apiUrl = `${baseUrl}/users/list/`;

      const response = await fetch(apiUrl);
      if (response.ok) {
        const responseText = await response.text();
        setHtmlContent(responseText);
      } else {
        console.error('Error fetching data:', response.status);
        setHtmlContent('<h2>Error loading user management page</h2>');
      }
    } catch (error) {
      console.error('Error fetching user list:', error);
      setHtmlContent('<h2>Error loading user management page</h2>');
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Left Panel with Buttons */}
      <div className="left-panel">
        <div className="buttons-container">
          {menuConfig &&
            Object.keys(menuConfig).map((buttonKey) => {
              const button = menuConfig[buttonKey];
              const { name, type, dashboardId, src } = button;

              return (
                <button
                  key={buttonKey}
                  className={`button ${activeButton === name ? 'active' : ''}`}
                  onClick={() => handleButtonClick(name, dashboardId || null, src || null)}
                >
                  <img
                    src={`/static/assets/images/${name.toLowerCase()}.png`}
                    alt="Icon"
                    className="icon"
                  />
                  {name}
                </button>
              );
            })}
        </div>
      </div>

      {/* Right Panel Content */}
      <div className="right-panel">
        {activeButton === 'Dashboard' && (
          <div className="dashboard-container">
            {dashboardId ? <DashboardPage idOrSlug={dashboardId.toString()} /> : <div>No Dashboard</div>}
          </div>
        )}

        {activeButton === 'User Management' && (
          <>
            {injectCustomStyles()}
            <div>
              <div className="header-bar">
                <h1>User Management</h1>
              </div>
              <iframe src="/users/list" className="iframe-container" title="User Management" />
            </div>
          </>
        )}

        {activeButton === 'ChatBot' && <ChatBOT />}

        {activeButton === 'Analytics' && (
          <DashboardPage idOrSlug="15" />
        )}

        {activeButton === 'Alerts' && (
          <AlertList
            addDangerToast={addDangerToast(t('Hello from Dashboard screen at DangerToast'))}
            addSuccessToast={addSuccessToast(t('Hello from Dashboard screen at SuccessToast'))}
            isReportEnabled={false}
            user={currentUser}
          />
        )}

        {activeButton === 'Reports' && (
          <AlertList
            addDangerToast={addDangerToast(t('Hello from Dashboard screen at DangerToast'))}
            addSuccessToast={addSuccessToast(t('Hello from Dashboard screen at SuccessToast'))}
            isReportEnabled={true}
            user={currentUser}
          />
        )}

        {activeButton === 'Analytics' && (
          <DashboardPage idOrSlug={'15'} />
        )}

        {activeButton !== 'Dashboard' && activeButton !== 'User Management' && activeButton !== 'Analytics' && (
          <div>
            <h2>This page is in development.</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardRoute;
