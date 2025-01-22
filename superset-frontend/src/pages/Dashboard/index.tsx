import { FC, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { UserWithPermissionsAndRoles } from 'src/types/bootstrapTypes';
import { DashboardPage } from 'src/dashboard/containers/DashboardPage';
import ChatBOT from './bot';
import AlertList from '../AlertReportList';
import { addDangerToast, addSuccessToast } from 'src/components/MessageToasts/actions';
import buttonConfig1 from 'src/leftpanel/d1.json'; // First JSON file
import buttonConfig2 from 'src/leftpanel/d2.json'; // Second JSON file

const DashboardRoute: FC = () => {
  const { idOrSlug } = useParams<{ idOrSlug: string }>();
  const [activeButton, setActiveButton] = useState<string>('Dashboard');
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [buttons, setButtons] = useState<any>(null);
  const currentUser = useSelector<any, UserWithPermissionsAndRoles>(
    state => state.user,
  );

  // Load the correct JSON file based on dashboardId
  useEffect(() => {
    const declaredDashboardIds = ['13', '21']; // Declared dashboard IDs
    if (declaredDashboardIds.includes(idOrSlug || '')) {
      setButtons(idOrSlug === '13' ? buttonConfig1 : buttonConfig2);
    } else {
      setButtons(null); // No matching dashboardId, show empty left panel
    }
  }, [idOrSlug]);

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);

    // Fetch user list when the active button is "User Management"
    if (buttonName === 'User Management') {
      fetchUserList();
    }
  };

  const fetchUserList = async () => {
    try {
      const response = await fetch('/users/list/');
      if (response.ok) {
        const responseText = await response.text();
        setHtmlContent(responseText);
      } else {
        setHtmlContent('<h2>Error loading user management page</h2>');
      }
    } catch {
      setHtmlContent('<h2>Error loading user management page</h2>');
    }
  };

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

  return (
    <div style={{ display: 'flex' }}>
      {/* Left Panel */}
      <div className="left-panel">
        {buttons ? (
          <div className="buttons-container">
            {Object.keys(buttons).map(buttonKey => {
              const button = buttons[buttonKey];
              return (
                <button
                  key={buttonKey}
                  className={`button ${activeButton === button.name ? 'active' : ''}`}
                  onClick={() => handleButtonClick(button.name)}
                >
                  <img
                    src={`/static/assets/images/${button.type}.png`}
                    alt="Icon"
                    className="icon"
                  />
                  {button.name}
                </button>
              );
            })}
          </div>
        ) : (
          <div>
            <h2>No dashboards available</h2>
          </div>
        )}
      </div>

      {/* Right Panel */}
      <div className="right-panel">
        {buttons && activeButton === 'Dashboard' ? (
          <DashboardPage idOrSlug={idOrSlug} />
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
        ) : activeButton === 'ChatBot' ? (
          <ChatBOT />
        ) : activeButton === 'Alerts' ? (
          <AlertList
            addDangerToast={addDangerToast('Hello from Dashboard screen at DangerToast')}
            addSuccessToast={addSuccessToast('Hello from Dashboard screen at SuccessToast')}
            isReportEnabled={false}
            user={currentUser}
          />
        ) : activeButton === 'Reports' ? (
          <AlertList
            addDangerToast={addDangerToast('Hello from Dashboard screen at DangerToast')}
            addSuccessToast={addSuccessToast('Hello from Dashboard screen at SuccessToast')}
            isReportEnabled={true}
            user={currentUser}
          />
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
