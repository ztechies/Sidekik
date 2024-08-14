const sendResponse = async (res:any, status: number, data:any, message: string, success:boolean) => {
    res.status(status).send({ status, data, message, success });
  }
  
  export default sendResponse;
  
  // Example usage:
  // const data = /* ... */; 
  // const successMessage = "Data added successfully";
  // sendResponse(res, 200, data, successMessage, true);
