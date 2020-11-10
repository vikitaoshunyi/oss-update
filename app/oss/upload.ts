import { getClient } from "./creater";
var path = require("path")
var fs = require("fs");
function getFile1(pathName: any) {
  return new Promise((resolve, reject) => {
    fs.readdir(pathName, function(err: any, files: any){
      if(err) {
          return reject(err)
      }
      resolve(files);
    })
  })
}
async function getFile(dir: any, appendPath?: any): Promise<any> {
  try {
    let files = await fs.promises.readdir(dir + (appendPath ? ("/"+appendPath) : ""));
    if (files && files.length) {
      let abFiles: Array<any> = [];
      for (const file of files) {
        let apdPath = appendPath ? (appendPath+"/"+file) : file;
        let dirPath = dir+"/"+apdPath;
        var stat = await fs.promises.lstat(dirPath);
        if (stat.isDirectory()) {
          let subFiles = await getFile(dir, apdPath);
          if (subFiles) {
            abFiles = abFiles.concat(subFiles);
          }
        }else {
          abFiles.push(apdPath);
        }
      }
      return abFiles;
    }
  }catch(e) {
    return null;
  }
  
  
}
async function upload(localDir: any, remoteDir: any, files: any) {
  let client = getClient();
  if (!client) return Promise.reject("信息未配置");
  // let files: any = await getFile(localDir);
  // return console.log(files);
  if (files && files.length) {
    let p: Array<Promise<any>> = files.map((file: any) => {
      let longFile = path.join(localDir, file);
      let remoteFile = path.join(remoteDir, file);
      let stream = fs.createReadStream(longFile);
      let size = fs.statSync(longFile).size;
      return client.putStream(remoteFile, stream, {contentLength: size});
    });
    return Promise.all(p);
  }else {
    return Promise.resolve(localDir+"下没有文件");
  }
}
async function uploadSingle(localDir: any, remoteDir: any, file: any) {
  try {
    let client = getClient();
    if (!client) return Promise.reject("信息未配置");
    // let files: any = await getFile(localDir);
    // return console.log(files);
    if (file) {
      let longFile = path.join(localDir, file);
      let remoteFile = path.join(remoteDir, file);
      let stream = fs.createReadStream(longFile);
      let size = fs.statSync(longFile).size;
      return client.putStream(remoteFile, stream, {contentLength: size});
    }else {
      return Promise.resolve("文件不存在!");
    }
  } catch(e) {
    return Promise.resolve(e);
  }
  
}
async function hasFile(remoteDir: any, file: any) {
  try {
    let client = getClient();
    if (!client) return Promise.reject("信息未配置");
    if (file) {
      let remoteFile = path.join(remoteDir, file);
      let res = await client.get(remoteFile);
      if (res?.res?.status === 200) {
        return true;
      }else {
        return false;
      }
    } else {
      return Promise.resolve("文件不存在!");
    }
  }catch(e){
    return false;
  }
}

export { uploadSingle, upload, getFile, hasFile };