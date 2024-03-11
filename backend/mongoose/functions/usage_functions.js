const { Stat } = require('../models');

const getAllStats = async () => {
  const allStats = await Stat.find({});
  console.log('all stats: ', allStats);
  return allStats;
};

const getStat = async (key) => {
  const stat = await Stat.findOne({
    key: key
  });
  console.log(`getStat(${key}): `, stat);
  return stat;
};

const incrementStat = async (key) => {
  const stat = await Stat.findOneAndUpdate(
    {
      key: key
    },
    { $inc: { counter: 1 } }
  );
};

module.exports = {
  getAllStats,
  getStat,
  incrementStat
};