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


// Example JSON configurations
const buttonConfig1 = {
  Button1: { name: 'Dashboard', Type: 'dashboard', dashboardId: '13' },
  Button2: { name: 'Analytics', Type: 'dashboard', dashboardId: '15' },
  Button3: { name: 'User Management', Type: 'user', src: '/users/list' },
};

const buttonConfig2 = {
  Button1: { name: 'Dashboard', Type: 'dashboard', dashboardId: '21' },
  Button2: { name: 'Analytics', Type: 'dashboard', dashboardId: '21' },
  Button3: { name: 'User Management', Type: 'user', src: '/users/list' },
};

const DashboardRoute: FC = () => {
  const { idOrSlug } = useParams<{ idOrSlug: string }>();
  const [activeButton, setActiveButton] = useState<string>('Dashboard');
  const [activeDashboardId, setActiveDashboardId] = useState<string | null>(idOrSlug);
  const [htmlContent, setHtmlContent] = useState<string | null>(null);

  // Combine the two JSON files for the buttons
  const combinedButtonConfig = { ...buttonConfig1, ...buttonConfig2 };

  const handleButtonClick = (buttonKey: string) => {
    const button = combinedButtonConfig[buttonKey];
    setActiveButton(button.name);

    if (button.Type === 'dashboard' && button.dashboardId) {
      setActiveDashboardId(button.dashboardId); // Set the dashboard ID dynamically
      setHtmlContent(null); // Clear any existing iframe content
    } else if (button.Type === 'user') {
      // Load User Management Page
      setHtmlContent(
        `<iframe src="${button.src}" class="iframe-container" title="User Management"></iframe>`,
      );
      setActiveDashboardId(null); // Clear any existing dashboard ID
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Left Panel */}
      <div className="left-panel">
        {Object.keys(combinedButtonConfig).map((key) => {
          const button = combinedButtonConfig[key];
          return (
            <button
              key={key}
              className={`button ${activeButton === button.name ? 'active' : ''}`}
              onClick={() => handleButtonClick(key)}
            >
              <img
                src={`/static/assets/images/${button.name}.png`}
                alt={`${button.name} Icon`}
                className="icon"
              />
              {button.name}
            </button>
          );
        })}
      </div>

      {/* Right Panel */}
      <div className="right-panel">
        {activeDashboardId ? (
          <DashboardPage idOrSlug={activeDashboardId} />
        ) : htmlContent ? (
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        ) : (
          <div>
            <h2>No Content Available</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardRoute;
