import React, { useState, useEffect } from 'react';

import {
  StyleSheet, ScrollView, SafeAreaView,
  KeyboardAvoidingView, TouchableWithoutFeedback,
  View, TouchableOpacity, TextInput, Text,
} from 'react-native';
import { Chip, Button } from 'react-native-paper';

import { shape } from 'prop-types';
import {
  Right, Left,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

import CollectionRow from '../CollectionRow/CollectionRow';
import Picker from '../TagInput/TagSearchView';

const CollectionsIndexSearch = ({
  navigation,
  collections,
}) => {
  const [open, setOpen] = useState(false);

  /* var itemsList =
    [

    ]
  var itemNames = []
  var collectionNames = []
  if (Object.keys(collections).length > 0){
    for (const [key, value] of Object.entries(collections)) {

      if (collections[key] != null){
      collectionNames.push(collections[key].label);
      for (var j = 0; j < collections[key].tags.length; j++) {
        if (!itemNames.includes(collections[key].tags[j])) {
          itemNames.push(collections[key].tags[j])
        }
      }
    }
    }
  }

  for (var i in itemNames) {
    itemsList.push({label: itemNames[i], value: itemNames[i]})
  } */
  // const [items, setItems] = useState(itemsList);
  const [items, setItems] = useState([]);
  const [value, setValue] = useState([]);
  const [current, currentSelection] = useState(false);
  const [urgent, urgentSelection] = useState(false);
  const [collectionsList, editCollectionsList] = useState(collections);
  const [showSearch, setShowSearch] = useState(false);
  const [title, onChangeTitle] = useState('');
  const [notCurrent, setNotCurrent] = useState('');
  const [notUrgent, setNotUrgent] = useState('');

  const [showSearchText, setShowSearchText] = useState(false);
  const [threeLineDiv, setThreeLineDiv] = useState([]);
  const [disableReset, setDisableReset] = useState(true);

  // console.log("HOME PAGE")
  // console.log(collectionNames);
  useEffect(() => {
    const newCollectionsList = {};

    const itemsList = [

    ];
    const itemNames = [];
    const collectionNames = [];
    if (Object.keys(collections).length > 0) {
      Object.keys(collections).forEach((key) => {
        if (collections[key] != null) {
          collectionNames.push(collections[key].label);
          for (let j = 0; j < collections[key].tags.length; j += 1) {
            if (!itemNames.includes(collections[key].tags[j])) {
              itemNames.push(collections[key].tags[j]);
            }
          }
        }
      });
    }
    for (let i = 0; i < itemNames.length; i += 1) {
      itemsList.push({ label: itemNames[i], value: itemNames[i] });
    }

    setItems(itemsList);
    Object.keys(collections).forEach((i) => {
      let toAdd = true;
      if (title.length > 0 && toAdd) {
        if (!(collections[i].label.includes(title)) && !(collections[i].purpose.includes(title))) {
          toAdd = false;
          // console.log("oof urgent")
        }
      }
      for (let j = 0; j < value.length; j += 1) {
        if (toAdd && !(collections[i].tags.includes(value[j]))) {
          toAdd = false;
          // console.log("oof current")
        }
      }

      if (urgent && !(collections[i].urgent)) {
        toAdd = false;
      } else if (current && !(collections[i].current)) {
        toAdd = false;
      }
      if (notCurrent && (collections[i].current)) {
        toAdd = false;
      } else if (notUrgent && (collections[i].urgent)) {
        toAdd = false;
      }

      if (toAdd) {
        newCollectionsList[i] = collections[i];
      }
    });
    const searchText = [];
    // console.log(collectionsList)
    const threeLineSearchText = [];
    editCollectionsList(newCollectionsList);
    if (title.length > 0) {
      searchText.push(
        <Text style={{ fontWeight: 'bold', marginLeft: -3, padding: 0 }}>
          {' '}
          {'phrase: '}
        </Text>,
      );
      searchText.push(
        <Text style={{ padding: 0 }}>
          {' '}
          {title}
        </Text>,
      );
      threeLineSearchText.push(
        <View style={styles.threeLineSummary}>
          <Text style={{ fontWeight: 'bold', marginLeft: -3, padding: 0 }}>
            {' '}
            {'phrase: '}
          </Text>
          <Text style={{ padding: 0 }}>
            {' '}
            {`${title}; `}
          </Text>
          <Text style={{ padding: 0 }}>
            {' '}
            {}
          </Text>
        </View>,
      );
    }

    if (value.length > 0) {
      let tagList = '';
      for (let j = 0; j < value.length; j += 1) {
        tagList += value[j];
        if (j === value.length - 1) {
          tagList += ';';
        } else {
          tagList += ', ';
        }
      }
      threeLineSearchText.push(
        <View style={styles.threeLineSummary}>
          <Text style={{ fontWeight: 'bold', marginLeft: -3, padding: 0 }}>
            {' '}
            {'tags: '}
          </Text>
          <Text style={{ padding: 0 }}>
            {' '}
            {tagList}
          </Text>
        </View>,
      );

      if (title.length > 0) {
        searchText.push(<Text style={{ padding: 0 }}>{'; '}</Text>);
      }
      searchText.push(
        <Text style={{ fontWeight: 'bold', marginLeft: -3, padding: 0 }}>
          {' '}
          {'selected tags: '}
        </Text>,
      );
      for (let j = 0; j < value.length; j += 1) {
        searchText.push(
          <Text style={{ padding: 0 }}>
            {' '}
            {value[j]}
          </Text>,
        );
        if (j !== value.length - 1) {
          searchText.push(<Text style={{ padding: 0 }}>{', '}</Text>);
        }
        if (j === value.length - 1 && (current || urgent || notCurrent || notUrgent)) {
          searchText.push(<Text style={{ padding: 0 }}>{'; '}</Text>);
        }
      }
    } else if (title.length > 0 && (current || urgent || notCurrent || notUrgent)) {
      searchText.push(<Text style={{ padding: 0 }}>{'; '}</Text>);
    }
    let priorityText = '';

    if (urgent) {
      searchText.push(<Text style={{ fontWeight: 'bold', padding: 0 }}>{'priority: '}</Text>);
      searchText.push(<Text>current, urgent;</Text>);
      priorityText = 'current, urgent;';
    } else if (current) {
      if (notUrgent) {
        searchText.push(<Text style={{ fontWeight: 'bold' }}>{'priority: '}</Text>);
        searchText.push(<Text>current, not urgent;</Text>);
        priorityText = 'current, not urgent;';
      } else {
        searchText.push(<Text style={{ fontWeight: 'bold' }}>{'priority: '}</Text>);
        searchText.push(<Text>current;</Text>);
        priorityText = 'current;';
      }
    }
    if (notCurrent) {
      searchText.push(<Text style={{ fontWeight: 'bold' }}>{'priority: '}</Text>);
      searchText.push(<Text>{'not current, not urgent; '}</Text>);
      priorityText = 'not current, not urgent;';
    } else if (!current && notUrgent) {
      searchText.push(<Text style={{ fontWeight: 'bold' }}>{'priority: '}</Text>);
      searchText.push(<Text>not urgent;</Text>);
      priorityText = 'not urgent;';
    }
    if (current || urgent || notCurrent || notUrgent) {
      threeLineSearchText.push(
        <View style={styles.threeLineSummary}>
          <Text style={{ fontWeight: 'bold', marginLeft: -3, padding: 0 }}>
            {' '}
            {'priority: '}
          </Text>
          <Text style={{ padding: 0 }}>
            {' '}
            {priorityText}
          </Text>
        </View>,
      );
    }

    setThreeLineDiv(threeLineSearchText);

    if ((value.length > 0
      || title.length > 0 || current || urgent || notCurrent || notUrgent) && !showSearch) {
      setShowSearchText(true);
    } else {
      setShowSearchText(false);
    }
    if (value.length > 0
      || title.length > 0 || current || urgent || notCurrent || notUrgent) {
      setDisableReset(false);
    } else {
      setDisableReset(true);
    }
  }, [title, value, current, urgent, notCurrent, notUrgent, collections, showSearch]);
  Object.size = function (obj) {
    let size = 0;
    Object.keys(obj).forEach(() => {
      size += 1;
    });
    if (size === 1) {
      return ('1 Result');
    }
    return (`${size.toString()} Results`);
  };

  function reset() {
    onChangeTitle('');
    urgentSelection(false);
    currentSelection(false);
    setNotCurrent(false);
    setNotUrgent(false);
    setValue([]);
  }
  useEffect(() => { setOpen(false); }, [title, showSearch]);
  return (

    <SafeAreaView style={[styles.safeAreaView]}>
      {/* onPress={() => setShowSearch(!showSearch)}

      <TouchableOpacity
      style={styles.expandIcon}

      > */}

      <View style={styles.root}>
        <View style={styles.dateRangeContainer}>

          <Left>
            {!disableReset
            && (
            <Button
              style={styles.reset_button}
              color={Colors.destructive}
              mode="text"
              onPress={reset} /* eslint-disable-line react/jsx-no-bind */
            >
              RESET
            </Button>
            )}

          </Left>
          <TouchableOpacity onPress={() => setShowSearch(!showSearch)}>
            <View><Text style={styles.dash}>Search Collections</Text></View>
          </TouchableOpacity>

          <Right onPress={() => setShowSearch(!showSearch)}>
            <TouchableOpacity
              style={styles.leftRightPadding}
              onPress={() => setShowSearch(!showSearch)}
            >

              <Ionicons
                name={showSearch ? 'chevron-up' : 'chevron-down'}
                size={24}
                color={Colors.expandTimeline}
              />
            </TouchableOpacity>

          </Right>

        </View>
      </View>
      {/* </TouchableOpacity> */}

      {showSearch

    && (
    <KeyboardAvoidingView style={[styles.searchItemsDiv, styles.zindex]}>

      <View style={styles.searchBoxDiv}>

        <View style={styles.textInputContainer}>

          <TextInput
            onTouchStart={() => setOpen(false)}
            style={styles.textInput}
            value={title}
            onChangeText={onChangeTitle}
            placeholder="search Collections' names and purposes"
            placeholderTextColor="#777777"
            autoFocus
          />
        </View>
      </View>

      { // <View style={styles.dropDown}>
        // <Text style={styles.dropDowntextInstructions}>Specify tags
        // that Collections must include</Text>

        // </View>
      }

      <Picker
        multiple
        min={0}
        max={5}
        open={open}
        value={value}
        setOpen={setOpen}
        setValue={setValue}
        items={items}
        setItems={setItems}
        searchable
        placeholder="specify tags that Collections must include"
      />

      <View>
        <Text style={styles.switchTextInstructions}>Collection must be</Text>

        <View style={styles.switchRow}>
          <View style={styles.setChipWidth} />
          <View style={styles.currentPadding}>
            <Chip
              style={[styles.button, (urgent || current) ? styles.selected : null]}
              disabled={(notCurrent)}
              selected={urgent || current}
              onPress={() => currentSelection(!current)}
            >
              Current
            </Chip>
          </View>
          <View style={styles.urgentPadding}>

            <Chip
              style={[styles.button, (urgent) ? styles.selected : null]}
              disabled={(notCurrent || notUrgent)}
              selected={urgent}
              onPress={() => urgentSelection(!urgent)}
            >
              Urgent
            </Chip>
          </View>

        </View>
        <View style={styles.switchRow}>
          <View style={styles.setChipWidth} />

          <View style={styles.notCurrentPadding}>
            <Chip
              style={[styles.button, (notCurrent) ? styles.selected : null]}
              disabled={(current || urgent)}
              selected={notCurrent}
              onPress={() => setNotCurrent(!notCurrent)}
            >
              Not Current
            </Chip>
          </View>

          <View style={styles.notUrgentPadding}>
            <Chip
              style={[styles.button, (notUrgent || notCurrent) ? styles.selected : null]}
              disabled={(urgent)}
              selected={(notUrgent || notCurrent)}
              onPress={() => setNotUrgent(!notUrgent)}
            >
              Not Urgent
            </Chip>
          </View>

        </View>
      </View>

    </KeyboardAvoidingView>
    )}
      {/** <View  style = {(showSearchText)? styles.searchSummary : {display: 'none'}}>
      {showSearchText && tempSearchText}
    </View>* */}

      <View style={(showSearchText) ? styles.threeLineSummaryDiv : { display: 'none' }}>
        {showSearchText && threeLineDiv}
      </View>
      <View style={(!disableReset) ? styles.numResultsView : { display: 'none' }}>
        <Text style={styles.dash}>{ Object.size(collectionsList)}</Text>
      </View>

      <TouchableWithoutFeedback onPress={() => setOpen(false)}>

        <ScrollView
          contentContainerStyle={styles.collectionRowContainer}
          keyboardShouldPersistTaps="handled"
        >
          {Object.entries(collectionsList).map(([id, { label }]) => (
            <CollectionRow
              key={id}
              collectionId={id}
              label={label}
              navigation={navigation}
            />
          ))}

        </ScrollView>
      </TouchableWithoutFeedback>

    </SafeAreaView>
  );
};

CollectionsIndexSearch.propTypes = {
  navigation: shape({}).isRequired,
  collections: shape({}).isRequired,
};

export default CollectionsIndexSearch;

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: 'white',
  },
  collectionRowContainer: {
    alignItems: 'center',
  },
  textInputContainer: {
    paddingHorizontal: 0,
    margin: 2,
    borderRadius: 10,
    backgroundColor: 'white',
    flexDirection: 'row',
    borderWidth: 0.5,

  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 8,
    flex: 1,
    alignItems: 'stretch',
  },
  leftRightPadding: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  checkboxRow: {
    paddingTop: 40,
    paddingLeft: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 10,
  },

  root: {
    width: '100%',
    flexDirection: 'column',
    borderColor: 'gray',
  },
  dateRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  drawerIcon: {
    paddingLeft: 8,
  },
  expandIcon: {
    paddingRight: 8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dash: {
    paddingLeft: 0,
    paddingRight: 8,
    fontSize: 16,
  },
  searchItemsDiv: {
    paddingHorizontal: 10,
    borderRadius: 10,
    margin: 5,
    padding: 10,
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: 'gray',
    backgroundColor: Colors.sortingHeaderBackground,

  },
  searchBoxDiv: {
    paddingBottom: 8,
  },
  dropDowntextInstructions: {
    paddingLeft: 2,
    paddingBottom: 4,
    paddingRight: 10,
    fontSize: 14,
  },

  switchTextInstructions: {
    paddingLeft: 2,
    paddingTop: 10,
    paddingRight: 10,
    fontSize: 14,
  },

  numResultsText: {
    paddingLeft: 2,

    fontSize: 18,
    fontWeight: 'bold',
  },
  numResultsView: {
    paddingTop: 10,
    paddingLeft: 7,
    flexDirection: 'row',
  },
  textInstructions: {
    paddingLeft: 5,
    paddingBottom: 1,
    paddingRight: 10,
    fontSize: 14,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginVertical: 4,
    paddingTop: 0,
  },
  urgentPadding: {
    paddingRight: 80,
    left: 150,
    position: 'absolute',

  },
  notUrgentPadding: {
    paddingRight: 80,
    left: 150,
    position: 'absolute',
  },
  currentPadding: {
    paddingRight: 10,
    left: 10,
    position: 'absolute',

  },
  notCurrentPadding: {
    paddingRight: 80,
    left: 10,
    position: 'absolute',
  },
  setChipWidth: {
    position: 'relative',
    height: 33,
  },
  searchSummary: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    margin: 4,
    borderRadius: 10,
    backgroundColor: Colors.sortingHeaderBackground,
    padding: 5,
    borderWidth: 0.5,
  },
  threeLineSummaryDiv: {
    margin: 4,
    borderRadius: 10,
    backgroundColor: Colors.sortingHeaderBackground,
    padding: 5,
    borderWidth: 0.5,
  },

  threeLineSummary: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },

  hidden: {
  },
  reset_button: {
    marginHorizontal: 10,
    marginVertical: -5,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',

    backgroundColor: 'white',
    borderColor: 'white',
    marginHorizontal: 4,
    borderRadius: 20,
    borderWidth: 2,
    position: 'relative',

  },
  selected: {
    borderColor: Colors.darkgrey,
  },
  zindex: {
    zIndex: 100,

  },

});
