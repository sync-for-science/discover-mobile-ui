import { combineReducers, compose, configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';

import authReducer from '../features/auth/authSlice';
import {
  flattenedResourcesReducer,
  resourceTypesReducer,
  resourceTypeFiltersReducer,
  dateRangeFilterReducer,
  collectionsReducer,
  selectedCollectionReducer,
  showCollectionOnlyReducer,
  showMarkedOnlyReducer,
} from './reducers';
import epicMiddleware, { rootEpic } from './epics';

const rootReducer = combineReducers({
  auth: authReducer,
  resources: flattenedResourcesReducer,
  resourceIdsGroupedByType: resourceTypesReducer,
  resourceTypeFilters: resourceTypeFiltersReducer,
  dateRangeFilter: dateRangeFilterReducer,
  collections: collectionsReducer,
  selectedCollection: selectedCollectionReducer,
  showCollectionOnly: showCollectionOnlyReducer,
  showMarkedOnly: showMarkedOnlyReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: compose([
    thunk,
    epicMiddleware,
    // routerMiddleware(history), // < e.g.: other middleware
  ]),
  devTools: {
    serialize: true, // See: https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md#serialize
  },
});

epicMiddleware.run(rootEpic);

export default store;
