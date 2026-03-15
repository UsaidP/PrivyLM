import { Queue } from "bullmq";


const queue = new Queue("file-upload-queue", {
  connection: {
    host: "localhost",
    port: "6379"
  }
});

function addToQueue(fileIds) {
  return queue.add("file-upload", { fileIds });
}

export default addToQueue;