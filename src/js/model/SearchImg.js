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
