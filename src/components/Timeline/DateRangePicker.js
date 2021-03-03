import React from 'react';
import { func, shape, string } from 'prop-types';
import {
  SafeAreaView, StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import DatePicker from './DatePicker';
import { timelinePropsSelector, dateRangeFilterFiltersSelector } from '../../redux/selectors';
import { actionTypes } from '../../redux/epics';

const DateRangePicker = ({ timelineProps, dateRangeFilter, updateDateRangeFilter }) => {
  const { minimumDate, maximumDate } = timelineProps;
  if (!minimumDate || !maximumDate) {
    return null;
  }

  console.info('dateRangeFilter: ', dateRangeFilter);

  const { dateRangeStart = minimumDate, dateRangeEnd = minimumDate } = dateRangeFilter;

  return (
    <SafeAreaView style={styles.container}>
      <DatePicker
        label="start date"
        activeDate={dateRangeStart}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        onDateSelect={(d) => updateDateRangeFilter('dateRangeStart', d)}
      />
      <DatePicker
        label="end date"
        activeDate={dateRangeEnd}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        onDateSelect={(d) => updateDateRangeFilter('dateRangeEnd', d)}
      />
    </SafeAreaView>
  );
};

DateRangePicker.propTypes = {
  timelineProps: shape({
    minimumDate: string.isRequired,
    maximumDate: string.isRequired,
  }).isRequired,
  dateRangeFilter: shape({
    // dateRangeStart: string.isRequired,
    // dateRangeEnd: string.isRequired,
  }).isRequired,
  updateDateRangeFilter: func.isRequired,
};

const mapStateToProps = (state) => ({
  timelineProps: timelinePropsSelector(state),
  dateRangeFilter: dateRangeFilterFiltersSelector(state),
});

const mapDispatchToProps = {
  updateDateRangeFilter: (fieldKey, date) => ({
    type: actionTypes.UPDATE_DATE_RANGE_FILTER,
    payload: { [fieldKey]: date },
  }),
};

export default connect(mapStateToProps, mapDispatchToProps)(DateRangePicker);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'space-between',
    width: '50%',
    marginTop: 0,
  },
  picker: {
  },
});
