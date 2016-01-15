# angular-BMap
1. angularjs简单封装百度地图;
2. 在app.js中引用angularMap模块,如：angular.module('bMapApp', ['angularMap']);
3. 所有方法均返回promise对象

##使用Bower安装
bower install angular-BMap --save或bower install douxc/angular-BMap --save
##默认中心点设置
angularBMapProvider.setDefaultPosition(lng,lat)
>默认中心点为南京

##initMap
初始化地图操作
##geoLocation
获取当前位置
##geoLocationAndCenter
获取当前位置，并将地图中心点移到该位置
##drawPoints
向地图添加兴趣点
>1. 兴趣点格式只支持array和object，且必须含有loc对象；<br/>
如{loc: {lng: 121.496011, lat: 31.244085}}、<br/>
{loc: '121.493065,31.244981'}、<br/>
[{loc: {lng: 121.496011, lat: 31.244085}},{loc: '121.493065,31.244981'}]<br/>均可以添加
2. 不支持的兴趣点格式不会添加到地图上，不影响正确的格式添加；<br/>
如[{loc: {lng: 121.496011, lat: 31.244085}},<br/>{lod: '121.494215,31.243005'},<br/>{loc: '121.493065,31.244981'}]<br/>只有第1、3两个点会添加到地图上；<br/>
3. 错误信息会通过defer.notify()返回；格式：第 ?个兴趣点loc对象不存在或格式错误，只支持object和string;
4. 当前处理进度（第n个兴趣点）也会通过defer.notify()返回；需要自己处理

##drawMarkersAndSetOnclick
向地图添加兴趣点，同时添加点击事件
>1. 传入参数：<br/>1）markers 参考drawPoints；<br/>2）onClick - function 点击事件，在点击事件中可以通过this.obj获取当前markers对象<br/>
2. 默认点击事件是将地图中心点移动到点击的位置

##默认的地图指令angularBmap
使用方式：\<angular-bmap\>\</angular-bmap\>