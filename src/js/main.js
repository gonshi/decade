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
