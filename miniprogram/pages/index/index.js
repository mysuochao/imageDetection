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
  },
  loadImage: function() {
    wx.chooseImage({
      sizeType: ['original'],
      sourceType: ['album'],
      success: res => {
        wx.getImageInfo({
          src: res.tempFilePaths[0],
          complete: (res2) => {
            console.log('======= image info ===========');
            console.log(res2);
            console.log('======= pixelRatio info ===========');
            console.log(this.data.pixelRatio);
            this.setData({
              basicInfo: {
                radio: res2.width / res2.height,
                width: res2.width,
                height: res2.height
              },
              image: res.tempFilePaths[0],
              latest: {
                width: this.data.windowWidth,
                height: this.data.windowWidth / this.data.basicInfo.radio
              },
              windowHeight: this.data.windowWidth / this.data.basicInfo.radio + 'px'

            });

            const ctx = wx.createCanvasContext('myCanvas');

            const pixelRatio = this.data.pixelRatio;
            // console.log('========== 原图大小===========');
            // console.log(this.data.basicInfo.width, this.data.basicInfo.height);
            ctx.drawImage(res.tempFilePaths[0], 0, 0, this.data.basicInfo.width, this.data.basicInfo.height);

            ctx.setStrokeStyle('yellow')
            for (let i = 0; i < coordinate.length; i++) {
              const latestCoordinate = this.format(coordinate[i]);
              console.log('=======矩形坐标==========');
              console.log(latestCoordinate);
              ctx.strokeRect(...latestCoordinate);
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


            // const ctx = wx.createCanvasContext('myCanvas');
            // // ctx.drawImage(res.tempFilePaths[0], 0, 0, this.data.windowWidth, this.data.windowWidth / this.data.basicInfo.radio);
            // const pixelRatio = this.data.pixelRatio;
            // console.log(pixelRatio, this.data.basicInfo.width * pixelRatio);
            // ctx.drawImage(res.tempFilePaths[0], 0, 0, this.data.basicInfo.width, this.data.basicInfo.height);
            // ctx.setStrokeStyle('yellow')
            // for (let i = 0; i < coordinate.length; i++) {
            //   const latestCoordinate = this.format(coordinate[i]);
            //   console.log(latestCoordinate);
            //   ctx.strokeRect(...latestCoordinate);
            // }
            // ctx.draw();
            // ctx.draw(true, () => {
            //   wx.canvasToTempFilePath({
            //     x: 0,
            //     y: 0,
            //     width: this.data.basicInfo.width,
            //     height: this.data.basicInfo.height,
            //     destWidth: this.data.windowWidth,
            //     destHeight: this.data.windowWidth / this.data.basicInfo.radio,
            //     canvasId: 'myCanvas',
            //     success: (res) => {
            //       console.log(res.tempFilePath)
            //       this.setData({
            //         rtn: res.tempFilePath,
            //         imgSrc: res.tempFilePath
            //       });
            //       // wx.previewImage({
            //       //   current: res.tempFilePath, // 当前显示图片的http链接
            //       //   urls: [res.tempFilePath] // 需要预览的图片http链接列表
            //       // })
            //     }
            //   })
            // });

          }
        });
      }
    })
  },
  format: function(coor) {

    const {
      basicInfo: {
        height: basicHeight,
        width: basicWidth,
      },
      pixelRatio
    } = this.data;
    const {
      height: latestHeight,
      width: latestWidth
    } = this.data.latest;

    const [x, y, width, height] = coor;
    // return [
    //   x * latestWidth / basicWidth,
    //   y * latestHeight / basicHeight,
    //   width * latestWidth / basicWidth,
    //   height * latestHeight / basicHeight
    // ];
    // return [x / pixelRatio, y / pixelRatio, width / pixelRatio, height / pixelRatio];
    return [x, y, width, height];
  },

  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs',
    });
  },

  onLoad: function() {
    //获取屏幕宽度，获取自适应单位
    wx.getSystemInfo({
      success: res => {
        rpx = res.windowWidth / 375;
        console.log(res);
        this.setData({
          pixelRatio: res.pixelRatio,
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight
        });
      },
    })

  }
});