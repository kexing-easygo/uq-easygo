Page({
  data: {
    progress_txt: 100,
  },

  drawCirclebg: function() {
    var circle = wx.createCanvasContext('canvasProgressbg')
    circle.setLineWidth(5);
    circle.setStrokeStyle("#000000");
    circle.setLineCap("butt");
    circle.beginPath();
    circle.arc(100, 100, 50, 0, 2 * Math.PI, false);
    circle.stroke();
    circle.draw();
  },

  drawCircleftont: function() {
    
  },


 onReady: function () {
  this.drawCirclebg(); 
},

})

