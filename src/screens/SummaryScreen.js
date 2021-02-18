import React from 'react';
import { func, shape } from 'prop-types';
import { connect } from 'react-redux';
import {
  StyleSheet, Text, View, ScrollView, SafeAreaView, StatusBar, Button,
} from 'react-native';

import Colors from '../constants/Colors';
import { clearAuth } from '../features/auth/authSlice';
import { clearPatient } from '../features/patient/patientSlice';
import { Demographics } from '../components/Demographics/Demographics';

const SummaryScreen = ({
  navigation, patient, clearAuthAction, clearPatientAction,
}) => {
  const patientName = `${patient?.name[0].given} ${patient?.name[0].family}`;

  const displayPatient = patient
    ? `Welcome ${patientName}`
    : 'No Patient Data Available';

  const handleLogout = () => {
    clearAuthAction();
    clearPatientAction();
    navigation.navigate('PreAuth');
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <StatusBar backgroundColor={Colors.primary} barStyle="dark-content" />
      <ScrollView style={styles.screen}>
        <View style={styles.descriptionContainer}>
          <Text style={styles.welcome}>
            {displayPatient}
          </Text>
        </View>
        {patient
      && (
        <Demographics />
      )}
        {patient && <Button title="Logout" onPress={handleLogout} />}
      </ScrollView>
    </SafeAreaView>
  );
};

SummaryScreen.propTypes = {
  navigation: shape({}).isRequired,
  patient: shape({}),
  clearAuthAction: func.isRequired,
  clearPatientAction: func.isRequired,
};

SummaryScreen.defaultProps = {
  patient: null,
};

const mapStateToProps = (state) => ({
  patient: state.patient.patient,
});

const mapDispatchToProps = { clearAuthAction: clearAuth, clearPatientAction: clearPatient };

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
});
