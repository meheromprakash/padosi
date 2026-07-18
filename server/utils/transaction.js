const mongoose = require('mongoose');

/**
 * Runs a function within a transaction if replica set is supported,
 * otherwise runs it directly.
 * @param {Function} fn - Function to execute, receives session as parameter.
 */
async function runInTransaction(fn) {
  if (global.supportsTransactions) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const result = await fn(session);
      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } else {
    return await fn(null);
  }
}

module.exports = {
  runInTransaction,
};
