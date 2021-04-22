import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { produce } from 'immer';
import { clone } from 'ramda';

import { actionTypes } from '../action-types';
import processResource from './process-resources';
import { PLURAL_RESOURCE_TYPES } from '../../resources/resourceTypes';
import { UNMARKED, MARKED, FOCUSED } from '../../constants/marked-status';

const preloadedResources = {};

export const flattenedResourcesReducer = (state = preloadedResources, action) => {
  switch (action.type) {
    case actionTypes.CLEAR_PATIENT_DATA: {
      return preloadedResources;
    }
    case actionTypes.FHIR_FETCH_SUCCESS: {
      const newState = { ...state }; // detect mutation
      processResource(newState, action.payload, 0);
      return newState;
    }
    default:
      return state;
  }
};

// prune items whose values are 0, null, undefined, or empty string:
// const pruneEmpty = ((o) => Object.entries(o)
//   .filter(([, v]) => v)
//   .reduce((acc, [id, v]) => ({ ...acc, [id]: v }), {}));

const createCollection = (label = 'Untitled Collection') => {
  const timeCreated = new Date();

  return {
    id: uuidv4(),
    created: timeCreated,
    lastUpdated: timeCreated,
    label,
    selectedResourceType: null,
    resourceTypeFilters: Object.keys(PLURAL_RESOURCE_TYPES)
      .reduce((acc, resourceType) => ({
        ...acc,
        [resourceType]: true,
      }), {}),
    dateRangeFilter: {
      dateRangeStart: undefined,
      dateRangeEnd: undefined,
    },
    showCollectionOnly: false,
    showMarkedOnly: false,
    focusedSubtype: '',
    records: {},
  };
};

const createNewCollectionRecord = () => ({
  saved: false,
  dateSaved: null,
  highlight: UNMARKED,
  // highlight:
  //   0 -- unmarked
  //   1 -- marked
  //   2 -- focused
});

const defaultCollection = createCollection();

const preloadCollections = {
  [defaultCollection.id]: defaultCollection,
};

