//initialize color scheme
var backgroundChartColor = 'rgb(246, 246, 247)';
var backgroundDarkChartColor = 'rgb(158, 161, 174)';
var borderChartColor = 'rgb(52, 59, 86)';
var from = 0;

$.ajax({
    url: "https://search-tyler-tfwyri4e6p6vpezxdwhwy2tj6e.eu-central-1.es.amazonaws.com/ordevandedag/document/_search?from=" + from.toString() + "&size=100",
    success: function (json) {
        if (json !== null) {
            for (hits in json['hits']['hits']) {
                //creating all the content
                appendJsonToContent(json['hits']['hits'][hits]['_source'], hits);
                //creating the sidebar menu
                getDetailJson(json['hits']['hits'][hits]['_source'], hits);
                // creating the detail page for the content [contributors]
                getDetailJsonExtra(json['hits']['hits'][hits]['_source'], hits);
                // creating the detail page for the content [views long]
                getDetailJsonDay(json['hits']['hits'][hits]['_source'], hits);
                // searching an article
                searchArticle(hits);
                //show only the seasonal items
                showSeasonal(json['hits']['hits'][hits]['_source']);
                //show all the items
                showAll(json['hits']['hits'][hits]['_source']);
                // hiding the sidebar
                hideSidebar();
                sortArticles();
            }
        }
    },
    error: function () {
        console.log('not found')
    }
});


function appendJsonToContent(item, number) {
    var wrapper = $(".articles");

    if (item['seasonality'] === true) {
        wrapper.append("<div class=\"panel-article card season\"  data-sort='"+ item['seasonality_percentage']+"' id=" + item['page_id'] + "></div>");
    } else {
        wrapper.append("<div class=\"panel-article card\"  data-sort='"+ item['seasonality_percentage']+"' id=" + item['page_id'] + " ></div>");
    }
    var articleContainer = $("#" + item['page_id']);

    articleContainer.append("<div class=\"front\" id=" + "first" + number + "></div>");
    articleContainer.append("<div class=\"back\" id=" + "second" + number + "></div>");
    articleContainer.append("<div class=\"side\" id=" + "fourth" + number + "></div>");
    articleContainer.append("<div class=\"back\" id=" + "third" + number + "></div>");

    var articleContent = $("#first" + number);
    var articleContentSecond = $("#second" + number);
    var articleContentThird = $("#third" + number);
    var articleContentFourth = $("#fourth" + number);

    articleContent.append("<button type=\"button\" class=\"btn btn-primary right\" id='details" + number + "'><i class=\"fa fa-plus-square-o\" aria-hidden=\"true\"></i></button>");
    articleContentSecond.append("<button type=\"button\" class=\"btn btn-primary right\" id='prev" + number + "'><i class=\"fa fa-minus-square-o\" aria-hidden=\"true\"></i></button>");

    articleContentSecond.hide();
    articleContentThird.hide();
    articleContentFourth.hide();

    if (item['seasonality'] === true) {
        articleContent.append("<h1 class=\"article-head\">" + item['clean_title'] + "<span class=\"badge badge-secondary seasonal\"><i class=\"fa fa-star\" aria-hidden=\"true\"></i> Seasonal</span></h1>");
    } else {
        articleContent.append("<h1 class=\"article-head\">" + item['clean_title'] + "</h1>");
    }

    articleContent.append("<p class=\"article-text\">" + item['extract'] + "</p>");
    articleContent.append("<p class=\"alert alert-secondary\"> " + item['seasonality_percentage'] +"% change on being seasonal</p>");
    articleContent.append("<a href=https://nl.wikipedia.org/wiki/" + item['title'] + "><button type=\"button\" class=\"btn btn-secondary\" id='link" + number + "'>View on wikipedia</button></a>");


    $('#details' + number).click(function () {
        articleContainer.toggleClass('flipped');

        articleContent.fadeToggle("slow");
        articleContentSecond.fadeIn("slow");
        articleContentThird.fadeIn("slow");
        articleContentFourth.fadeIn("slow");

        $('#' + item['page_id']).addClass('height')

    });

    $('#prev' + number).click(function () {
        articleContainer.toggleClass('flipped');

        articleContent.fadeToggle(1000);
        articleContentSecond.fadeOut("slow");
        articleContentThird.fadeOut("slow");
        articleContentFourth.fadeOut("slow");

        $('#' + item['page_id']).removeClass('height')
    });

}



function hideSidebar() {
    $('#sidebar-wrapper').hide();
    $('.row').removeClass('maincontent');
}

function getDetailJson(item, number) {
    $.ajax({
        url: 'https://nl.wikipedia.org/w/api.php',
        data: {action: 'query', titles: item['title'], format: 'json', prop: 'pageviews', rvprop: 'content'},
        dataType: 'jsonp',
        success: function (x) {
            var articleContent = $("#second" + number);
            if (x !== null) {
                jsonData = x.query.pages[item['page_id']];
                articleContent.append("<h1 class=\"article-head\">" + jsonData.title + "</h1>");
                articleContent.append("<div class='aspect-ratio'><canvas id=article-" + jsonData.pageid + "></canvas></div>");
                var pagechartname = jsonData.title + " views last 30 days";
                var pageviews = jsonData.pageviews;

                var views = [];
                var viewlabels = [];
                for (var view in pageviews) {
                    views.push(pageviews[view]);
                    viewlabels.push(view);
                }

                new Chart($("#article-" + jsonData.pageid)[0].getContext('2d'), {
                    // The type of chart we want to create
                    type: 'line',

                    // The data for our dataset
                    data: {
                        labels: viewlabels,
                        datasets: [{
                            label: pagechartname,
                            backgroundColor: backgroundChartColor,
                            borderColor: borderChartColor,
                            data: views
                        }]
                    },

                    // Configuration options go here
                    options: {responsive: true, maintainAspectRatio: false}
                });
            }
        },
        error: function () {
            console.log('not found')
        }
    });
}

