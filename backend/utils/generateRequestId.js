const Counter = require("../models/Counter");

module.exports = async () => {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear();

  const counter = await Counter.findOneAndUpdate(
    { key: `request-${yyyy}` },
    { $inc: { sequence: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  return `${yyyy}/${dd}${mm}/${String(counter.sequence).padStart(4, "0")}`;
};
