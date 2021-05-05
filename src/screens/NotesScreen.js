import React, { useState } from 'react';
import {
  SafeAreaView, StyleSheet, View, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView,
} from 'react-native';
import {
  Header, Right, Title, Left,
} from 'native-base';
import { connect } from 'react-redux';
import { SimpleLineIcons, Entypo } from '@expo/vector-icons'; // eslint-disable-line import/no-extraneous-dependencies
import { useNavigation } from '@react-navigation/native';
import { func, shape } from 'prop-types';
import { resourceByRoutePropsSelector } from '../redux/selectors';
import { addNoteToRecord } from '../redux/action-creators';

import Colors from '../constants/Colors';
import ResourceCard from '../components/ResourceCard/ResourceCard';
import BaseText from '../components/Generic/BaseText';

const NotesScreen = ({ resource, addNoteToRecordAction }) => {
  const navigation = useNavigation();
  const [text, onChangeText] = useState('');

  const handleSave = () => {
    addNoteToRecordAction(resource.id, text);
    onChangeText('');
  };

  return (
    <SafeAreaView style={styles.root}>
      <Header style={styles.header}>
        <Left>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Entypo name="chevron-thin-left" size={20} color={Colors.headerIcon} />
          </TouchableOpacity>
        </Left>
        <View>
          <Title>{resource.subType}</Title>
        </View>
        <Right>
          <TouchableOpacity>
            <SimpleLineIcons name="note" size={20} color={Colors.headerIcon} />
          </TouchableOpacity>
        </Right>
      </Header>
      <ScrollView>
        <ResourceCard resourceId={resource.id} resource={resource} fromNotesScreen />
      </ScrollView>
      <KeyboardAvoidingView behavior="padding">
        <View style={styles.noteInputContainer}>
          <TextInput
            style={styles.textInput}
            onChangeText={onChangeText}
            multiline
            value={text}
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <BaseText variant="title">Save</BaseText>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

NotesScreen.propTypes = {
  resource: shape({}).isRequired,
  addNoteToRecordAction: func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  resource: resourceByRoutePropsSelector(state, ownProps),
});

const mapDispatchToProps = {
  addNoteToRecordAction: addNoteToRecord,
};

export default connect(mapStateToProps, mapDispatchToProps)(NotesScreen);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: 'white',
    alignItems: 'center',
    elevation: 0,
  },
  noteInputContainer: {
    padding: 10,
    backgroundColor: Colors.lightgrey,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  textInput: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 10,
    padding: 10,
  },
  saveButton: {
    marginLeft: 10,
  },
});
