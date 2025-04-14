import {connect} from "ngrok"
(async function () {
  const url = await connect(3456);
  console.log(`API exposta em: ${url}`);
})();