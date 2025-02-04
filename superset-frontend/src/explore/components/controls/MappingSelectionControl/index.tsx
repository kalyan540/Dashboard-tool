import React, { useState } from 'react';
import Button from 'src/components/Button'; // Using your custom Button component
import ControlPopover from '../ControlPopover/ControlPopover';

const MappingSelectionControl: React.FC = () => {
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);

  // Function to toggle popover visibility
  const togglePopover = () => {
    setIsPopoverVisible(!isPopoverVisible);
  };

  return (
    <div>
      {/* ControlPopover with visibility toggle */}
      <ControlPopover
        visible={isPopoverVisible} // Controls visibility of the popover
        onVisibleChange={(visible) => setIsPopoverVisible(visible)} // Toggle visibility
        trigger="click" // Trigger the popover on button click
        placement="right" // Position of the popover
        destroyTooltipOnHide={true} // Optionally destroy on hide for performance
        getPopupContainer={(triggerNode) => triggerNode.parentElement || document.body}
      >
        {/* Button that will trigger the popover */}
        <Button 
          onClick={togglePopover} 
          buttonSize="small" 
          buttonStyle="default" 
          cta={true}
          placement="right"
        >
          Open Popover
        </Button>

        {/* Content inside the ControlPopover */}
        <div>
          This is a custom ControlPopover message! You can add more controls here.
        </div>
      </ControlPopover>
    </div>
  );
};

export default MappingSelectionControl;