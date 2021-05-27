import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { func } from 'prop-types';

import OBSplashScreen from '../screens/Onboarding/OBSplashScreen';
import OBWalkthroughScreen from '../screens/Onboarding/OBWalkthroughScreen';

const OnboardingStack = createStackNavigator();

const OnboardingNavigator = ({ handleOnboardingState }) => (
  <OnboardingStack.Navigator
    initialRouteName="Splash"
    headerMode="none"
    options={{
      gesturesEnabled: false,
    }}
  >
    <OnboardingStack.Screen name="Splash" component={OBSplashScreen} />
    <OnboardingStack.Screen name="Walkthrough">
      {() => <OBWalkthroughScreen handleOnboardingState={handleOnboardingState} />}
    </OnboardingStack.Screen>
  </OnboardingStack.Navigator>
);

OnboardingNavigator.propTypes = {
  handleOnboardingState: func.isRequired,
};

export default OnboardingNavigator;
