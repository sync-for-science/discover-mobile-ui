import React from 'react';
import {
  arrayOf, func, shape, string,
} from 'prop-types';
import { connect } from 'react-redux';
import {
  StyleSheet, Text, View, ScrollView, SafeAreaView, StatusBar, Button,
} from 'react-native';

import { patientSelector, supportedResourcesSelector } from '../redux/selectors';
import Colors from '../constants/Colors';
import {
  getPatientName,
} from '../resources/fhirReader';
import { clearAuth } from '../features/auth/authSlice';
import { clearPatientData } from '../features/patient/patientDataSlice';
import Demographics from '../components/Demographics/Demographics';
import RESOURCE_TYPES from '../resources/resourceTypes';

const ResourceTypeRow = ({ resourceType, total }) => (
  <View style={styles.resourceTypeRow}>
    <Text>{RESOURCE_TYPES[resourceType]}</Text>
    <Text>{total}</Text>
  </View>
);

ResourceTypeRow.propTypes = {
  resourceType: string.isRequired,
  total: string.isRequired,
};

const SummaryScreen = ({
  patientResource, sortedResourceTypes, resources, navigation,
  clearAuthAction, clearPatientDataAction,
}) => {
  const patientName = getPatientName(patientResource);

  const handleLogout = () => {
    clearAuthAction();
    clearPatientDataAction();
    navigation.navigate('PreAuth');
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <StatusBar backgroundColor={Colors.primary} barStyle="dark-content" />
      <ScrollView style={styles.screen}>
        <View style={styles.descriptionContainer}>
          <Text style={styles.welcome}>
            {patientName}
          </Text>
        </View>
        <Demographics />
        <View style={styles.resourceTypeContainer}>
          {sortedResourceTypes.map(({ resourceType, totalCount }) => (
            <ResourceTypeRow
              key={resourceType}
              resourceType={resourceType}
              total={totalCount}
              resources={resources}
            />
          ))}
        </View>
        <Button title="Logout" onPress={handleLogout} />
      </ScrollView>
    </SafeAreaView>
  );
};

SummaryScreen.propTypes = {
  navigation: shape({}).isRequired,
  clearAuthAction: func.isRequired,
  clearPatientDataAction: func.isRequired,
  sortedResourceTypes: arrayOf(shape({})).isRequired,
  resources: shape({}),
  patientResource: shape({}),
};

SummaryScreen.defaultProps = {
  resources: null,
  patientResource: null,
};

const mapStateToProps = (state) => ({
  resources: state.resources,
  sortedResourceTypes: supportedResourcesSelector(state),
  patientResource: patientSelector(state),
});

const mapDispatchToProps = {
  clearAuthAction: clearAuth,
  clearPatientDataAction: clearPatientData,
};

export default connect(mapStateToProps, mapDispatchToProps)(SummaryScreen);

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
  descriptionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    overflow: 'scroll',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  scrollViewInternal: {
    height: 500,
    padding: 20,
    borderWidth: 1,
    borderColor: 'lightgray',
    backgroundColor: 'white',
  },
  welcome: {
    fontSize: 24,
    fontWeight: '600',
    paddingTop: 25,
  },
  resourceTypeRow: {
    width: '90%',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: 'lightgray',
  },
  resourceTypeContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
});
