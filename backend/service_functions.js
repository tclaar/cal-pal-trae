const processRequest = async (res, func, errMsg) => {
  try {
    const result = await func();
  
    return res.status(result.code).json(result)
  } catch (error) {
    console.error(`Error: ${error}`);
    return res.status(500).json({ error: errMsg });
  }
}

module.exports = {
  processRequest
}