var TITLE = "五四陈科学院";
var RSS = "http://2014.54chen.com/rss.xml";
var entries = [];
var selectedEntry = "";

$(".contentLink").live("click", function() {
	selectedEntry = $(this).data("entryid");
});

function renderEntries(entries) {
    var s = '';
    $.each(entries, function(i, v) {
        s += '<li><a href="#contentPage" class="contentLink" data-entryid="'+i+'">' + v.title + '</a></li>';
    });
    $("#linksList").html(s);
    $("#linksList").listview("refresh");
}

function initialize() {
	console.log('ready to use google');
        var d = new Date().getTime();
        var url = RSS + "?" + d;
	var feed = new google.feeds.Feed(url);
	feed.setNumEntries(10);
	$.mobile.showPageLoadingMsg();
	feed.load(function(result) {
		$.mobile.hidePageLoadingMsg();
                console.log("feed:" + url);
		if(!result.error) {
			entries = result.feed.entries;
			localStorage["entries"] = JSON.stringify(entries);
			renderEntries(entries);
		} else {
			console.log("Error - "+result.error.message);
			if(localStorage["entries"]) {
				$("#status").html("Using cached version...");
				entries = JSON.parse(localStorage["entries"]);
				renderEntries(entries);
			} else {
				$("#status").html("Sorry, we are unable to get the RSS and there is no cache.");
			}
		}
	});
}

//Listen for main page
$("#mainPage").live("pageinit", function() {
	//Set the title
	$("h1", this).text(TITLE);
	
	google.load("feeds", "1",{callback:initialize});
});

$("#mainPage").live("pagebeforeshow", function(event,data) {
	if(data.prevPage.length) {
		$("h1", data.prevPage).text("");
		$("#entryText", data.prevPage).html("");
	};
});

//Listen for the content page to load
$("#contentPage").live("pageshow", function(prepage) {
	//Set the title
	$("h1", this).text(entries[selectedEntry].title);
	var contentHTML = "";
	contentHTML += entries[selectedEntry].content;
	$("#entryText",this).html(contentHTML);
	$("#entryText .fullLink",this).button();

});
	
$(window).on("touchstart", ".fullLink", function(e) {
	e.preventDefault();
	window.plugins.childBrowser.showWebPage($(this).attr("href"));
});

