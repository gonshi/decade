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
