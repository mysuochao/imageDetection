// miniprogram/pages/detect/detect.js
import {
  chooseImg,
  upload
} from '../../utils/common.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    coordinate: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    //获取屏幕宽度，获取自适应单位
    wx.getSystemInfo({
      success: res => {
        this.setData({
          windowWidth: res.windowWidth
        });
      },
    });

    this.setData({
      img: options.img
    });
    wx.showLoading({
      title: '检测中'
    });

    upload({
      url: 'img',
      filePath: options.img,
      name: 'file',
      success: coor => {
        wx.hideLoading();
        // console.log(res, typeof(res));
        this.setData({
          coordinate: coor
        });
        wx.getImageInfo({
          src: options.img,
          complete: res2 => {
            console.log(res2);
            this.setData({
              basicInfo: {
                width: res2.width,
                height: res2.height
              },
              image: options.img

            });

            const ctx = wx.createCanvasContext('myCanvas');        
            ctx.drawImage(options.img, 0, 0, this.data.basicInfo.width, this.data.basicInfo.height);
            ctx.setStrokeStyle('yellow')
            for (let i = 0; i < this.data.coordinate.length; i++) {
              const [x, y, width, height] = this.data.coordinate[i];
             ctx.strokeRect(x, y, width, height);

            }
            ctx.draw(true, () => {
              wx.canvasToTempFilePath({
                x: 0,
                y: 0,
                width: this.data.basicInfo.width,
                height: this.data.basicInfo.height,
                // destWidth: this.data.windowWidth,
                // destHeight: this.data.windowWidth,
                distWidth: 1020,
                distHeight: 675,
                canvasId: 'myCanvas',
                success: (res) => {
                  console.log(res.tempFilePath)
                  this.setData({
                    rtn: res.tempFilePath,
                    imgSrc: res.tempFilePath
                  });
                  wx.previewImage({
                    current: res.tempFilePath, // 当前显示图片的http链接
                    urls: [res.tempFilePath] // 需要预览的图片http链接列表
                  })
                }
              })
            });
          }
        });
      },
      fail: err => {
        wx.hideLoading();
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})