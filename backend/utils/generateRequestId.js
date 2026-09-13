const Counter = require("../models/Counter");
const Request = require("../models/Request");

module.exports = async () => {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear();
  const key = `request-${yyyy}`;

  let counter = await Counter.findOne({ key });

  if (!counter) {
    const existingRequests = await Request.find({
      requestId: new RegExp(`^${yyyy}/`),
    })
      .select("requestId")
      .lean();

    const maxSequence = existingRequests.reduce((max, request) => {
      const sequence = Number(request.requestId.split("/").pop());
      return Number.isFinite(sequence) ? Math.max(max, sequence) : max;
    }, 0);

    try {
      await Counter.create({ key, sequence: maxSequence });
    } catch (err) {
      if (err.code !== 11000) {
        throw err;
      }
    }
  }

  counter = await Counter.findOneAndUpdate(
    { key },
    { $inc: { sequence: 1 } },
    { new: true }
  );

  return `${yyyy}/${dd}${mm}/${String(counter.sequence).padStart(4, "0")}`;
};
