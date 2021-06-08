import React from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, Alert,
} from 'react-native';
import { connect } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import {
  arrayOf, shape, bool, string, func,
} from 'prop-types';

import { deleteCollectionNote, deleteRecordNote } from '../../redux/action-creators/index';

import Colors from '../../constants/Colors';
import { formatDateTime } from '../../resources/fhirReader';

const Note = ({
  resourceId,
  note,
  deleteNoteAction,
  handleEditNote,
  fromNotesScreen,
  editNoteId,
  isCollectionNotes,
}) => {
  const navigation = useNavigation();
  const displayDate = formatDateTime(note.dateCreated);
  const handleDelete = () => Alert.alert(
    'Delete Note',
    'Are you sure you want to delete this note?',
    [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: deleteNoteAction,
        style: 'destructive',
      },
    ],
  );

  const hasBeenEdited = note.dateCreated !== note.dateEdited;
  const displayEdited = hasBeenEdited ? ' (Edited)' : '';
  const isEditing = note.id === editNoteId;
  const editingStyle = isEditing ? styles.editing : {};

  const handleEdit = () => {
    if (fromNotesScreen) {
      handleEditNote(note.id, note.text);
    } else {
      navigation.navigate('Notes', { resourceId, editingNote: { id: note.id, text: note.text } });
    }
  };

  const noteTextContainerStyles = [styles.noteTextContainer];

  if (isCollectionNotes) {
    noteTextContainerStyles.push(styles.collectionNoteTextContainer);
  }

  return (
    <View style={[styles.noteContainer, editingStyle]}>
      <View style={styles.noteContent}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>
            {displayDate}
            <Text style={styles.editedText}>{displayEdited}</Text>
          </Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity onPress={handleEdit}>
              <Text style={[styles.headerText, styles.headerActions]}>
                Edit
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete}>
              <Text style={[styles.headerText, styles.headerActions, styles.deleteText]}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={noteTextContainerStyles}>
          <Text>{note.text}</Text>
        </View>
      </View>
    </View>
  );
};

Note.propTypes = {
  resourceId: string,
  note: shape({}).isRequired,
  deleteNoteAction: func.isRequired,
  handleEditNote: func,
  fromNotesScreen: bool,
  editNoteId: string,
  isCollectionNotes: bool.isRequired,
};

Note.defaultProps = {
  resourceId: null,
  handleEditNote: undefined,
  fromNotesScreen: false,
  editNoteId: null,
};

const NotesList = ({
  resourceId,
  notes,
  fromNotesScreen,
  showNotes,
  deleteRecordNoteAction,
  handleEditNote,
  editNoteId,
  isCollectionNotes,
  deleteCollectionNoteAction,
}) => {
  const renderNotes = notes.map((note) => {
    const deleteNoteAction = isCollectionNotes
      ? () => deleteCollectionNoteAction(note.id)
      : () => deleteRecordNoteAction(resourceId, note.id);
    return (
      <Note
        key={note.id}
        resourceId={resourceId}
        note={note}
        deleteNoteAction={deleteNoteAction}
        handleEditNote={handleEditNote}
        fromNotesScreen={fromNotesScreen}
        editNoteId={editNoteId}
        isCollectionNotes={isCollectionNotes}
      />
    );
  });

  if (fromNotesScreen || isCollectionNotes) {
    return renderNotes;
  }

  if (showNotes) {
    return (
      <>
        <View style={styles.divider} />
        {renderNotes}
      </>
    );
  }

  return null;
};

NotesList.propTypes = {
  resourceId: string,
  notes: arrayOf(shape({}).isRequired).isRequired,
  fromNotesScreen: bool,
  showNotes: bool,
  deleteRecordNoteAction: func.isRequired,
  handleEditNote: func,
  editNoteId: string,
  isCollectionNotes: bool,
  deleteCollectionNoteAction: func.isRequired,
};

NotesList.defaultProps = {
  resourceId: null,
  fromNotesScreen: false,
  handleEditNote: undefined,
  editNoteId: null,
  showNotes: false,
  isCollectionNotes: false,
};

const mapDispatchToProps = {
  deleteRecordNoteAction: deleteRecordNote,
  deleteCollectionNoteAction: deleteCollectionNote,
};

export default connect(null, mapDispatchToProps)(NotesList);

const styles = StyleSheet.create({
  divider: {
    borderTopColor: Colors.lightgrey,
    borderTopWidth: 1,
  },
  noteContainer: {
    marginVertical: 5,
    paddingVertical: 5,
  },
  noteContent: {
    paddingHorizontal: 10,
  },
  headerText: {
    fontSize: 12,
    color: Colors.darkgrey2,
  },
  headerContainer: {
    marginBottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerActions: {
    fontWeight: '700',
  },
  actionsContainer: {
    flexDirection: 'row',
  },
  deleteText: {
    marginLeft: 15,
  },
  editedText: {
    paddingLeft: 10,
    fontStyle: 'italic',
  },
  editing: {
    backgroundColor: Colors.editingBackground,
  },
  noteTextContainer: {
    borderLeftWidth: 2,
    borderLeftColor: Colors.primary,
    paddingLeft: 6,
  },
  collectionNoteTextContainer: {
    borderLeftColor: Colors.collectionYellow,
  },
});
