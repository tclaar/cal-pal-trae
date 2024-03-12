const { Stat } = require('../models');

const getAllStats = async () => {
  const allStats = await Stat.find({});
  console.log('all stats: ', allStats);
  return {
    success: true,
    stats: allStats,
    code: 200
  };
};

const getStat = async (key) => {
  const stat = await Stat.findOne({
    key: key
  });
  console.log(`getStat(${key}): `, stat);
  if (stat !== null) {
    return {
      success: false,
      error: "no match found for this stat!",
      code: 400
    };
  }
  return {
    success: true,
    code: 200,
    stat: stat
  };
};

const incrementStat = async (key) => {
  const stat = await Stat.findOne({
    key: key
  });
  if (stat === null) {
    return {
      success: false,
      error: "no match found for this stat!",
      code: 400
    };
  }
  await Stat.findOneAndUpdate(
    {
      key: key
    },
    { $inc: { counter: 1 } }
  );
  return {
    success: true,
    code: 200
  };
};

module.exports = {
  getAllStats,
  getStat,
  incrementStat
};