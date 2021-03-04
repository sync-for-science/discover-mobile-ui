import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Accordion } from 'native-base';
import { Ionicons } from '@expo/vector-icons'; // eslint-disable-line import/no-extraneous-dependencies
import { connect } from 'react-redux'

import { arrayOf, string } from 'prop-types';
import Colors from '../../constants/Colors';
import ResourceCard from '../ResourceCard/ResourceCard';
import {addResourceToCollection, removeResourceToCollection } from '../../redux/epics'
import { lastAddedResourceIdSelector } from '../../redux/selectors'

const SubTypeAccordion = ({ 
  subType, 
  resourcesIds, 
  addResourceToCollectionAction, 
  removeResourceToCollectionAction,
  selectedCollectionId,
  lastAddedResourceId
}) => {
  const dataArray = [{ title: subType, content: resourcesIds }];

  const renderHeader = (item, expanded) => (
    <View style={styles.header}>
      <View style={styles.headerTextContainer}>
        { expanded
          ? <Ionicons name="caret-down" size={20} color="white" />
          : <Ionicons name="caret-up" size={20} color="white" />}
          <Text style={styles.headerText}>
            {`${item.title} [${item.content.length}]`}
          </Text>
      </View>
      <TouchableOpacity style={styles.addAllButton} onPress={() => console.log('hello')}>
        <Text>Add All To Detail Panel</Text>
      </TouchableOpacity>
    </View>
  );

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
};

const mapStateToProps = (state) => ({
  selectedCollectionId: state.selectedCollection,
  lastAddedResourceId: lastAddedResourceIdSelector(state)
})

const mapDispatchToProps = {
  addResourceToCollectionAction: addResourceToCollection,
  removeResourceToCollectionAction: removeResourceToCollection
}

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
    width: '50%'
  },
  headerText: {
    marginLeft: 10,
    color: 'white',
  },
  addAllButton: {
    backgroundColor: Colors.primaryLight2, 
    paddingVertical: 5,
    paddingHorizontal: 10, 
    borderRadius: 20,
  }
});
