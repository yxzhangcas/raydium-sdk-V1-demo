import { processReqData } from "./processor";
import { start_server } from "./tcp";

function processData(req_data: string) {
  setTimeout(() => processReqData(req_data), 5000);
}

start_server(processData, true).catch(console.error);
