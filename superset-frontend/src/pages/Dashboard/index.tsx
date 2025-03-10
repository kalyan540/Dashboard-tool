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
import JsonEditorControl from 'src/explore/components/controls/JsonEditorControl/index';

import techparkJson from 'src/leftpanel/techpark.json';
import fordJson from 'src/leftpanel/ford.json';
import lonzaJson from 'src/leftpanel/lonza.json';
import npdJson from 'src/leftpanel/npd.json';

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

  // Define the JSON file map
  const jsonFileMap: { [key: string]: ButtonConfig[] } = {
    Tech_Park: Object.values(techparkJson),
    ford: Object.values(fordJson),
    lonza: Object.values(lonzaJson),
    npd: Object.values(npdJson),
  };

  // State to hold the buttons data
  const [buttons, setButtons] = useState<ButtonConfig[]>(jsonFileMap[idOrSlug || ''] || []);

  // Callback function to handle JSON updates
  const handleJsonUpdate = (updatedJson: ButtonConfig[]) => {
    setButtons(updatedJson); // Update the state with the new JSON
    console.log('Updated JSON:', updatedJson); // Log the updated JSON (for debugging)

    // Optional: Save the updated JSON to local storage
    localStorage.setItem(`json_${idOrSlug}`, JSON.stringify(updatedJson));
  };

  const handleButtonClick = (button: ButtonConfig) => {
    setActiveButton(button.name);
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
      {/* Left Panel with Buttons */}
      <div className="left-panel">
        <div className="buttons-container">
          {/* Home Button and Three Dots Icon */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {/* Default Dashboard Button */}
            <button
              className={`button ${activeButton === 'Dashboard' ? 'active' : ''}`}
              onClick={() => setActiveButton('Dashboard')}
            >
              <img src="/static/assets/images/dashboard.png" alt="Dashboard Icon" className="icon" />
              Home
            </button>

            {/* Three Dots Icon with Border */}
            <div style={{ 
              border: '1px solid #ccc', 
              borderRadius: '4px', 
              cursor: 'pointer', 
              padding: '2px' ,
              backgroundColor: '#f0f0f0',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#617be3'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
            >
              <JsonEditorControl
                value={buttons}
                onChange={handleJsonUpdate} // Pass the callback function
                idOrSlug={idOrSlug} // Pass the dashboard identifier
              />
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
    </div>
  );
};

export default DashboardRoute;