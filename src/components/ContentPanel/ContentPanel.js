import React from 'react';
import {
  StyleSheet, Text, View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { shape } from 'prop-types';

import { collectionFlattenedSubTypesSelector } from '../../redux/selectors';
import SubTypeAccordionsContainer from '../SubTypeAccordion/SubTypeAccordionsContainer';

const ContentPanel = ({ collectionFlattenedSubTypes }) => (
  <ScrollView>
    <View>
      <Text style={styles.title}>Details Panel</Text>
    </View>
    <SubTypeAccordionsContainer showAllSubTypes subTypeData={collectionFlattenedSubTypes} />
  </ScrollView>
);

ContentPanel.propTypes = {
  collectionFlattenedSubTypes: shape({}).isRequired,
};

const mapStateToProps = (state) => ({
  collectionFlattenedSubTypes: collectionFlattenedSubTypesSelector(state),
});

export default connect(mapStateToProps, null)(ContentPanel);

const styles = StyleSheet.create({
  title: {
    marginTop: 10,
    fontSize: 20,
    textAlign: 'center',
  },
});
