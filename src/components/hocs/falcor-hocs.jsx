import React from 'react';
import { getDisplayName } from 'lib/higher-order-helpers';

import falcorShape from 'react-falcor/src/utils/falcorShape';
import { falcorGet } from 'react-falcor';

import CircularProgress from 'material-ui/CircularProgress';

/**
 * This HOC simply passes through all props you provide it but in addition
 * it also sets the falcorModel prop to be the falcor model which you can call
 * .get, .set, .call on etc. This is copy pasted of the PR I made to react-falcor
 * and should be replaced if that PR is merged in.
 */
export const withFalcor = (({
  prop = 'falcorModel',
} = {}) => WrappedComponent => {
  const InjectFalcorModel = (props, context) => (
    <WrappedComponent {...props} {...{ [prop]: context.falcor.model }} />
  );

  InjectFalcorModel.displayName = `injectFalcorModel(${getDisplayName(
    WrappedComponent,
  )})`;

  InjectFalcorModel.contextTypes = {
    falcor: falcorShape,
  };

  return InjectFalcorModel;
})({ prop: 'falcor' });

const Loading = () => (
  <div
    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
  >
    <CircularProgress style={{ flexGrow: 1 }} />
  </div>
);

/**
 * This HOC factory allows you to provide data from falcor as props to your component.
 * Remember it is a HOC factory so you have to provide it with the pathSets and possibly
 * the propMerger which returns the actual HOC that you wrap your component in.
 * @param {*} pathSets - This either takes a function which outputs the pathsets where the input
 * is the current props, or it takes hardcoded pathsets. In both cases the pathsets can either be
 * a single Falcor pathset, or an array of pathsets (which may possibly be a 3 level nested array)
 * @param {func} [propMerger] - This function takes the falcor response (which is of the structure
 * { json: objectWithPathSetsRequestedStructure }) and your current props as the arguments. The
 * output is going to be all the props your wrapped component will receive. The default simply places
 * the data in the props with names corresponding to the top level keys in the path sets.
 * see https://github.com/ratson/react-falcor/blob/0d2cefcbc71ca21465307182ec8495262e945362/src/components/falcorGet.js#L13-L22
 * for the default implementation
 * @returns {func} a HOC that can provide a component with the given pathSets to the specified props
 */
export const withFalcorQuery = (pathSets, propMerger) =>
  falcorGet(pathSets, propMerger, {
    getDisplayName: name => `withFalcorQuery(${name})`,
    pure: false,
    defer: true,
    loadingComponent: Loading,
  });
