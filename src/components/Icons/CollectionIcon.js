import React from 'react';
import {
  arrayOf, bool, func, shape, string,
} from 'prop-types';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { connect } from 'react-redux';
import Colors from '../../constants/Colors';

import { collectionsResourceIdsSelector } from '../../redux/selectors';
import { addResourceToCollection, removeResourceFromCollection } from '../../redux/action-creators';

const CollectionIcon = ({
  collectionId,
  resourceIds,
  showCount,
  addResourceToCollectionAction,
  removeResourceFromCollectionAction,
  previewCollection,
  collectionsResourceIds,
  previewCollectionId,
}) => {
  const selectedOrPreviewResourceIds = previewCollection
    ? collectionsResourceIds[previewCollectionId]
    : collectionsResourceIds[collectionId];

  const resourceCount = resourceIds.reduce((acc, id) => {
    const inCollection = selectedOrPreviewResourceIds[id];
    return inCollection ? acc + 1 : acc;
  }, 0);
  const iconCount = (showCount && resourceCount) ? resourceCount : null;

  const handlePress = () => (resourceCount
    ? removeResourceFromCollectionAction(collectionId, resourceIds)
    : addResourceToCollectionAction(collectionId, resourceIds));

  const iconStyle = resourceCount ? styles.hasResource : null;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        iconStyle,
      ]}
      onPress={handlePress}
    >
      <Text style={styles.text}>{iconCount}</Text>
    </TouchableOpacity>
  );
};

CollectionIcon.propTypes = {
  collectionId: string.isRequired,
  resourceIds: arrayOf(string.isRequired).isRequired,
  showCount: bool.isRequired,
  addResourceToCollectionAction: func.isRequired,
  removeResourceFromCollectionAction: func.isRequired,
  previewCollection: bool,
  collectionsResourceIds: shape({}).isRequired,
  previewCollectionId: string.isRequired,
};

CollectionIcon.defaultProps = {
  previewCollection: false,
};

const mapStateToProps = (state) => ({
  previewCollectionId: state.previewCollectionId,
  collectionsResourceIds: collectionsResourceIdsSelector(state),
});

const mapDispatchToProps = {
  addResourceToCollectionAction: addResourceToCollection,
  removeResourceFromCollectionAction: removeResourceFromCollection,
};

export default connect(mapStateToProps, mapDispatchToProps)(CollectionIcon);

const styles = StyleSheet.create({
  text: {
    color: 'white',
  },
  base: {
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: Colors.collectionUnselected,
  },
  hasResource: {
    borderColor: Colors.collectionIcon,
    backgroundColor: Colors.collectionIcon,
    borderWidth: 2,
  },
});
