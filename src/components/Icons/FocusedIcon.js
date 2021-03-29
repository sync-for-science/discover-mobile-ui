import {
  arrayOf, shape, func, string, bool,
} from 'prop-types';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Text } from 'native-base';

import Colors from '../../constants/Colors';
import { actionTypes } from '../../redux/action-types';
import {
  markedResourcesSelector,
} from '../../redux/selectors';
import { MARKED, FOCUSED } from '../../constants/marked-status';

const FocusedIcon = ({
  subType,
  resourceIds,
  isAccordion,
  updateFocusedResources,
  markedResources,
}) => {
  const { marked } = markedResources;

  const markedOrFocusedCount = resourceIds.reduce((acc, id) => (marked[id] ? acc + 1 : acc), 0);

  const focusedCount = resourceIds.reduce((acc, id) => (marked[id] === FOCUSED ? acc + 1 : acc), 0);
  const markedCount = resourceIds.reduce((acc, id) => (marked[id] === MARKED ? acc + 1 : acc), 0);
  const allAreFocused = resourceIds.length === focusedCount;
  const fullyFocused = focusedCount && (markedCount === 0);

  const handlePress = () => {
    if (isAccordion) { // could be one or more resourceId:
      const newSubType = allAreFocused ? '' : subType; // no subType if turning all off
      const resourceIdsMap = resourceIds.reduce((acc, id) => ({
        ...acc,
        // eslint-disable-next-line max-len, no-nested-ternary
        [id]: (marked[id] && fullyFocused) ? MARKED : (marked[id] === MARKED ? FOCUSED : marked[id]),
      }), {});
      updateFocusedResources(newSubType, resourceIdsMap);
    } else {
      // (unmarked or marked) > focused > marked
      updateFocusedResources(subType, { [resourceIds[0]]: (focusedCount ? MARKED : FOCUSED) });
    }
  };

  const iconCount = null;
  // eslint-disable-next-line no-nested-ternary, max-len
  const iconStyle = (fullyFocused ? styles.fullyFocused : (focusedCount ? styles.partialFocused : (markedOrFocusedCount) ? styles.hasMarked : styles.unmarked));

  return (
    <TouchableOpacity
      style={[
        styles.base,
        iconStyle,
      ]}
      {...{ onPress: (iconStyle === styles.unmarked ? undefined : handlePress) }}
    >
      <Text style={styles.text}>{iconCount}</Text>
    </TouchableOpacity>
  );
};

FocusedIcon.propTypes = {
  subType: string.isRequired,
  resourceIds: arrayOf(string.isRequired).isRequired,
  isAccordion: bool.isRequired,
  updateFocusedResources: func.isRequired,
  markedResources: shape({
    focusedSubtype: string.isRequired,
    marked: shape({}).isRequired,
  }).isRequired,
};

FocusedIcon.defaultProps = {
};

const mapStateToProps = (state) => ({
  markedResources: markedResourcesSelector(state),
});

const mapDispatchToProps = {
  updateFocusedResources: (subType, resourceIdsMap) => ({
    type: actionTypes.UPDATE_MARKED_RESOURCES,
    payload: {
      subType,
      resourceIdsMap,
    },
  }),
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(FocusedIcon));

const styles = StyleSheet.create({
  text: {
    color: 'white',
  },
  base: {
    height: 20,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
    marginLeft: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
  },
  fullyFocused: {
    borderWidth: 2,
    borderColor: Colors.fullyFocused,
    backgroundColor: Colors.fullyFocused,
  },
  partialFocused: {
    borderColor: Colors.hasFocused,
    backgroundColor: Colors.hasMarked,
  },
  hasMarked: {
    borderColor: Colors.hasMarked,
    backgroundColor: Colors.hasMarked,
  },
  unmarked: {
  },
});