export const collectionsReducer = (state = preloadCollections, action) => {
  switch (action.type) {
    case actionTypes.CLEAR_PATIENT_DATA: {
      const newDefaultCollection = createCollection();
      return {
        [newDefaultCollection.id]: newDefaultCollection,
      };
    }
    case actionTypes.ADD_RESOURCE_TO_COLLECTION: {
      const { collectionId, resourceIds } = action.payload;
      return produce(state, (draft) => {
        resourceIds.forEach((id) => {
          const { records } = draft[collectionId]; // eslint-disable-line no-param-reassign
          records[id] = records[id] ?? createNewCollectionRecord();
          records[id].saved = true;
          records[id].dateSaved = new Date();
        });
      });
    }
    case actionTypes.SELECT_RESOURCE_TYPE: {
      const { collectionId, resourceType } = action.payload;
      return produce(state, (draft) => {
        // eslint-disable-next-line no-param-reassign
        draft[collectionId].selectedResourceType = resourceType;
      });
    }
    case actionTypes.TOGGLE_RESOURCE_TYPE_FILTERS: {
      const { collectionId, resourceType } = action.payload;
      return produce(state, (draft) => {
        const prevValue = draft[collectionId].resourceTypeFilters[resourceType];
        // eslint-disable-next-line no-param-reassign
        draft[collectionId].resourceTypeFilters[resourceType] = !prevValue;
      });
    }
    case actionTypes.UPDATE_DATE_RANGE_FILTER: {
      const { collectionId, dateRangeStart, dateRangeEnd } = action.payload;
      return produce(state, (draft) => {
        if (dateRangeStart) {
          // eslint-disable-next-line no-param-reassign
          draft[collectionId].dateRangeFilter.dateRangeStart = dateRangeStart;
        }
        if (dateRangeEnd) {
          // eslint-disable-next-line no-param-reassign
          draft[collectionId].dateRangeFilter.dateRangeEnd = dateRangeEnd;
        }
      });
    }
    case actionTypes.REMOVE_RESOURCE_FROM_COLLECTION: {
      const { collectionId, resourceIds } = action.payload;
      return produce(state, (draft) => {
        resourceIds.forEach((id) => {
          const { records } = draft[collectionId]; // eslint-disable-line no-param-reassign
          records[id] = records[id] ?? {};
          records[id].saved = false;
          records[id].dateSaved = null;
        });
      });
    }
    case actionTypes.UPDATE_MARKED_RESOURCES: {
      const { collectionId, subType, resourceIdsMap } = action.payload;

      return produce(state, (draft) => {
        const collection = draft[collectionId];
        const { records } = collection;
        const deFocus = (!subType || subType !== collection.focusedSubtype);
        collection.focusedSubtype = subType;
        if (deFocus) {
          Object.values(records).forEach((attributes) => {
            const prevValue = attributes.highlight;
            attributes.highlight = (prevValue === FOCUSED ? MARKED : prevValue); // eslint-disable-line max-len, no-param-reassign
          });
        }
        Object.entries(resourceIdsMap)
          .forEach(([id, next]) => {
            records[id] = records[id] ?? createNewCollectionRecord();
            const { highlight: prev } = records[id];
            records[id].highlight = ((prev === MARKED && next === FOCUSED) ? FOCUSED : next);
          });
      });
    }
    case actionTypes.CLEAR_MARKED_RESOURCES: {
      const collectionId = action.payload;
      return produce(state, (draft) => {
        Object.values(draft[collectionId].records).forEach((attributes) => {
          attributes.highlight = UNMARKED; // eslint-disable-line no-param-reassign
        });
      });
    }
    case actionTypes.CREATE_COLLECTION: {
      const newCollection = createCollection(action.payload);
      return {
        ...state,
        [newCollection.id]: newCollection,
      };
    }
    case actionTypes.DELETE_COLLECTION: {
      const newState = { ...state };
      delete newState[action.payload.collectionId];
      return newState;
    }
    case actionTypes.RENAME_COLLECTION: {
      const updatedCollection = { ...state[action.payload.collectionId] };
      updatedCollection.label = action.payload.collectionName;
      return { ...state, [action.payload.collectionId]: updatedCollection };
    }
    case actionTypes.CLEAR_COLLECTION: {
      const collectionId = action.payload;
      return produce(state, (draft) => {
        Object.values(draft[collectionId].records).forEach((attributes) => {
          attributes.saved = false; // eslint-disable-line no-param-reassign
          attributes.dateSaved = null; // eslint-disable-line no-param-reassign
        });
      });
    }
    case actionTypes.DUPLICATE_COLLECTION: {
      const { collectionId, collectionName } = action.payload;
      const originalCollection = state[collectionId];
      const newCollection = clone(originalCollection);
      newCollection.id = uuidv4();
      newCollection.label = collectionName;
      return {
        ...state,
        [newCollection.id]: newCollection,
      };
    }
    case actionTypes.TOGGLE_SHOW_COLLECTION_ONLY: {
      const { collectionId, showCollectionOnly } = action.payload;
      return produce(state, (draft) => {
        // eslint-disable-next-line no-param-reassign
        draft[collectionId].showCollectionOnly = showCollectionOnly;
      });
    }
    case actionTypes.TOGGLE_SHOW_MARKED_ONLY: {
      const { collectionId, showMarkedOnly } = action.payload;
      return produce(state, (draft) => {
        // eslint-disable-next-line no-param-reassign
        draft[collectionId].showMarkedOnly = showMarkedOnly;
      });
    }
    default:
      return state;
  }
};

export const activeCollectionIdReducer = (state = null, action) => {
  switch (action.type) {
    case actionTypes.CLEAR_PATIENT_DATA: {
      return null;
    }
    case actionTypes.SELECT_COLLECTION: {
      return action.payload;
    }
    case actionTypes.DELETE_COLLECTION: {
      return null;
    }
    default:
      return state;
  }
};
