const response = {
  success: (res, data, message) => {
      const result = {
        success: true,
        code:200,
        status:'OK',
        message,
        data
      }
      res.status(200).json(result)
  },
  failed: (res, data, message) => {
    const failed = {
      success: false,
      code: 500,
      status: 'Error',
      message,
      data
    }
    res.status(500).json(failed)
  },
  successWithMeta: (res, data, meta, message) => {
      const result = {
          message,
          success: true,
          code:111,
          meta:meta,
          data:data
      }
      res.json(result)
  },
  errorImage: (res,data,message) => {
    const error = {
      success:false,
      code: 400,
      status: 'Bad Request',
      message,
      data
    }
    res.status(400).json(error)
  }
}

module.exports = response