import React, { useState } from 'react';
import { bool, func } from 'prop-types';
import {
  StyleSheet, View, TouchableOpacity,
} from 'react-native';
import { Left, Right } from 'native-base';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; // eslint-disable-line import/no-extraneous-dependencies

import DateRangePicker from './DateRangePicker';
import TimelineChart from './TimelineChart';
import Colors from '../../constants/Colors';

const Timeline = ({ handleOpenDrawer, noRecords }) => {
  const [showTimeline, setShowTimeline] = useState(true);

  return (
    <View style={styles.root}>
      <View style={styles.dateRangeContainer}>
        <Left>
          <TouchableOpacity
            style={styles.drawerIcon}
            onPress={handleOpenDrawer}
          >
            <MaterialCommunityIcons
              name="filter-outline"
              size={24}
              color={Colors.primary}
            />
          </TouchableOpacity>
        </Left>
        <DateRangePicker />
        <Right>
          {!noRecords && (
            <TouchableOpacity
              style={styles.expandIcon}
              onPress={() => setShowTimeline(!showTimeline)}
            >
              <Ionicons
                name={showTimeline ? 'chevron-up' : 'chevron-down'}
                size={24}
                color={Colors.expandTimeline}
              />
            </TouchableOpacity>
          )}
        </Right>
      </View>
      {showTimeline && !noRecords && <TimelineChart />}
    </View>
  );
};

Timeline.propTypes = {
  handleOpenDrawer: func,
  noRecords: bool.isRequired,
};

Timeline.defaultProps = {
  handleOpenDrawer: null,
};

export default Timeline;

const styles = StyleSheet.create({
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
});
