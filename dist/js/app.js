(function(global, doc, $, ns, undefined) {
	'use strict';
	ns = ns || {};	

	function EventDispatcher() {
		this._events = {};
	}

	EventDispatcher.prototype.hasEventListener = function(eventName) {
		return !!this._events[eventName];
	};

	EventDispatcher.prototype.addEventListener = function(eventName, callback) {
		if (this.hasEventListener(eventName)) {
			var events = this._events[eventName];
			for (var i in events) {
				if (events[i] === callback) {
					return;
				}
			}
			events.push(callback);
		}
		else{
			this._events[eventName] = [callback];
		}
		return this;
	};

	EventDispatcher.prototype.removeEventListener = function(eventName, callback) {
		if (!this.hasEventListener(eventName)) {
			return;
		}
		else{
			var events = this._events[eventName],
					i      = events.length,
					index;
			while (i--) {
				if (events[i] === callback) {
					index = i;
				}
			}
			events.splice(index, 1);
		}
		return this;
	};

	EventDispatcher.prototype.fireEvent = function(eventName, opt_this) {
		if (!this.hasEventListener(eventName)) {
			return;
		}
		else{
			var events = this._events[eventName],
			copyEvents = $.merge([], events),
			arg        = $.merge([], arguments);
			arg.splice(0, 2);
			for (var i in copyEvents) {
				copyEvents[i].apply(opt_this || this, arg);
			}
		}
	};

	ns.EventDispatcher = EventDispatcher;
  global.decade = ns;
})(this, document, jQuery, this.decade);

(function(global, doc, $, ns, undefined) {
	'use strict';
	ns = ns || {};	

	function Throttle(minInterval) {
    this.interval = minInterval;
    this.prevTime = 0;
    this.timer = function(){};
	}

	Throttle.prototype.exec = function(callback) {
    var now = + new Date(),
        delta = now - this.prevTime;

    clearTimeout(this.timer);
    if( delta >= this.interval ){
      this.prevTime = now;
      callback();
    }
    else{
      this.timer = setTimeout(callback, this.interval);
    }
  };

	ns.Throttle = Throttle;
  global.decade = ns;
})(this, document, jQuery, this.decade);

(function(global, doc, $, ns, undefined) {
	'use strict';
	ns = ns || {};

  var originalConstructor,
      instance;

	function SearchImg(){
		//this.url='http://ajax.googleapis.com/ajax/services/search/images?v=1.0&callback=response';
		this.url= 'https://www.googleapis.com/customsearch/v1?key=AIzaSyD0-vENpzFF5YJLKBbeebqaAX7fXM-qBM0&' +
                  'cx=016489218282066124601:rfqomcxwe0w';
 	}

  originalConstructor = SearchImg.prototype.constructor;
  SearchImg.prototype = new ns.EventDispatcher();
  SearchImg.prototype.constructor = originalConstructor;

	SearchImg.prototype.exec = function(term, year){
      this.term = term || this.term;
      this.year = year || this.year;
      var src = this.url + '&q=' + encodeURIComponent(this.term) + '%20' +
                this.year + '年' + '&searchType=image&num=8';
      $.ajax({
        type: 'get',
        url: src,
      }).done(function(data){
          window.response(data);
      });
      $('<div>').addClass('year').data({year: this.year}).appendTo('.photoLayers'); // add new Container
	};

  SearchImg.getInstance = function() {
    if (!instance) {
      instance = new SearchImg();
    }
    return instance;
  };

  ns.SearchImg = SearchImg;
	global.decade = ns;
})(this, document, jQuery, this.decade);

/* jshint ignore:start */
var originalConstructor,
    photo = [
			'<div class="layer">',
				'<div class="photoContainer">',
					'<p class="title gothic">',
						'${title}',
					'</p>',
					'<p class="photo">',
						'<img src="${src}" alt="${title}" data-url=${url}>',
					'</p>',
				'</div>',
			'</div>'
		].join('');

