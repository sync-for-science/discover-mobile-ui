import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  StatusBar,
  Button,
} from 'react-native';
import { H2, Text } from 'native-base';
import * as Linking from 'expo-linking';

import Login from '../components/Login/Login';
import s4sLogo from '../../assets/images/s4s-logo.png';
import Colors from '../constants/Colors';
import mockBundle from '../../assets/mock_data/bundle-blake-eichmann.json';
import { setPatientData } from '../features/patient/patientDataSlice';

const LoginScreen = ({ navigation, setPatientDataAction }) => {
  const handleSkipLogin = () => {
    setPatientDataAction(mockBundle);
    navigation.navigate('PostAuth');
  };

  const showSkipLogin = process.env.NODE_ENV === 'development';

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <StatusBar backgroundColor={Colors.primary} barStyle="dark-content" />
      <View
        contentInsetAdjustmentBehavior="automatic"
        style={styles.screen}
      >
        <View style={styles.discoveryContainer}>
          <View style={styles.logoContainer}>
            <Image
              style={styles.slogo}
              source={s4sLogo}
              resizeMode="contain"
            />
            <View style={styles.descriptionContainer}>
              <H2 style={styles.descriptionText}>Discovery Mobile</H2>
            </View>
          </View>
          <Login navigation={navigation} />
        </View>
        <View style={styles.vermonsterContainer}>
          {showSkipLogin && <Button title="Skip Login" onPress={handleSkipLogin} />}
          <Text style={styles.companyText}>Powered by</Text>
          <Text style={styles.companyText} onPress={() => Linking.openURL('http://vermonster.com')}>Vermonster LLC</Text>
          <Text style={styles.companyText} onPress={() => Linking.openURL('https://fire.ly')}>Firely BV</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

LoginScreen.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func.isRequired }).isRequired,
  setPatientDataAction: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  setPatientDataAction: setPatientData,
};

export default connect(null, mapDispatchToProps)(LoginScreen);

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: 'white',
  },
  screen: {
    flex: 1,
  },
  discoveryContainer: {
    justifyContent: 'space-between',
  },
  slogo: {
    height: 70,
    marginVertical: 32,
  },
  logoContainer: {
    marginTop: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  descriptionContainer: {
    alignItems: 'center',
  },
  descriptionText: {
    fontWeight: '200',
  },
  vermonsterContainer: {
    height: '25%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  companyText: {
    color: Colors.lightgrey,
    paddingBottom: 5,
  },
});
