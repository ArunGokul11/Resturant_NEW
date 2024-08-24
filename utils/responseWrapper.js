const responseWrapper = (statusCode, status, data, message) => {
    return {
      statusCode,
      status,
      data,
      message
    };
  };
  
  module.exports = responseWrapper;
  