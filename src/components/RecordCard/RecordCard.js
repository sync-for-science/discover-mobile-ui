import React from 'react';
import {
  StyleSheet, View, Text
} from 'react-native';
import { Card, CardItem, Body, Button, Container } from 'native-base';

import {getResourceText, getFormattedResourceType, getResourceDate} from '../../resources/fhirReader'
import BaseText from '../Generic/BaseText'
import Colors from '../../constants/Colors'
import BaseDivider from '../Generic/BaseDivider';
import GenericCardBody from './CardBody/GenericCardBody';

const CatalogScreen = ({resource}) => {
  console.log('resource', resource)
  const cardName = getResourceText(resource)
  const resourceType = getFormattedResourceType(resource)
  const resourceDate = getResourceDate(resource)
  console.log('resourceDate', resourceDate)
  const cardActiveStyle = styles.cardInactive

  return (
      <Card>
        <CardItem style={{...cardActiveStyle, ...styles.header}}>
          <BaseText variant='header'>{resourceType}</BaseText>
          <BaseText>{resourceDate}</BaseText>
        </CardItem>
        <CardItem style={{...cardActiveStyle }}>
          <View style={{width: '100%'}}>
            <GenericCardBody label={cardName}/>
          </View>
        </CardItem>
        <BaseDivider />
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Button transparent>
            <BaseText variant="button">Add To Collection</BaseText>
          </Button>
        </View>
      </Card>
  )
}

export default CatalogScreen;

const styles = StyleSheet.create({
  cardSelected: {
    backgroundColor: 'blue'
  },
  header: {
    flex: 1,
    justifyContent: 'space-between'
  }
});
