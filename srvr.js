const { get } = require('http')


// the get method in node calls req.end() automatically
get('http://dev.markitondemand.com/MODApis/Api/v2/InteractiveChart/json?parameters={"Normalized":false,"NumberOfDays":365,"DataPeriod":"Day","Elements":[{"Symbol":"AAPL","Type":"price","Params":["c"]}]}', (res) => {
  const statusCode = res.statusCode;
  const contentType = res.headers['content-type'];

  let error;
  if (statusCode !== 200) {
    error = new Error(`Request Failed.\n` +
                      `Status Code: ${statusCode}`);
  }
  if (error) {
    console.log(error.message);
    // consume response data to free up memory, since we won't use the request body. Until the data is consumed, the 'end' event will not fire. Also, until the data is read it will consume memory that can eventually lead to a 'process out of memory' error.
    res.resume();
    return;
  }

  res.setEncoding('utf8');
  let rawData = '';
  res.on('data', (chunk) => {
    // console.log("chunk:", chunk)
    rawData += chunk
  });

  res.on('end', () => { // once the stream ends, try to parse the data
    try {
      let parsedData = JSON.parse(rawData);

      manipulate(parsedData) // inserting my function heeeere

    } catch (e) {
      console.log(e.message);
    }
  });
}).on('error', (e) => {
  console.log(`Got error: ${e.message}`);
});

const manipulate = (data) => {
  console.log("stock quotes:", data)
}
