(function(global, doc, $, ns, undefined) {
	'use strict';
	ns = ns || {};	

  var originalConstructor;

  function SubmitHandler(elm){
		this.elm = elm;
  }

  originalConstructor = SubmitHandler.prototype.constructor;
  SubmitHandler.prototype = new ns.EventDispatcher();
  SubmitHandler.prototype.constructor = originalConstructor;

	SubmitHandler.prototype.search = function(){
		var that = this,
        term;
		this.elm.on('submit', function(e){
			e.preventDefault();
      $(window).scrollTop(0);
      if( $(this).find('.year').val() !== '' ){
        term = $(this).find('.text').val() !== '' ?  $(this).find('.text').val() : ' ';
        that.fireEvent('SEARCH', that, term, $(this).find('.year').val() ); // 検索後を付与して発火
      }
		});
	};

  ns.SubmitHandler = SubmitHandler;
	global.decade = ns;
})(this, document, jQuery, this.decade);
