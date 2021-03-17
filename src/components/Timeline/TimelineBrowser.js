import React from 'react';
import {
  StyleSheet, View, Dimensions,
} from 'react-native';
import {
  arrayOf, shape, string, number, instanceOf,
} from 'prop-types';
import { connect } from 'react-redux';
import { format, formatDistanceStrict, addDays } from 'date-fns';
import Svg, {
  Rect, Line, G, Text as SvgText, Polygon, // Mask
} from 'react-native-svg';
import { timelineIntervalsSelector } from '../../redux/selectors';

const BAR_COLOR = '#ccc';
const COLOR_1SD = '#999'; // also ccc in mocks
const COLOR_2SD = '#f00'; // also fc0 in mocks
const BOUNDARY_LINE_COLOR = '#36c';
const CHART_MARGIN = 12;
const CHART_HEIGHT = 124;
const BAR_HEIGHT = 80;
const LABEL_COLOR = '#333';
const LABEL_FONT_SIZE = 10;

const Variance = ({ x, y, zScore }) => {
  if (zScore < 1) {
    return null;
  }
  return (
    <Polygon
      x={x}
      y={y}
      fill={(zScore >= 2) ? COLOR_2SD : COLOR_1SD}
      points="-3 0, 0 -5, 3 0"
    />
  );
};

Variance.propTypes = {
  x: number.isRequired,
  y: number.isRequired,
  zScore: number.isRequired,
};

const Bar = ({
  x, zScore, height, width,
}) => (
  <>
    <Variance
      x={x}
      y={-4}
      zScore={zScore}
    />
    <Line
      x1={x}
      y1={BAR_HEIGHT}
      x2={x}
      y2={BAR_HEIGHT - height}
      stroke={BAR_COLOR}
      strokeWidth={width}
      vectorEffect="non-scaling-stroke"
      shapeRendering="crispEdges"
    />
  </>
);

Bar.propTypes = {
  x: number.isRequired,
  zScore: number.isRequired,
  width: number.isRequired,
  height: number.isRequired,
};

const TimelineBars = ({
  availableWidth, maxCount1SD, intervals,
}) => {
  if (!maxCount1SD) {
    return null;
  }
  const tickUnits = BAR_HEIGHT / maxCount1SD;

  return intervals
    .filter(({ items }) => !!items.length)
    .map(({
      key, position, items, zScore,
    }) => (
      <Bar
        key={key}
        x={position * availableWidth}
        width={4}
        height={Math.max(Math.min(items.length, maxCount1SD) * tickUnits, 4)}
        zScore={zScore}
      />
    ));
};

TimelineBars.propTypes = {
  availableWidth: number.isRequired,
  maxCount1SD: number.isRequired,
  intervals: arrayOf(shape({})).isRequired,
};

const XAxis = ({ availableWidth, startLabel, endLabel }) => (
  <>
    <Line
      x1={0}
      y1={BAR_HEIGHT + 2}
      x2={availableWidth}
      y2={BAR_HEIGHT + 2}
      stroke={BAR_COLOR}
      strokeWidth="1"
      vectorEffect="non-scaling-stroke"
    />
    <SvgText
      fill={LABEL_COLOR}
      stroke="none"
      fontSize={LABEL_FONT_SIZE}
      fontWeight="normal"
      x={0}
      y={BAR_HEIGHT + 12}
      textAnchor="start"
    >
      {startLabel}
    </SvgText>
    <SvgText
      fill={LABEL_COLOR}
      stroke="none"
      fontSize={LABEL_FONT_SIZE}
      fontWeight="normal"
      x={availableWidth}
      y={BAR_HEIGHT + 12}
      textAnchor="end"
    >
      {endLabel}
    </SvgText>
  </>
);

XAxis.propTypes = {
  availableWidth: number.isRequired,
  startLabel: string.isRequired,
  endLabel: string.isRequired,
};

const LegendAndBound = ({
  availableWidth, maxCount, maxCount1SD, maxCount2SD, recordCount2SDplus,
}) => {
  if (maxCount > maxCount1SD) {
    const within1SDLineLabel = `${maxCount1SD}`;
    const between1and2SDlabel = `between ${maxCount1SD} and ${maxCount2SD}`;
    let above2SD = null;

    if (recordCount2SDplus) {
      const above2label = `above ${maxCount2SD}`;
      above2SD = (
        <>
          <Variance
            x={120}
            y={-14}
            zScore={2}
          />
          <SvgText
            x={126}
            y={-14}
            fill={LABEL_COLOR}
            stroke="none"
            fontSize={LABEL_FONT_SIZE}
            textAnchor="left"
          >
            {above2label}
          </SvgText>
        </>
      );
    }

    return (
      <>
        <Variance
          x={0}
          y={-14}
          zScore={1}
        />
        <SvgText
          x={6}
          y={-14}
          fill={LABEL_COLOR}
          stroke="none"
          fontSize={LABEL_FONT_SIZE}
          textAnchor="left"
        >
          {between1and2SDlabel}
        </SvgText>
        <Line
          x1={0}
          y1={-2}
          x2={availableWidth}
          y2={-2}
          stroke={BOUNDARY_LINE_COLOR}
          strokeDasharray="2 2"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        {above2SD}
        <SvgText
          fill={LABEL_COLOR}
          stroke="none"
          fontSize={LABEL_FONT_SIZE}
          x={-4}
          y={0}
          textAnchor="end"
        >
          {within1SDLineLabel}
        </SvgText>
      </>
    );
  }
  return null;
};

