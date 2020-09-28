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
    coordinate: [],
    isDetecting: false
  },

  // 点击图片进行预览
  previewImg: function() {
    const src = this.data.resultImgSrc || this.data.originImgSrc
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src] // 需要预览的图片http链接列表
    })
  },

  // 根据图片原图和canvas 缩放比例重新计算矩形坐标
  formatCoor: function(coor) {
    const { originWidth, originHeight, width, height} = this.data.basicInfo;
    const ratioWidth = originWidth / width;
    const ratioHeight = originHeight / height;
    const [x, y, w, h] = coor;
    return [x / ratioWidth, y / ratioHeight, w / ratioWidth, h / ratioHeight];
  },

  // 切换图片点击事件
  change: function() {
    chooseImg({
      sourceType: ['camera', 'album'],
      success: templatePaths => {
        this.setData({
          resultImgSrc: '',
          coordinate: []
        });
        this.init(templatePaths[0]);
      }
    })
  },

  // 检测按钮点击事件
  detect: function() {
    this.setData({
      resultImgSrc: '',
      coordinate: [],
      isDetecting: true
    });

    wx.showLoading({
      title: '检测中'
    });

    upload({
      url: 'img',
      filePath: this.data.originImgSrc,
      name: 'file',
      success: coor => {
        this.setData({
          coordinate: coor
        });
        // canvas image and rect 形状
        const ctx = wx.createCanvasContext('myCanvas');
        ctx.drawImage(this.data.originImgSrc, 0, 0, this.data.basicInfo.width, this.data.basicInfo.height);

        ctx.setStrokeStyle('yellow')
        for (let i = 0; i < this.data.coordinate.length; i++) {
          const [x, y, width, height] = this.formatCoor(this.data.coordinate[i]);
          ctx.strokeRect(x, y, width, height);

        }
        // draw canvas
        ctx.draw(true, () => {
          wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: this.data.basicInfo.width,
            height: this.data.basicInfo.height,
            canvasId: 'myCanvas',
            success: res => {
              this.setData({
                resultImgSrc: res.tempFilePath,
                isDetecting: false
              });
              wx.hideLoading();
            }
          })
        });
      },
      fail: () => {
        this.setData({
          isDetecting: false
        });
        wx.hideLoading();
      }
    })
  },

  // home 页初始化状态
  init: function(img) {
    this.setData({
      originImgSrc: img
    });
    const res = wx.getSystemInfoSync()
    wx.getImageInfo({
      src: this.data.originImgSrc,
      complete: res2 => {
        this.setData({
          basicInfo: {
            originWidth: res2.width,
            originHeight: res2.height,
            width: res.windowWidth,
            height: res.windowWidth / (res2.width / res2.height)
          }
        });
      }
    });
  },

   /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function(options) {
    this.init(options.img);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})