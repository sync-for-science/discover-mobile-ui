import React from 'react';
import {
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { Accordion } from 'native-base';
import { Ionicons } from '@expo/vector-icons'; // eslint-disable-line import/no-extraneous-dependencies
import { connect } from 'react-redux';

import {
  arrayOf, func, shape, string,
} from 'prop-types';
import Colors from '../../constants/Colors';
import ResourceCard from '../ResourceCard/ResourceCard';
import { addResourceToCollection, removeResourceToCollection } from '../../redux/epics';
import { checkResourceIdsGroupedBySubTypeSelector } from '../../redux/selectors';

const SubTypeAccordion = ({
  subType,
  resourcesIds,
  addResourceToCollectionAction,
  removeResourceToCollectionAction,
  selectedCollectionId,
  checkResourceIdsGroupedBySubType,
}) => {
  const dataArray = [{ title: subType, content: resourcesIds }];
  const renderHeader = (item, expanded) => {
    let subTypeHeaderIcon = (
      <TouchableOpacity
        onPress={() => addResourceToCollectionAction(selectedCollectionId, item.content)}
      >
        <Ionicons name="square-outline" size={24} color="white" />
      </TouchableOpacity>
    );

    if (checkResourceIdsGroupedBySubType[item.title]) {
      subTypeHeaderIcon = (
        <TouchableOpacity
          onPress={() => addResourceToCollectionAction(selectedCollectionId, item.content)}
        >
          <Ionicons name="checkbox-outline" size={24} color="white" />
        </TouchableOpacity>
      );
      if (checkResourceIdsGroupedBySubType[item.title] === 'full') {
        subTypeHeaderIcon = (
          <TouchableOpacity
            onPress={() => removeResourceToCollectionAction(selectedCollectionId, item.content)}
          >
            <Ionicons name="checkbox" size={24} color="white" />
          </TouchableOpacity>
        );
      }
    }

    return (
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          { expanded
            ? <Ionicons name="caret-down" size={20} color="white" />
            : <Ionicons name="caret-up" size={20} color="white" />}
          <Text style={styles.headerText}>
            {`${item.title} [${item.content.length}]`}
          </Text>
        </View>
        {subTypeHeaderIcon}
      </View>
    );
  };

  const renderContent = (item) => item.content.map(
    (resourceId) => (
      <ResourceCard
        key={resourceId}
        resourceId={resourceId}
        selectedCollectionId={selectedCollectionId}
        addResourceToCollection={addResourceToCollectionAction}
        removeResourceToCollection={removeResourceToCollectionAction}
      />
    ),
  );

  return (
    <View style={{ marginBottom: 10 }}>
      <Accordion
        dataArray={dataArray}
        icon="add"
        iconStyle={{ color: 'green' }}
        expanded={[]}
        renderHeader={renderHeader}
        renderContent={renderContent}
      />
    </View>
  );
};

SubTypeAccordion.propTypes = {
  subType: string.isRequired,
  resourcesIds: arrayOf(string.isRequired).isRequired,
  addResourceToCollectionAction: func.isRequired,
  removeResourceToCollectionAction: func.isRequired,
  selectedCollectionId: string.isRequired,
  checkResourceIdsGroupedBySubType: shape({}),
};

SubTypeAccordion.defaultProps = {
  checkResourceIdsGroupedBySubType: {},
};

const mapStateToProps = (state) => ({
  selectedCollectionId: state.selectedCollection,
  checkResourceIdsGroupedBySubType: checkResourceIdsGroupedBySubTypeSelector(state),
});

const mapDispatchToProps = {
  addResourceToCollectionAction: addResourceToCollection,
  removeResourceToCollectionAction: removeResourceToCollection,
};

export default connect(mapStateToProps, mapDispatchToProps)(SubTypeAccordion);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  headerTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
  },
  headerText: {
    marginLeft: 10,
    color: 'white',
  },
});