LegendAndBound.propTypes = {
  availableWidth: number.isRequired,
  maxCount: number.isRequired,
  maxCount1SD: number.isRequired,
  maxCount2SD: number.isRequired,
  recordCount2SDplus: number.isRequired,
};

const formatDays = (numDays) => {
  const d = new Date();
  return formatDistanceStrict(d, addDays(d, numDays), { unit: 'day' });
};

const Metrics = ({
  availableWidth,
  intervalLength,
}) => {
  if (intervalLength) {
    const intervalLengthLabel = formatDays(Math.round(intervalLength));
    return (
      <SvgText
        x={availableWidth - 100}
        y={-14}
        fill={LABEL_COLOR}
        stroke="none"
        fontSize={LABEL_FONT_SIZE}
        textAnchor="right"
      >
        {intervalLengthLabel}
      </SvgText>
    );
  }
  return null;
};

Metrics.propTypes = {
  availableWidth: number.isRequired,
  intervalLength: number.isRequired,
};

const TimelineBrowser = ({ timelineIntervals }) => {
  const {
    startDate, endDate,
    maxCount, maxCount1SD, maxCount2SD, recordCount, recordCount2SDplus,
    intervals, intervalLength,
  } = timelineIntervals;
  const screenWidth = Dimensions.get('window').width;
  const availableWidth = screenWidth - (3 * CHART_MARGIN);
  const noResultsMessage = recordCount ? '' : 'No results found for date and type filters.';

  return (
    <View
      style={[
        // StyleSheet.absoluteFill,
        styles.root,
      ]}
    >
      <Svg
        width={`${screenWidth}`}
        height={CHART_HEIGHT}
        viewBox={`0 0 ${screenWidth} 100`}
        style={{ borderWidth: 0 }}
      >
        <G
          x={2 * CHART_MARGIN} // accommodate label for boundary line
          y={20}
        >
          <SvgText
            fill={LABEL_COLOR}
            stroke="none"
            fontSize="12"
            fontWeight="bold"
            fontStyle="italic"
            x={availableWidth / 2}
            y={BAR_HEIGHT / 2}
            textAnchor="middle"
          >
            {noResultsMessage}
          </SvgText>
          <XAxis
            availableWidth={availableWidth}
            startLabel={(startDate && format(startDate, 'MM/dd/yyyy')) || ''}
            endLabel={(endDate && format(endDate, 'MM/dd/yyyy')) || ''}
          />
          <TimelineBars
            availableWidth={availableWidth}
            maxCount1SD={maxCount1SD}
            maxCount2SD={maxCount2SD}
            intervals={intervals}
          />
          <LegendAndBound
            availableWidth={availableWidth}
            maxCount={maxCount}
            maxCount1SD={maxCount1SD}
            maxCount2SD={maxCount2SD}
            recordCount2SDplus={recordCount2SDplus}
          />
          <Metrics
            availableWidth={availableWidth}
            intervalLength={intervalLength}
          />
          <Rect
            x="0"
            y="0"
            width={availableWidth}
            height={BAR_HEIGHT}
            strokeDasharray="2 2"
            // stroke="#f008" // debug position
          />
        </G>
        <Rect
          x="0"
          y="0"
          width={screenWidth}
          height={CHART_HEIGHT}
          strokeDasharray="2 2"
          // stroke="#00f8" // debug position
        />
      </Svg>
    </View>
  );
};

TimelineBrowser.propTypes = {
  timelineIntervals: shape({
    startDate: instanceOf(Date),
    maxDate: instanceOf(Date),
    intervals: arrayOf(shape({})).isRequired, // that have records
    intervalLength: number.isRequired,
    maxCount: number.isRequired,
    maxCount1SD: number.isRequired,
    maxCount2SD: number.isRequired,
    recordCount: number.isRequired,
    recordCount1SD: number.isRequired,
    recordCount2SD: number.isRequired,
  }).isRequired,
};

const mapStateToProps = (state) => ({
  timelineIntervals: timelineIntervalsSelector(state),
});

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(TimelineBrowser));

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: CHART_HEIGHT,
  },
  debug: {
    left: 2,
    top: 2,
    fontSize: 6,
  },
});
