import {
  format, parse, parseISO, formatDuration, intervalToDuration, compareAsc,
} from 'date-fns';

// date format used throughout the UI
const UI_DATE_FORMAT = 'MMM d, Y';

export const getResources = (response) => {
  const flatResources = [];
  response.entry.forEach((entry) => {
    if (getResourceType(entry) === 'Observation') {
      const labResultsBundle = createResourceTypeBundle(entry, 'laboratory');
      flatResources.push(labResultsBundle);

      const vitalSignsBundle = createResourceTypeBundle(entry, 'vital-signs');
      flatResources.push(vitalSignsBundle);

      return;
    }
    flatResources.push(entry);
  });

  return flatResources;
};

export const getPatient = (resources) => resources.find((resource) => resource.resource.resourceType === 'Patient');

export const getDataRange = (resources) => {
  // incorrect - doesn't go into 'nested' bundles which shouldn't be nested,
  // will be fixed with Observables
  const timestamps = resources.map((resource) => resource.resource?.meta?.lastUpdated)
    .filter((timestamp) => timestamp)
    .map((timestamp) => parseISO(timestamp))
    .sort(compareAsc);

  return [
    format(timestamps[0], UI_DATE_FORMAT),
    format(timestamps[timestamps.length - 1], UI_DATE_FORMAT),
  ];
};

export const getRecordsTotal = (resources) => resources.reduce((acc, n) => n + 1);

export const getPatientName = (patient) => {
  const nameData = patient?.resource?.name?.[0];
  const given = nameData.given?.[0];
  const { family } = nameData;
  return `${given} ${family}`;
};

export const getPatientGender = (patient) => patient?.resource?.gender;

// returns human-readable patient birth date
export const getPatientBirthDate = (patient) => {
  const birthDate = parse(patient?.resource?.birthDate, 'yyyy-MM-dd', new Date());
  return format(birthDate, UI_DATE_FORMAT);
};

export const getPatientAddresses = (patient) => patient?.resource?.address;

export const renderAddress = (address) => {
  // handle the first one for now
  const firstAddress = address[0];
  const buildup = [
    firstAddress.line.join('\n'),
    `${firstAddress.city}, ${firstAddress.state} ${firstAddress.postalCode}`,
    firstAddress.country,
  ];

  return buildup.join('\n');
};

// TODO: make it handle only years or months which is valid
// TODO: have it return months for babies
export const getPatientAge = (patient) => {
  const birthDate = patient?.resource?.birthDate;
  const birthDuration = intervalToDuration(
    {
      start: parse(birthDate, 'yyyy-MM-dd', new Date()),
      end: new Date(),
    },
  );

  return formatDuration(birthDuration, birthDuration.years > 5 ? { format: ['years'] } : { format: ['years', 'months'] });
};

export const getResourceType = (resource) => {
  if (getResourceCount(resource) > 0) {
    return getBundleResourceType(resource);
  }
  return resource.resource.resourceType;
};

export const getBundleResourceType = (resource) => (
  resource.resource.entry?.[0]?.resource?.resourceType
);

export const getResourceCount = (resource) => {
  if (resource.resource?.total > 0) {
    return resource.resource?.total;
  }
  return null;
};

export const getResourcesByCode = (resource, code) => resource.resource.entry.filter(
  (entry) => entry.resource.category[0].coding[0].code === code,
);

export const createResourceTypeBundle = (resource, code) => {
  const entries = getResourcesByCode(resource, code);

  return {
    resource: {
      resourceType: 'Bundle',
      id: `${resource.resource.id}-${code}`,
      total: entries.length,
      entry: entries,
    },
  };
};

export const getResourceCode = (resource) => (
  resource.resource.entry[0].resource.category[0].coding[0].code
);
