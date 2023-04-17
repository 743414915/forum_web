const utils = {
  getRandomColor() {
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    return "rgb(" + r + "," + g + "," + b + ")"; //IE7不支持rgb
  },
  isObjEmpty(obj) {
    if (!this.isObj(obj)) {
      return false;
    }
    return !Object.keys(obj).length;
  },
  isObj(obj) {
    if (obj === null || obj === undefined) {
      return false;
    }
    if (this.isArray(obj)) {
      return false;
    }
    if (typeof obj !== "object") {
      return false;
    }
    return true;
  },
  isArrayEmpty(array) {
    if (!this.isArray(array)) {
      return false;
    }
    return !array.length;
  },
  isArray(array) {
    if (Array.isArray(array)) {
      return true;
    }
    return false;
  },
  /**
 * 格式化文件大小的函数
 * @param {number} size - 文件大小，单位为字节（Byte）
 * @returns {string} - 格式化后的文件大小字符串，包括单位（B、KB、MB、GB）
 */
  formatFileSize(size) {
    if (size < 1024) { // 如果文件大小小于1KB
      return size + " bytes"; // 直接返回文件大小并添加“bytes”单位
    } else if (size < 1024 * 1024) { // 如果文件大小在1KB到1MB之间
      return (size / 1024).toFixed(2).replace(/\.00$/, "") + " KB"; // 将文件大小除以1024，保留2位小数，然后添加“KB”单位，并去掉小数位为0的情况
    } else if (size < 1024 * 1024 * 1024) { // 如果文件大小在1MB到1GB之间
      return (size / (1024 * 1024)).toFixed(2).replace(/\.00$/, "") + " MB"; // 将文件大小除以1024*1024，保留2位小数，然后添加“MB”单位，并去掉小数位为0的情况
    } else { // 如果文件大小大于1GB
      return (size / (1024 * 1024 * 1024)).toFixed(2).replace(/\.00$/, "") + " GB"; // 将文件大小除以1024*1024*1024，保留2位小数，然后添加“GB”单位，并去掉小数位为0的情况
    }
  }
}

export default utils