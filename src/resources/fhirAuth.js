import * as AppAuth from 'expo-app-auth';
import Client from 'fhir-kit-client';
import { Buffer } from 'buffer';

export const buildFhirIssUrl = (patientId) => {
  const issDataString = JSON.stringify({
    k: '1',
    b: patientId,
  });
  // smartapp auth
  return `https://launch.smarthealthit.org/v/r4/sim/${Buffer.from(issDataString).toString('base64')}/fhir`;
};

export async function authAsync(fhirIss) {
  const fhirClient = new Client({ baseUrl: fhirIss });
  const { authorizeUrl, tokenUrl } = await fhirClient.smartAuthMetadata();

  const config = {
    serviceConfiguration: {
      authorizationEndpoint: authorizeUrl.toString(),
      tokenEndpoint: tokenUrl.toString(),
    },
    additionalParameters: {
      aud: fhirIss,
    },
    clientId: 'example-client-id',
    clientSecret: 'example-client-secret',
    // redirectUrl:
    //   Platform.OS === "android"
    //     ? "com.reactnativeoauth:/callback"
    //     : "org.reactjs.native.example.ReactNativeOauth:/callback",
    scopes: [
      'openid',
      'fhirUser',
      'patient/*.*',
      'launch/patient',
      'online_access',
    ],
  };
  return AppAuth.authAsync(config);
}
