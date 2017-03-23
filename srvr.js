const { get } = require('http')
// https://nodejs.org/docs/latest-v5.x/api/http.html#http_http_methods
const companySymbol = process.argv[2] || 'AAPL'

// the get method in node calls req.end() automatically
get(`http://dev.markitondemand.com/MODApis/Api/v2/InteractiveChart/json?parameters={"Normalized":false,"NumberOfDays":365,"DataPeriod":"Day","Elements":[{"Symbol":"${companySymbol}","Type":"price","Params":["c"]}]}`, (res) => {
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
  res.on('data', chunk => rawData += chunk);

  res.on('end', () => { // once the stream ends, try to parse the data
    try {
      let parsedData = JSON.parse(rawData);

      getAverage(parsedData) // inserting my function heeeere

    } catch (e) {
      console.log(e.message);
    }
  });
}).on('error', (e) => {
  console.log(`Got error: ${e.message}`);
});

const getAverage = (data) => {
  let quotes = data.Elements[0].DataSeries.close.values
  // console.log("quotes.length:", quotes.length)
  let sum = 0
  for (i = 0; i < quotes.length; i++) {
    sum += Number(quotes[i])
  }
  console.log(`The average price of ${companySymbol} stock over the last year was $${sum/(quotes.length)}.`)
}
