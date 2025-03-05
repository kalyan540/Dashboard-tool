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

const DashboardRoute: FC = () => {
  const { idOrSlug } = useParams<{ idOrSlug: string }>();
  const [activeButton, setActiveButton] = useState<string>('Dashboard');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [jsonContent, setJsonContent] = useState<string>('');
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

        .home-button-container {
          display: flex;
          align-items: center;
          gap: 8px; /* Space between home button and three dots */
        }

        .three-dots-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
        }

        .three-dots-button img {
          width: 24px;
          height: 24px;
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
          z-index: 1000; /* Ensure modal is on top */
        }

        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          width: 50%;
          max-width: 600px;
          z-index: 1001; /* Ensure modal content is on top */
        }

        .modal-content textarea {
          width: 100%;
          height: 300px;
          margin-bottom: 16px;
        }

        .modal-content button {
          margin-right: 8px;
        }
      `}
    </style>
  );

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

  const jsonFileMap: { [key: string]: ButtonConfig[] } = {
    Tech_Park: Object.values(techparkJson),
    ford: Object.values(fordJson),
    lonza: Object.values(lonzaJson),
    npd: Object.values(npdJson),
  };

  const buttons: ButtonConfig[] = jsonFileMap[idOrSlug || ''] || [];

  const handleButtonClick = (button: ButtonConfig) => {
    setActiveButton(button.name);
  };

  const handleEditClick = () => {
    console.log('Edit button clicked'); // Debugging: Check if the function is triggered
    const jsonFile = jsonFileMap[idOrSlug || ''];
    if (jsonFile) {
      const jsonString = JSON.stringify(jsonFile, null, 2);
      console.log('JSON Content:', jsonString); // Debugging: Check the JSON content
      setJsonContent(jsonString);
      setIsEditing(true); // Ensure this is set to true
      console.log('isEditing:', true); // Debugging: Check if isEditing is set to true
    } else {
      console.error('No JSON file found for the current dashboard'); // Debugging: Check if JSON file is missing
      addDangerToast(t('No JSON file found for this dashboard'));
    }
  };

  const handleSave = () => {
    try {
      const updatedButtons = JSON.parse(jsonContent);
      jsonFileMap[idOrSlug || ''] = updatedButtons;
      setIsEditing(false);
      addSuccessToast(t('JSON updated successfully'));
    } catch (error) {
      console.error('Error parsing JSON:', error); // Debugging: Check for JSON parsing errors
      addDangerToast(t('Invalid JSON'));
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
        return <ChatBOT
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
      <div className="left-panel">
        <div className="buttons-container">
          <div className="home-button-container">
            <button
              className={`button ${activeButton === 'Dashboard' ? 'active' : ''}`}
              onClick={() => setActiveButton('Dashboard')}
            >
              <img src="/static/assets/images/dashboard.png" alt="Dashboard Icon" className="icon" />
              Home
            </button>
            <button
              className="three-dots-button"
              onClick={handleEditClick}
            >
              <img src="/static/assets/images/three-dots.png" alt="Edit Icon" className="icon" />
            </button>
          </div>

          {buttons.map((button, index) => (
            <React.Fragment key={index}>
              {button.divider && <div className="divider"></div>}
              <button
                key={button.name}
                className={`button ${activeButton === button.name ? 'active' : ''}`}
                onClick={() => handleButtonClick(button)}
              >
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

      <div className="right-panel">{renderContent()}</div>

      {isEditing && (
        <div className="modal">
          <div className="modal-content">
            <textarea
              value={jsonContent}
              onChange={(e) => setJsonContent(e.target.value)}
              style={{ width: '100%', height: '300px' }}
            />
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardRoute;