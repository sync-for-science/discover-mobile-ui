import React from 'react';
import { useRecoilValue } from 'recoil';
import { NavigationContainer } from '@react-navigation/native';

import UnauthorizedNavigator from './UnauthorizedNavigator';
import AuthorizedNavigator from './AuthorizedNavigator';
import OnboardingNavigator from './OnboardingNavigator'
import { authenticationState } from '../recoil';

const RootNavigator = () => {
  const authentication = useRecoilValue(authenticationState);
  return (
    <NavigationContainer>
      <OnboardingNavigator />
      {/* {!authentication.authResult ? <UnauthorizedNavigator /> : <AuthorizedNavigator />} */}
    </NavigationContainer>
  );
};

RootNavigator.propTypes = {
};

RootNavigator.defaultProps = {
};

export default RootNavigator;
