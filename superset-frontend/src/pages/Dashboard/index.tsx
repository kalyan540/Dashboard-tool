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
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [dashboardId, setDashboardId] = useState<string | null>(null);
  const [menuConfig, setMenuConfig] = useState<Record<string, any>>({});
  const currentUser = useSelector<any, UserWithPermissionsAndRoles>(
    state => state.user,
  );

  // Load menu configuration from JSON
  useEffect(() => {
    const fetchMenuConfig = async () => {
      try {
        const response = await fetch('/src/leftpanel/d1.json'); // Adjust the path as needed
        const data = await response.json();
        setMenuConfig(data);
      } catch (error) {
        console.error('Error loading menu configuration:', error);
      }
    };
    fetchMenuConfig();
  }, []);

  const handleButtonClick = (buttonKey: string) => {
    const buttonConfig = menuConfig[buttonKey];
    setActiveButton(buttonKey);

    if (buttonConfig?.type === 'dashboard') {
      setDashboardId(buttonConfig.dashboardId);
    } else if (buttonConfig?.type === 'user') {
      setDashboardId(null);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Left Panel */}
      <div className="left-panel">
        <div className="buttons-container">
          {Object.entries(menuConfig).map(([key, config]) => (
            <button
              key={key}
              className={`button ${activeButton === key ? 'active' : ''}`}
              onClick={() => handleButtonClick(key)}
            >
              <img src="/static/assets/images/default-icon.png" alt="Icon" className="icon" />
              {config.name}
            </button>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="right-panel">
        {dashboardId ? (
          <DashboardPage idOrSlug={dashboardId} />
        ) : activeButton === 'User Management' ? (
          <>
            <div className="header-bar">
              <h1>User Management</h1>
            </div>
            <iframe
              src="/users/list"
              className="iframe-container"
              title="User Management"
            />
          </>
        ) : activeButton === 'ChatBot' ? (
          <ChatBOT />
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
