$.getJSON("dummyContent.json", function (json) {
    for (item in json['items']) {
        appendJsonToContent(json['items'][item], item);
        appendJsonToMenu(json['items'][item], item);
        scrollActiveMenu(json['items'][item]);
        getDetailJson(json['items'][item], item);
        searchArticle(item);
    }
});

function appendJsonToContent(item, number) {
    var wrapper = $(".articles");
    wrapper.append("<div class=\"panel-article card\" id=" + item['pageid'] + " ></div>");
    var articleContainer = $("#" + item['pageid']);
    articleContainer.append("<div class=\"front\" id=" + "first" + number + "></div>");
    articleContainer.append("<div class=\"back\" id=" + "second" + number + "></div>");

    var articleContent = $("#first" + number);

    var articleContentSecond = $("#second" + number);
    //
    // articleContentSecond.hide();
    articleContent.append("<button type=\"button\" class=\"btn btn-primary\" id='details" + number + "'><i class=\"fa fa-plus-square-o\" aria-hidden=\"true\"></i></button>");
    articleContentSecond.append("<button type=\"button\" class=\"btn btn-primary\" id='prev" + number + "'><i class=\"fa fa-minus-square-o\" aria-hidden=\"true\"></i></button>");

    articleContent.append("<h1 class=\"article-head\">" + item['title'] + "</h1>");
    articleContent.append("<p class=\"article-text\">" + item['extract'] + "</p>");


    $('#details' + number).click(function () {
        // articleContent.hide();
        // articleContentSecond.show();
        articleContainer.toggleClass('flipped');
    });

    $('#prev' + number).click(function () {
        // articleContent.show();
        // articleContentSecond.hide();
        articleContainer.toggleClass('flipped');
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
}


function scrollActiveMenu(item) {
    $(window).on('scroll', function () {
        var scrollTop = $(this).scrollTop();

        $("#" + item['pageid']).each(function () {


            var topDistance = $(this).offset().top;

            if ((topDistance + 100) < scrollTop) {
                $("#menu-" + item['pageid']).addClass('active')
            } else {
                $("#menu-" + item['pageid']).removeClass('active')
            }
        });
    })
};


function getDetailJson(item, number) {

    $.ajax({
        url: 'https://nl.wikipedia.org/w/api.php',
        data: {action: 'query', titles: item['title'], format: 'json', prob: 'revisions', rvprop: 'content'},
        dataType: 'jsonp',
        success: function (x) {
            var articleContent = $("#second" + number);
            if (x !== null) {
                jsonData = x.query.pages[item['pageid']];
                articleContent.append("<h1 class=\"article-head\">" + jsonData.title + "</h1>");
                articleContent.append("<p class=\"article-text\">" + JSON.stringify(jsonData) + "</p>");
            }
        },
        error: function () {
            console.log('not found')
        }
    });
}

var distance = $('#sidebar-wrapper').offset().top - 50,
    $window = $(window);

$window.scroll(function () {
    if ($window.scrollTop() >= distance) {

        $('#sidebar-wrapper').addClass('top-class')
        // Your div has reached the top
    } else {
        $('#sidebar-wrapper').removeClass('top-class')
    }
});

function searchArticle(number) {
    $("#searchItems").keyup(function () {
        var input = this.value;
        console.log(input);
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