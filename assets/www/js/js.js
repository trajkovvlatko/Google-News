var db = "";
var topics = new Array();
var items = new Array();
var arrItems = new Array();
var selectedTopic = "";

$(document).ready(function(){
	
	$(".menuitem").each(function(){
		topics.push($.trim($(this).attr("title")));
	});
	
	
	function printItems(){
		$.each(arrItems, function(i, item){
			$(".news").append("<div class='title'>" + item[0] + "</div>");
			$(".footer").css({"bottom" : "0"});
		});
	}
	
	function getNews(topic, callback){
		arrItems = new Array();
		if(topic != "top"){
			topic = "&topic=" + topic;
		}else{
			topic = "";
		}
		$.ajax({
			type: "GET",
			url: "http://news.google.com/news?pz=1&cf=all&ned=us&hl=en&output=rss" + topic,
			dataType: "xml",
			success: function(xml) {
				$(xml).find('item').each(function(){
					var title = $(this).find('title').text();
					var link = $(this).find('link').text();
					var desc = $(this).find('description').text();
					var category = $(this).find('category').text();
					
					var div = document.createElement("div");
					div.innerHTML = desc;
					var text = div.textContent || div.innerText || "";
					desc = text;
					
					arrItems.push(new Array(title, link, desc, category));
				});
				if (callback && typeof(callback) === "function") {  
			        callback();  
			    }  
			},
			error:function (xhr, ajaxOptions, thrownError){
				alert("No Internet Connection.");
            }   
		});	
	}
	
	
	$(".menuitem").click(function(){
		$(".mainmenu").toggle(200);
		$(".news").toggle(200);
		$(".news").html("");
		var topic = $.trim($(this).attr("title"));
		selectedTopic = $.trim($(this).html());
		$(".header").html(selectedTopic);
		//getNews(topic, function() {
		  	db.transaction(getItemsByCategory, errorCB);
		//});
	});
	
	$(".getNews").click(function(){
		db.transaction(truncateNewsTable);
		$.each(topics, function(i, topic){
			getNews(topic, function() {
			  	db.transaction(insertItems, errorInsertItems, successInsertItems);
			});
		});
	});
	
	$(".showAllNews").click(function(){
		$(".news").html("");
		$(".header").html("All News");
    	db.transaction(showAllNews, errorCB);
    });
	   
    $(".header").click(function(){
    	$(".news").toggle();
    	$(".mainmenu").toggle(200);
    });
    
    $(".title").live("click", function(){
    	$(this).next().toggle(70);
    })

});