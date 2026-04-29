'use strict';

/**
 * Build pagination metadata and skip/limit values from request query.
 * @param {Object} query - Express req.query
 * @param {number} defaultLimit
 * @param {number} maxLimit
 * @returns {{ page, limit, skip, buildMeta }}
 */
function buildPagination(query, defaultLimit = 20, maxLimit = 50) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(maxLimit, Math.max(1, parseInt(query.limit, 10) || defaultLimit));
  const skip = (page - 1) * limit;

  /**
   * Build the meta object from a total count.
   * @param {number} total
   */
  function buildMeta(total) {
    return {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    };
  }

  return { page, limit, skip, buildMeta };
}

module.exports = buildPagination;
