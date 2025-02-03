import React from 'react';
import ChartRenderer from './ChartRenderer';
import { useID } from 'src/views/idOrSlugContext';

const ChartRendererWrapper = props => {
    const { updateidOrSlug } = useID(); // Get the update function

    // Pass `updateidOrSlug` as a prop to the class component
    return <ChartRenderer {...props} updateidOrSlug={updateidOrSlug} />;
};

export default ChartRendererWrapper;
