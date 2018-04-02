import { withFalcor as withFalcorFactory } from 'react-falcor';

/**
 * This HOC simply passes through all props you provide it but in addition
 * it also gives the component that is passed as the parameter a falcor prop
 * which is the falcor model
 * @param {React.Component}
 * @returns {React.Component}
 */
export const withFalcor = withFalcorFactory('falcor');