function response(data) {
  // when google response has failed, retry the process
	if(data.items.length === 0){
    decade.loading('on');
		setTimeout(function(){
			$('.photoLayers').find('.year:last-child').remove();
			response.prototype.fireEvent('RETRY');
		}, 500);
  }
  else{
    decade.loading('off');
  }
  /////////////////////////////
  var that = this,
      results = data.items,
			target = $('.photoLayers').find('.year').last(), // the newly added container
			imgCount = 0,
      maxCount = 8,
			_loadedImg = [],
			FIRST = !$('.centerLine').hasClass('show'),
      START_POS = $('.layer').last().hasClass('rightColumn') ? 0 : 1; // 直前のレイヤーが右寄せなら、開始positionは左寄せから

	for(var i = 0; i < results.length; i++){
		_loadedImg[i] = new Image();
    _loadedImg[i].finished = false;
		_loadedImg[i].onload = append(i);
    _loadedImg[i].onerror =  error(i);
		_loadedImg[i].src = results[i].image.thumbnailLink;

    (function(_i){
      setTimeout(function(){
        if( !_loadedImg[_i].finished){
          error(_i)();
        }
      }, 3000);
    }(i));

    function error(i){
      return function(){
        maxCount--;
        if( imgCount === maxCount ){
          response.prototype.fireEvent('FINISH', that, target.data('year'));
        }
        _loadedImg[i].finished = true;
      }
    }

		function append(i){
			var position,
					layer;
			return function(){
				position = ( ( imgCount + START_POS ) % 2 === 0 ) ? 'leftColumn' : 'rightColumn';
				imgCount++;
				if(FIRST){
					$('.centerLine').addClass('show');
					FIRST = false;
				}

        console.log(results[i]);
        if( !_loadedImg[i].finished ){
          _loadedImg[i].finished = true;
          layer = $.tmpl(photo,{
            'src': results[i].image.thumbnailLink,
            'title': results[i].title,
            'url': results[i].link
          }).
          appendTo(target).
          addClass(position);

          setTimeout(function(){
            layer.addClass('show');
            if( imgCount === maxCount ){
              response.prototype.fireEvent('FINISH', that, target.data('year') );
            }
          }, 100);
        }
			}
		}

	}
}

originalConstructor = response.prototype.constructor;
response.prototype = new this.decade.EventDispatcher();
response.prototype.constructor = originalConstructor;
/* jshint ignore:end*/

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

(function(global, doc, $, ns, undefined) {
	'use strict';
	ns = ns || {};

	ns.modal = function(){
		var $modalBack = $('#modalBack'),
				$modalContainer = $('#modalContainer'),
				$modalPhoto = $('#modalContainer').find('.photo'),
				$modalImg = $('#modalContainer').find('.photo img'),
        $modalTitle = $('#modalContainer').find('.title'),
				$modalClose = $('#modalContainer').find('.close'),
				imgSrc,
        imgTitle,
        imgLink,
				imgWidth,
				imgHeight;

		$(document).on('click', '.photoContainer img', function(){
			imgSrc = $(this).attr('src');
      imgTitle = $(this).attr('alt');
      imgLink = $(this).data('url');
			$modalImg.attr({src: imgSrc});
      $modalContainer.find('.title').text(imgTitle);
      $modalPhoto.find('a').attr({href: imgLink});
			$modalContainer.css({display: 'block'}); // width, heightを取得する前にdiplay: blockにしておかないと0が返ってきてしまう

			if($modalImg[0].complete){
				complete();
			}
			else{
				$modalImg.on('load', complete); // wait till append finish
			}
		});

		function complete(){
			imgWidth = Math.min($modalImg.width() * 3, 600);
			imgHeight = Math.min($modalImg.height() * 3, 400);

			// centering
			$modalPhoto.
				css({
					width: imgWidth,
					height: imgHeight,
					marginTop: -0.5 * imgHeight,
					marginLeft: -0.5 * imgWidth
				});

			$modalClose.
				css({
					marginTop: -0.5 * imgHeight,
					marginLeft: 0.5 * imgWidth + 10
				});

			$modalTitle.
				css({
					width: imgWidth,
					marginTop: 0.5 * imgHeight + 10,
					marginLeft: -0.5 * imgWidth
				});
			/////////////////////

			// fade in of Modal
			$modalBack.
				css({display: 'block'}).
				animate({opacity: 0.8});
			$modalContainer.animate({opacity: 1});
			///////////////////
		}

    $('#modalBack, #modalContainer').on('click', function(e){
      var target = $(e.target);
      if( target.attr('id') === 'modalContainer' || target.attr('class') === 'closeImg' ){
				// close animation
				$('#modalBack, #modalContainer').
					animate({opacity: 0}, function(){
						$('#modalBack').css({display: 'none'});
						$('#modalContainer').css({display: 'none'});
					});
				//////////////////
      }
    });
	};

	ns.loading = function(state){
		var _state = state || 'on';
		if( _state === 'on' ){
			$('#modalBack').
				clearQueue().stop().
				css({display: 'block'}).
				animate({opacity: 0.9});

			$('#loadingContainer').
				clearQueue().stop().
				css({display: 'block'}).
				animate({opacity: 1});
		}
		else{
      if( $('#modalContainer').css('opacity') === '0' ){
        $('#modalBack').
          clearQueue().stop().
          animate({opacity: 0},function(){
            $('#modalBack').css({display: 'none'});
          });
      }
			$('#loadingContainer').
				clearQueue().stop().
				animate({opacity: 0},function(){
					$('#loadingContainer').css({display: 'none'});
				});
		}
	};

  ns.open = function(){
    $('.tutorial .arrow').on('click', openContents);
    $(doc).on('mousewheel', function(e){
      e.preventDefault();
      openContents();
    });

    function openContents(){
      $('.tutorial .arrow').off('click');
      $(doc).off('mousewheel');

      $('.tutorial').animate({
        top: -300
      }, 1000, 'easeInExpo',
        function(){
          $('#modalBack').animate({opacity: 0},function(){
            $('#modalBack').css({display: 'none'});
            $('.searchForm').trigger('submit');
          });
        });
    }
  };

	global.decade = ns;
})(this, document, jQuery, this.decade);

