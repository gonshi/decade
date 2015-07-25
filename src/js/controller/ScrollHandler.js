(function(global, doc, $, ns, undefined) {
	'use strict';
	ns = ns || {};	

  var originalConstructor,
      instance,
      timelineDefaultPos = 'translateX(340px) rotateX(58deg) rotateY(0deg) rotateZ(31deg)';

	function ScrollHandler(){
		this.reset();
    this.throttle = new ns.Throttle(100);
 	}

  originalConstructor = ScrollHandler.prototype.constructor;
  ScrollHandler.prototype = new ns.EventDispatcher();
  ScrollHandler.prototype.constructor = originalConstructor;

  ScrollHandler.prototype.exec = function(){
    var that = this,
        i;
	
    $(window).on('scroll', function(){
      that.throttle.exec(scrollEvent);
    });

    function scrollEvent(){
      var scrollTop = $(window).scrollTop();
      $('.timeline').css({transform: timelineDefaultPos + ' translateY(' + ( -1 * scrollTop ) + 'px)'});
      for(i = that.thrArr.length - 1; i >= 0; i--){
        if( scrollTop > that.thrArr[i] ){
          if( i !== that.curPos ){
            that.curPos = i;
            that.fireEvent('OVER', that, i);
          }
          break;
        }
      }
    }
  };

	ScrollHandler.prototype.setThr = function(height){
    var nextThr = this.thrArr[ this.thrArr.length - 1 ] + height;
    this.thrArr.push(nextThr);
	};

	ScrollHandler.prototype.reset = function(){
    this.thrArr = [];
    this.thrArr[0] = parseInt( $('.photoLayers').css('margin-top') ); // default
    this.curPos = 0;
	};

  ScrollHandler.getInstance = function() {
    if (!instance) {
      instance = new ScrollHandler();
    }
    return instance;
  };

  ns.ScrollHandler = ScrollHandler;
  console.log(ScrollHandler.prototype);
	global.decade = ns;
})(this, document, jQuery, this.decade);
