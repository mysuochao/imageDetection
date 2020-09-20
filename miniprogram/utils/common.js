import { config } from '../config.js';

const _show_error = msg => {
  error_code = msg || '系统异常';
  wx.showToast({
    title: msg,
    icon: 'none',
    duration: 2000
  });
};

const upload = params => {
  const {
    url,
    filePath,
    name,
    success,
    fail
  } = params;
  wx.uploadFile({
    url: config.api_base_url + url,
    filePath,
    name,
    success: res => {
      let { data, status, message } = JSON.parse(res.data);
      if (status === 200) {
        success && success(data);
      } else {
        _show_error(message);
        fail && fail(res)
      }
      //do something
    },
    fail: err => {
      fail && fail(err);
    }
  });
};

const chooseImg = params => {
  params = {
    ...{
      count: 1,
      sizeType: ['original'],
      sourceType: ['album', 'camera']
    },
    ...params
  };

  wx.chooseImage({
    count: params.count,
    sizeType: params.sizeType,
    sourceType: params.sourceType,
    success: res => {
      params.success && params.success(res.tempFilePaths);
    }
  })
};

export {upload, chooseImg};