(function(global, doc, $, ns, undefined) {
	'use strict';
	ns = ns || {};

	$(function() {
		var /* jshint ignore:start */
        DECADE = 10,
        searchedYear = -1,
        /* jshint ignore:end */
        searchForm = new ns.SubmitHandler( $('.searchForm') ),
				searchImg = ns.SearchImg.getInstance(),
        scroll = ns.ScrollHandler.getInstance(),
        $searchFormEra = $('.searchForm').find('.year'),
        $photoLayers = $('.photoLayers'),
        term,
        year,
        agent,
        searchCount = 0;

        /* jshint ignore:start */
        if(location.href.match('localhost')) DECADE = 1;
        /* jshint ignore:end */

    // ua
    agent = navigator.userAgent.toLowerCase();
    if( agent.match('iphone') || agent.match('ipod') || agent.match('ipad') || agent.match('android')){
      $('.caution').css({display: 'block'});
    }
    //////////////////////////

    // init
			ns.modal();
      ns.open();
    ///////////////////////////

		// when query has submitted
		searchForm.search();
		searchForm.addEventListener('SEARCH', function(_term, _year){
      // init
      $('.photoLayers').empty();
      $('.centerLine').removeClass('show');
			scroll.reset();
      searchCount = 0;
      term = _term;
      year = _year;
      /////////////////////
			searchImg.exec(term, year);
		});
    ///////////////////////////

    /* jshint ignore:start */
    // when loading image has finished
    global.response.prototype.addEventListener('FINISH', function(year){
      if( year !== searchedYear ){
        searchedYear = year;
        scroll.setThr( $photoLayers.find('.year').eq(searchCount).height() ); // height of the newly added photo container
        $('#scrollArea').css({height: scroll.thrArr[ scroll.thrArr.length - 1 ]}); // set scrollable area
        searchCount++;
        if( searchCount < DECADE ){
          year--;
          searchImg.exec(term, year);
        }
        else{
          //console.log(scroll.thrArr); // for DEBUG
        }
      }
    });
    ////////////////////////////////

    // when loading process failed
    global.response.prototype.addEventListener('RETRY', function(){
      searchImg.exec();
    });
    ///////////////////////////////

    /* jshint ignore:end*/

    // scroll Event
    scroll.exec();
    // when current page changes, the year value will change.
    scroll.addEventListener('OVER', function(pos){
      $searchFormEra.
        clearQueue().
        stop().
        animate({'transform': 'scale(1.1)'}, 150,
          function(){
            $searchFormEra.val( $photoLayers.find('.year').eq(pos).data('year') );
            $searchFormEra.animate({'transform': 'scale(1.0)'}, 200);
          }
        );
    });
    //////////////////////////////////////
	});
	global.decade = ns;
})(this, document, jQuery, this.decade);