function getDetailJsonExtra(item, number) {
    $.ajax({
        url: 'https://nl.wikipedia.org/w/api.php',
        data: {action: 'query', titles: item['title'], format: 'json', prop: 'contributors', rvprop: 'content'},
        dataType: 'jsonp',
        success: function (x) {
            var articleContent = $("#third" + number);
            if (x !== null) {
                jsonData = x.query.pages[item['page_id']];
                articleContent.append("<div class='aspect-ratio'><canvas id=articlecontributors-" + jsonData.pageid + "></canvas></div>");
                var pagechartname = jsonData.title + " contributors";
                var contributors = jsonData.contributors;
                var userid = [];
                var name = [];

                for (var contrib in contributors) {
                    name.push(contributors[contrib].name);
                    userid.push(contributors[contrib].userid);
                }
                new Chart($("#articlecontributors-" + jsonData.pageid)[0].getContext('2d'), {
                    // The type of chart we want to create
                    type: 'line',

                    // The data for our dataset
                    data: {
                        labels: name,
                        datasets: [{
                            label: pagechartname,
                            backgroundColor: backgroundChartColor,
                            borderColor: borderChartColor,
                            data: userid
                        }]
                    },

                    // Configuration options go here
                    options: {responsive: true, maintainAspectRatio: false}
                });
            }
        },
        error: function () {
            console.log('not found')
        }
    });
}

function getDetailJsonDay(item, number) {
    $.ajax({
        url: item['view_url'],
        success: function (x) {
            var articleContent = $("#fourth" + number);
            if (x !== null) {
                jsonData = x.items;
                var views = [];
                var labels = [];
                for (var i = 0; i < jsonData.length; i++) {
                    views.push(jsonData[i]['views']);

                    str = jsonData[i]['timestamp'];
                    var year = str.slice(0, 4);
                    var month = str.slice(4, 6);
                    var day = str.slice(6, 8);
                    var date = year + "-" + month + "-" + day;

                    labels.push(date);
                }
                articleContent.append("<div class='aspect-ratio'><canvas id=articleviews-" + item['page_id'] + "></canvas></div>");
                articleContent.append("<a href=" + item['view_url'] + "><button type=\"button\" class=\"btn btn-secondary content-center btn-lg\" id='link" + number + "'>View the data</button></a>");
                var pagechartname = item['clean_title'] + " detailed views";

                new Chart($("#articleviews-" + item['page_id'])[0].getContext('2d'), {
                    // The type of chart we want to create
                    type: 'line',

                    // The data for our dataset
                    data: {
                        labels: labels,
                        datasets: [{
                            label: pagechartname,
                            backgroundColor: backgroundDarkChartColor,
                            borderColor: borderChartColor,
                            data: views
                        }]
                    },

                    // Configuration options go here
                    options: {responsive: true, maintainAspectRatio: false}
                });
            }
        },
        error: function () {
            console.log('not found')
        }
    });
}

// var distance = $('#sidebar-wrapper').offset().top,
$window = $(window);

$window.scroll(function () {

    if (!$('.navbar').visible()) {
        $('#sidebar-wrapper').addClass('top-class');
    } else {
        $('#sidebar-wrapper').removeClass('top-class');
    }

});


function showSeasonal(item) {
    $('#seasonal').click(function () {
        var articleContainer = $("#" + item['page_id']);
        if (!articleContainer.hasClass('season')) {
            articleContainer.hide();
        }
    });
}



function showAll(item) {
    $('#all').click(function () {
        var articleContainer = $("#" + item['page_id']);
        if (!articleContainer.hasClass('season')) {
            articleContainer.show();
        }
    });
}

function searchArticle(number) {
    $("#searchItems").keyup(function () {
        var input = this.value;
        var div = $("#first" + number);
        // Loop through all list items, and hide those who don't match the search query
        for (i = 0; i < div.length; i++) {
            var h1 = div[i].getElementsByTagName("h1")[0];
            if (h1.innerHTML.toUpperCase().indexOf(input.toUpperCase()) > -1) {
                div[i].style.display = "";
            } else {
                div[i].style.display = "none";
            }
        }
    });
}

function sortArticles() {
    var div = $('#list');
    var listitems = div.children('div.card').get();
    listitems.sort(function (a, b) {
        return (+$(a).attr('data-sort') > +$(b).attr('data-sort')) ?
            -1 : (+$(a).attr('data-sort') < +$(b).attr('data-sort')) ?
                1 : 0;
    });

    $.each(listitems, function (idx, itm) { div.append(itm); });
}