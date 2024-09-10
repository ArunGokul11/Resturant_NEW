const paginate = async (model, page = 0, size = 10, filters = {}, sortOptions = [], includeOptions = []) => {
    const limit = +size;
    const offset = page * limit;
  
    try {
      const { count: totalElements, rows: data } = await model.findAndCountAll({
        where: filters,
        limit,
        offset,
        order: sortOptions,
        include: includeOptions,
      });
  
      const totalPages = Math.ceil(totalElements / limit);
      const last = page >= totalPages - 1;
  
      return {
        content: data,
        totalPages,
        totalElements,
        last,
        size: limit,
        number: +page,
        sort: sortOptions,
      };
    } catch (error) {
      throw new Error('Error during pagination: ' + error.message);
    }
  };
  
  module.exports = paginate;
  