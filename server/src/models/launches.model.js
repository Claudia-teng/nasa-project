const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');

const launches = new Map();

let latestFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: 'Kepler Exploration X',
  rocket: 'Explorer IS1',
  launchData: new Date('December 27, 2030'),
  target: 'Kepler-442 b',
  customers: ['ZTM', 'NASA',],
  upcoming: true,
  success: true
}

// launches.set(launch.flightNumber, launch);

const saveLaunches = async (launch) => {
  const planet = await planets.findOne({
    keplerName: launch.target
  });

  if (!planet) {
    throw new Error('No matching planet found!')
  }

  await launchesDatabase.updateOne({
    flightNumber: launch.flightNumber
  }, launch, {
    upsert: true
  });
}

saveLaunches(launch);

const existsLaunchWithId = (launchId) => {
  return launches.has(launchId);
}

const getAllLaunches = async () => {
  return await launchesDatabase
    .find({}, {'_id': 0, '__v': 0});
}

const addNewLaunch = (launch) => {
  latestFlightNumber++;
  launches.set(
    latestFlightNumber,
    Object.assign(launch, {
      success: true,
      upcoming: true,
      customers: ['Zero to Mastery', 'NASA'],
      flightNumber: latestFlightNumber
    }))
}

const abortLaunchById = (launchId) => {
  const aborted = launches.get(launchId);
  aborted.upcoming = false;
  aborted.success = false;
  return aborted;
}

module.exports = {
  getAllLaunches,
  addNewLaunch,
  existsLaunchWithId,
  abortLaunchById
}