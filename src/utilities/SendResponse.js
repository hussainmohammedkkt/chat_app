class SendResponse {

  success( data, res ) {

    const result = {
      success: true,
      data,
      timestamp: Date.now()
    };
    res.status(200).send( result );

  }

  error( error, res ) {

    const response = {
      success: false,
      error,
      timestamp: Date.now()
    };
    res.status(200).send( response );

  }

}

export default new SendResponse();