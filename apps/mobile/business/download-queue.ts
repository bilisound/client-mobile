import PQueue from 'p-queue';

// Create a queue with concurrency of 3
const downloadQueue = new PQueue({ concurrency: 3 });

export default downloadQueue;
