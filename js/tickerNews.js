function getTickerNews(){


	$.ajax({
		url:'https://stark-island-54204.herokuapp.com/cloud/api/beta/getTickerNews.php',

		complete:function(transport){
			tickerNewsResp = $.parseJSON(transport.responseText);

			for(i in tickerNewsResp){

				theTickerString = '<a href="'+tickerNewsResp[i]['url']+'" style="text-decoration:none" target="_blank"><spanner style="padding-right:10px; padding-left:10px; color:#E6E4E3 !important">'+tickerNewsResp[i]['title']+'</spanner></a> | ';
				$('.marquee span').append(theTickerString);
			}
		}
	})
}

getTickerNews();