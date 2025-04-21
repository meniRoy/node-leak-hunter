import axios from 'axios';

const serverUrl = 'http://localhost:8000';
const wait = (sec:number) => new Promise(resolve => setTimeout(resolve, sec * 1000));

// Define individual functions for each endpoint
async function callRoot() {
  return axios.get(`${serverUrl}/`);
}

async function callLeak() {
  return axios.get(`${serverUrl}/leak`);
}

async function callSnap() {
  return axios.get(`${serverUrl}/snap`);
}

async function callSnapGc() {
  return axios.get(`${serverUrl}/snap-gc`);
}

async function createItem(name: string, description: string) {
    try {
     await axios.post(`${serverUrl}/items`, { name, description });
    } catch (error) {
      console.error('Error creating item:', error);
    }
  }
  
  // Function to list all items (GET request)
  async function listItems() {
    try {
      const response = await axios.get(`${serverUrl}/items`);
      console.log('Items List:', response.data);
    } catch (error) {
      console.error('Error listing items:', error);
    }
  }


const endpointFunctions: { [key: string]: () => Promise<any> } = {
    root: callRoot,
    leak: callLeak,
    snap: callSnap,
    'snap-gc': callSnapGc,
    'list':listItems,
    'create':()=>createItem(generateRandomString(5),generateRandomString(20))
  };
// Main function to call a specified endpoint function multiple times with a delay
async function callEndpoint(endpoint: keyof typeof endpointFunctions, times: number, delayInSeconds: number) {
  console.log(`Calling endpoint ${endpoint} ${times} times with a delay of ${delayInSeconds} seconds...`);



  const endpointFunction = endpointFunctions[endpoint];

  if (!endpointFunction) {
    console.error(`Error: No function found for endpoint "${endpoint}".`);
    return;
  }

  for (let i = 0; i < times; i++) {
    try {
      const response = await endpointFunction();
      console.log(`Response from ${endpoint} [${i + 1}/${times}]:`, response.data);
    } catch (error) {
      console.error(`Error in ${endpoint} call [${i + 1}/${times}]:`, error);
    }
    // Wait for the specified delay before the next request
    await wait(delayInSeconds)
  }
  console.log(`Completed calling ${endpoint} ${times} times.`);
}

// Usage example
(async () => {
  // Example usage: Call the 'leak' endpoint 5 times with a 2-second delay between calls
  await callEndpoint('root', 10, 2);
  await callEndpoint('snap-gc',1,1)

  await callEndpoint('leak',20,1)
  await callEndpoint('create',20,1)
  await callEndpoint('list',5,1)
  await callEndpoint('create',5,1)

  await wait(10)
  await callEndpoint('snap-gc',1,1)
  await wait(30)
  await callEndpoint('snap-gc',1,1)

})();

function generateRandomString(length:number) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'[byte % 62]).join('');
}
