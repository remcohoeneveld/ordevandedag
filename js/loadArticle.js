//initialize color scheme
var backgroundChartColor = 'rgb(246, 246, 247)';
var backgroundDarkChartColor = 'rgb(158, 161, 174)';
var borderChartColor = 'rgb(52, 59, 86)';


$.getJSON("https://search-tyler-tfwyri4e6p6vpezxdwhwy2tj6e.eu-central-1.es.amazonaws.com/pre-ordevandedag/document/_search", function (json) {
    for (hits in json['hits']['hits']) {
        //creating all the content
        appendJsonToContent(json['hits']['hits'][hits]['_source'], hits);
        //creating the sidebar menu
        appendJsonToMenu(json['hits']['hits'][hits]['_source'], hits);
        //creating the active status on the sidebar menu
        scrollActiveMenu(json['hits']['hits'][hits]['_source'], hits);
        // creating the detail page for the content [views short]
        getDetailJson(json['hits']['hits'][hits]['_source'], hits);
        // creating the detail page for the content [contributors]
        getDetailJsonExtra(json['hits']['hits'][hits]['_source'], hits);
        // creating the detail page for the content [views long]
        getDetailJsonDay(json['hits']['hits'][hits]['_source'], hits);
        // searching an article
        searchArticle(hits);
        // hiding the sidebar
        hideSidebar();
    }
});

function appendJsonToContent(item, number) {
    var wrapper = $(".articles");
    wrapper.append("<div class=\"panel-article card\" id=" + item['page_id'] + " ></div>");
    var articleContainer = $("#" + item['page_id']);

    articleContainer.append("<div class=\"front\" id=" + "first" + number + "></div>");
    articleContainer.append("<div class=\"back\" id=" + "second" + number + "></div>");
    articleContainer.append("<div class=\"side\" id=" + "fourth" + number + "></div>");
    articleContainer.append("<div class=\"back\" id=" + "third" + number + "></div>");

    var articleContent = $("#first" + number);
    var articleContentSecond = $("#second" + number);
    var articleContentThird = $("#third" + number);
    var articleContentFourth = $("#fourth" + number);

    articleContent.append("<button type=\"button\" class=\"btn btn-primary\" id='details" + number + "'><i class=\"fa fa-plus-square-o\" aria-hidden=\"true\"></i></button>");
    articleContentSecond.append("<button type=\"button\" class=\"btn btn-primary\" id='prev" + number + "'><i class=\"fa fa-minus-square-o\" aria-hidden=\"true\"></i></button>");

    articleContentSecond.hide();
    articleContentThird.hide();
    articleContentFourth.hide();

    articleContent.append("<h1 class=\"article-head\">" + item['clean_title'] + "</h1>");
    articleContent.append("<p class=\"article-text\">" + item['extract'] + "</p>");
    articleContent.append("<a href=https://nl.wikipedia.org/wiki/"+ item['title'] +"><button type=\"button\" class=\"btn btn-secondary\" id='link" + number + "'>View on wikipedia</button></a>");


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

function appendJsonToMenu(item, number) {
    number++;
    var wrapper = $("#menu-items-wrap");
    wrapper.append("<div class=\"menu-item chapter-item\"><div class=\"heading-wrap\" id=\"menu-" + item['page_id'] + "\" data-link=\"heading-one-anim\"></div></div>");
    var menuItem = $("#menu-" + item['page_id']);
    menuItem.append("<div class=\"chapter-num\">0" + number + "&nbsp;</div>");
    menuItem.append("<div class=\"chapter-heading\"><a href=\"#" + item['page_id'] + "\">" + item['clean_title'] + "</a></div>");
    menuItem.append("<div class=\"yellow-line\"></div>");

    var mobileListItem = $('.dropdown-menu');
    mobileListItem.append("<li><a href=\"#" + item['page_id'] + "\">" + item['clean_title'] + "</a></li>");
}


function scrollActiveMenu(item) {
    $(window).on('scroll', function () {
        $("#" + item['page_id']).each(function () {
            var visible = $(this).visible();
            if (visible) {
                $("#menu-" + item['page_id']).addClass('active')
            } else {
                $("#menu-" + item['page_id']).removeClass('active')
            }
        });
    });
}


function hideSidebar() {
    $('#hide-sidebar').click(function () {
        $('#sidebar-wrapper').toggleClass("hide");
        $('.maincontent').toggleClass("margin-left")
    });
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
                    labels.push(jsonData[i]['timestamp']);
                }
                articleContent.append("<div class='aspect-ratio'><canvas id=articleviews-" + item['page_id'] + "></canvas></div>");
                articleContent.append("<a href="+ item['view_url'] +"><button type=\"button\" class=\"btn btn-secondary content-center btn-lg\" id='link" + number + "'>View the data</button></a>");
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

var distance = $('#sidebar-wrapper').offset().top,
    $window = $(window);

$window.scroll(function () {
    if (!$('.navbar').visible()) {
        $('#sidebar-wrapper').addClass('top-class');
    } else {
        $('#sidebar-wrapper').removeClass('top-class');
    }

});

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