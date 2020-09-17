"use strict";
var app = getApp();
var rpx;
import {
  coordinate
} from '../../utils/coordinate.js';
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    image: '',
    basicInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  loadImage: function() {
    wx.chooseImage({
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: res => {
        wx.getImageInfo({
          src: res.tempFilePaths[0],
          complete: (res2) => {
            this.setData({
              basicInfo: {
                radio: res2.width / res2.height,
                width: res2.width,
                height: res2.height
              }
            });
            this.setData({
              image: res.tempFilePaths[0],
              latest: {
                width: this.data.windowWidth,
                height: this.data.windowWidth / this.data.basicInfo.radio
              },
              windowHeight: this.data.windowWidth / this.data.basicInfo.radio + 'px'
            });
            const ctx = wx.createCanvasContext('myCanvas');
            ctx.drawImage(res.tempFilePaths[0], 0, 0, this.data.windowWidth, this.data.windowWidth / this.data.basicInfo.radio);
            ctx.setStrokeStyle('yellow')
            for (let i = 0; i < coordinate.length; i++) {
              const latestCoordinate = this.format(coordinate[i]);
              console.log(latestCoordinate);
              ctx.strokeRect(...latestCoordinate);
            }
            ctx.draw();
            // wx.canvasToTempFilePath({
            //   x: 100,
            //   y: 200,
            //   width: 50,
            //   height: 50,
            //   destWidth: 100,
            //   destHeight: 100,
            //   canvasId: 'myCanvas',
            //   success: (res) => {
            //     console.log(res.tempFilePath)
            //     this.setData({
            //       rtn: res.tempFilePath
            //     });
                // wx.previewImage({
                //   current: res.tempFilePath, // 当前显示图片的http链接
                //   urls: [res.tempFilePath] // 需要预览的图片http链接列表
                // })
              // }
            // })
          }
        });
      }
    })
  },
  format: function(coor) {
   
    const {
      height: basicHeight,
      width: basicWidth
    } = this.data.basicInfo;
    const {
      height: latestHeight,
      width: latestWidth
    } = this.data.latest;

    const [x, y, width, height] = coor;
    return [
      x * latestWidth / basicWidth,
      y * latestHeight / basicHeight,
      width * latestWidth / basicWidth,
      height * latestHeight / basicHeight
    ];
  },

  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs',
    });
  },

  onLoad: function () {
    //获取屏幕宽度，获取自适应单位
    wx.getSystemInfo({
      success:  res => {
        rpx = res.windowWidth / 375;
        console.log(res);
        this.setData({
          windowWidth: res.windowWidth
        });
      },
    })

  }
});