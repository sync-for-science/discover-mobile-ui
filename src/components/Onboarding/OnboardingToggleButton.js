import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  StyleSheet, Text, View, TouchableOpacity, Button
} from 'react-native';

import { authenticationState, recoilOnboardingState as rOnboardingState } from '../../recoil';
import Storage from '../../storage';
import Colors from '../../constants/Colors';

const OnboardingToggleButton = ({recoilOnboardingState, handleOnboardingToggle}) => {
  console.log('recoilOnboardingState', recoilOnboardingState)
  

  return (
    <View style={styles.root}>
      <View style={styles.onboardingContainer}>
        <Button title={`Onboarding Completed: ${recoilOnboardingState}`} onPress={() => handleOnboardingToggle(!recoilOnboardingState)} />
        {/* <TouchableOpacity
          style={styles.onboardingButton}
          onPress={() => handleOnboardingToggle(!recoilOnboardingState)}
        >
          <Text style={styles.onboardingButtonText}>{`Onboarding Completed: ${JSON.stringify(recoilOnboardingState)}`}</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default OnboardingToggleButton;

const styles = StyleSheet.create({
  root: {
    width: '100%',
    alignItems: 'center',
  },
  onboardingContainer: {
    alignItems: 'center',
  },
  onboardingButton: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 10,
  },
  onboardingButtonText: {
    color: 'white',
  },
});
