const path = require('path')
const fs = require('fs')
const getPathInfo = p => path.parse(p)

/*
  dir: 需要读取的文件夹路径, 
  useSubDir: 是否读取子文件夹文件
  extList: 需要读取的文件类型（为空时默认读取全部文件类型）
  ignoreFiles: 忽略的文件（不包含后缀时，会自动忽略所有不同类型的同名文件）
  ignoreDirs: 忽略的文件夹（仅useSubDir为true时生效）
  iterator: 文件读取迭代器，返回参数：item,index,pathInfo

  返回结果
  {
    [文件类型]: {[文件名(无后缀)]: {迭代器处理结果}, ...},
    ...
  }
*/
function autoLoadFiles(options = { dir: String(), useSubDir: Boolean(), extList: Array(String()), ignoreFiles: Array(String()), ignoreDirs: Array(String()), iterator: Function() }) {
  let { dir, useSubDir, extList, iterator, ignoreFiles, ignoreDirs } = { extList: [], ignoreFiles: [], ignoreDirs: [], ...options }
  const filesList = []
  function readFileList(dir, useSubDir, extList, ignoreFiles, ignoreDirs) {
    const files = fs.readdirSync(dir)
    const loadAll = extList.length == 0
    files.forEach(item => {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)
      const info = getPathInfo(fullPath)
      if (stat.isDirectory() && useSubDir && !ignoreDirs.includes(info.name)) {
        readFileList(path.join(dir, item), useSubDir, extList, ignoreFiles, ignoreDirs)
      } else if (!ignoreFiles.includes(info.name) && !ignoreFiles.includes(item)) {
        (extList.includes(info.ext) || loadAll) && filesList.push(fullPath)
      }
    })
  }
  readFileList(dir, useSubDir, extList, ignoreFiles, ignoreDirs)
  let res = {}
  filesList.forEach((item, index) => {
    let pathInfo = getPathInfo(item)
    res[pathInfo.ext.replace('.', '')] = {
      ...res[pathInfo.ext.replace('.', '')],
      [pathInfo.name]: iterator ? iterator(item, index, pathInfo) : {
        path: item,
        data: require(item),
        ...pathInfo
      }
    }
  })
  return res
}

module.exports = autoLoadFiles