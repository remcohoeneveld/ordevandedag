$.getJSON("dummyContent.json", function (json) {
    for (item in json['items']) {
        appendJsonToContent(json['items'][item], item);
        appendJsonToMenu(json['items'][item], item);
        scrollActiveMenu(json['items'][item]);
        getDetailJson(json['items'][item], item);
        getDetailJsonExtra(json['items'][item], item);
        searchArticle(item);
    }
});

function appendJsonToContent(item, number) {
    var wrapper = $(".articles");
    wrapper.append("<div class=\"panel-article card\" id=" + item['pageid'] + " ></div>");
    var articleContainer = $("#" + item['pageid']);

    articleContainer.append("<div class=\"front\" id=" + "first" + number + "></div>");
    articleContainer.append("<div class=\"back\" id=" + "second" + number + "></div>");
    articleContainer.append("<div class=\"side\" id=" + "third" + number + "></div>");

    var articleContent = $("#first" + number);
    var articleContentSecond = $("#second" + number);
    var articleContentThird = $("#third" + number);

    articleContent.append("<button type=\"button\" class=\"btn btn-primary\" id='details" + number + "'><i class=\"fa fa-plus-square-o\" aria-hidden=\"true\"></i></button>");
    articleContentSecond.append("<button type=\"button\" class=\"btn btn-primary\" id='prev" + number + "'><i class=\"fa fa-minus-square-o\" aria-hidden=\"true\"></i></button>");

    articleContentSecond.hide();
    articleContentThird.hide();

    articleContent.append("<h1 class=\"article-head\">" + item['title'] + "</h1>");
    articleContent.append("<p class=\"article-text\">" + item['extract'] + "</p>");


    $('#details' + number).click(function () {
        articleContainer.toggleClass('flipped');

        articleContent.fadeToggle("slow");
        articleContentSecond.fadeIn("slow");
        articleContentThird.fadeIn("slow");

        $('#' + item['pageid']).animate({height: "1100px"}, 1000);

    });

    $('#prev' + number).click(function () {
        articleContainer.toggleClass('flipped');

        articleContent.fadeToggle(1000);
        articleContentSecond.fadeOut("slow");
        articleContentThird.fadeOut("slow");

        $('#' + item['pageid']).animate({height: "350px"}, 1000);
    });

}

function appendJsonToMenu(item, number) {
    number++;
    var wrapper = $("#menu-items-wrap");
    wrapper.append("<div class=\"menu-item chapter-item\"><div class=\"heading-wrap\" id=\"menu-" + item['pageid'] + "\" data-link=\"heading-one-anim\"></div></div>");
    var menuItem = $("#menu-" + item['pageid']);
    menuItem.append("<div class=\"chapter-num\">0" + number + "&nbsp;</div>");
    menuItem.append("<div class=\"chapter-heading\"><a href=\"#" + item['pageid'] + "\">" + item['title'] + "</a></div>");
    menuItem.append("<div class=\"yellow-line\"></div>");

    var mobileListItem = $('.dropdown-menu');
    mobileListItem.append("<li><a href=\"#" + item['pageid'] + "\">" + item['title'] + "</a></li>");
}


function scrollActiveMenu(item) {
    $(window).on('scroll', function () {
        $("#" + item['pageid']).each(function () {
            var visible = $(this).visible();
            if (visible) {
                $("#menu-" + item['pageid']).addClass('active')
            } else {
                $("#menu-" + item['pageid']).removeClass('active')
            }
        });
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
                jsonData = x.query.pages[item['pageid']];
                articleContent.append("<h1 class=\"article-head\">" + jsonData.title + "</h1>");
                articleContent.append("<div class='aspect-ratio'><canvas id=article-" + jsonData.pageid + "></canvas></div>");
                var pagechartname = jsonData.title;
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
                            backgroundColor: 'rgb(158, 162, 181)',
                            borderColor: 'rgb(52, 59, 86)',
                            data: views
                        }]
                    },

                    // Configuration options go here
                    options: { responsive:true, maintainAspectRatio: false }
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
                jsonData = x.query.pages[item['pageid']];
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
                            backgroundColor: 'rgb(158, 162, 200)',
                            borderColor: 'rgb(52, 59, 86)',
                            data: userid
                        }]
                    },

                    // Configuration options go here
                    options: { responsive:true, maintainAspectRatio: false }
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