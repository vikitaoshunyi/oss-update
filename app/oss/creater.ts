let OSS = require('ali-oss');
import { getStore } from "@app/redux/store";
let cachClient: any = null;
let bucketIdx = -1;
function createClient() {
  let { buckets, bucketIndex } = getStore().getState().main;
  let bucket = buckets[bucketIndex];
  if (!bucket) return;
  let client = new OSS({
    region: bucket.region,
    //云账号AccessKey有所有API访问权限，建议遵循阿里云安全最佳实践，部署在服务端使用RAM子账号或STS，部署在客户端使用STS。
    accessKeyId: bucket.ak,
    accessKeySecret: bucket.sk,
    bucket: bucket.bucket
  });
  // client.useBucket(bucket.bucket);
  cachClient = client;
  bucketIdx = bucket.id;
  return client;
}
function getClient() {
  let { bucketIndex, buckets } = getStore().getState().main;
  let bucket = buckets[bucketIndex];
  if (!bucket) return;
  if (bucketIdx !== bucket.id) {
    return createClient();
  }
  if (cachClient) {
    return cachClient;
  }else {
    return createClient();
  }
}
export { createClient, getClient }