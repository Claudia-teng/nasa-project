const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');

const DEFUALT_FLIGHT_NUMBER = 100;

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

const saveLaunches = async (launch) => {
  const planet = await planets.findOne({
    keplerName: launch.target
  });

  if (!planet) {
    throw new Error('No matching planet found!')
  }

  await launchesDatabase.findOneAndUpdate({
    flightNumber: launch.flightNumber
  }, launch, {
    upsert: true
  });
}

saveLaunches(launch);

const existsLaunchWithId = async (launchId) => {
  return await launchesDatabase.findOne({
    flightNumber: launchId
  });
}

const getAllLaunches = async () => {
  return await launchesDatabase
    .find({}, {'_id': 0, '__v': 0});
}

const getLatestFlightNumber = async () => {
  const latestLaunch = await launchesDatabase
    .findOne()
    .sort('-flightNumber')

  if (!latestLaunch) return DEFUALT_FLIGHT_NUMBER;
  
  return latestLaunch.flightNumber;
}

const scheduleNewLaunch = async (launch) => {
  const newFlightNumber = await getLatestFlightNumber() + 1;

  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ['Zero to Mastery', 'NASA'],
    flightNumber: newFlightNumber
  })

  await saveLaunches(newLaunch);
}

const abortLaunchById = async (launchId) => {
  const aborted = await launchesDatabase.updateOne({
    flightNumber: launchId
  }, {
    upcoming: false,
    success: false
  })

  return aborted.modifiedCount === 1;
}

module.exports = {
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchWithId,
  abortLaunchById
}