/*!
 * jQuery Mobile Carousel
 * Source: https://github.com/blackdynamo/jQuery-Mobile-Carousel
 * Demo: http://jsfiddle.net/blackdynamo/yxhzU/
 * Blog: http://developingwithstyle.blogspot.com
 *
 * Copyright 2010, Donnovan Lewis
 * Licensed under the MIT
 */

(function($) {
    $.fn.carousel = function(options) {
        var settings = {
            duration: 300,
            direction: "horizontal",
            minimumDrag: 20
        };

        $.extend(settings, options || {});

        return this.each(function() {
            if (this.tagName.toLowerCase() != "ul") return;

            var originalList = $(this);
            var pages = originalList.children();
            var width = originalList.parent().width();
            var height = originalList.parent().height();

            //Css
            var containerCss = {position: "relative", overflow: "hidden", width: width, height: height};
            var listCss = {position: "relative", padding: "0", margin: "0", listStyle: "none", width: pages.length * width};
            var listItemCss = {width: width, height: height};

            var container = $("<div>").css(containerCss);
            var list = $("<ul>").css(listCss);

            var colors = ["1BA7CD","593D0D","777154","3B7ACE","3A3AB2","1DDB49","993D73","AEB2F1","73CED9","C03FBF","2DC090","93AC01","0B0CE0","D53A31","3F27FE","62B325","3C8E99","1485EB","62B99A","70D33F","97B264","B6E074","388BD7","6492D3","D53A97","92F545","90C713","C4C509","C7E59C","862C0B","4AE4F3","984605","9DA52A","FE2E4B","AC1D92","8EC72C","BB4F25","4B2F14","913BF7","7A497E","B0C87E"];

            var currentPage = 1, start, stop;
            if (settings.direction.toLowerCase() === "horizontal") {
                list.css({float: "left"});
                $.each(pages, function(i) {
                    var li = $("<li>")
                            .css($.extend(listItemCss, {float: "left", backgroundColor: colors[i]}))
                            .html($(this).html());
                    list.append(li);
                });

                list.draggable({
                    axis: "x",
                    start: function(event) {
                        var data = event.originalEvent.touches ? event.originalEvent.touches[0] : event;
                        start = {
                            coords: [ data.pageX, data.pageY ]
                        };
                    },
                    stop: function(event) {
                        var data = event.originalEvent.touches ? event.originalEvent.touches[0] : event;
                        stop = {
                            coords: [ data.pageX, data.pageY ]
                        };

                        start.coords[0] > stop.coords[0] ? moveLeft() : moveRight();

                        function moveLeft() {
                            if (currentPage === pages.length || dragDelta() < settings.minimumDrag) {
                                list.animate({ left: "+=" + dragDelta()}, settings.duration);
                                return;
                            }
                            list.animate({ left: "-=" + adjustment()}, settings.duration);
                            currentPage++;
                        }

                        function moveRight() {
                            if (currentPage === 1 || dragDelta() < settings.minimumDrag) {
                                list.animate({ left: "-=" + dragDelta()}, settings.duration);
                                return;
                            }
                            list.animate({ left: "+=" + adjustment()}, settings.duration);
                            currentPage--;
                        }

                        function dragDelta() {
                            return Math.abs(start.coords[0] - stop.coords[0]);
                        }

                        function adjustment() {
                            return width - dragDelta();
                        }
                    }
                });
            } else if (settings.direction.toLowerCase() === "vertical") {
                $.each(pages, function(i) {
                    var li = $("<li>")
                            .css($.extend(listItemCss, {backgroundColor: colors[i]}))
                            .html($(this).html());
                    list.append(li);
                });

                list.draggable({
                    axis: "y",
                    start: function(event) {
                        var data = event.originalEvent.touches ? event.originalEvent.touches[0] : event;
                        start = {
                            coords: [ data.pageX, data.pageY ]
                        };
                    },
                    stop: function(event) {
                        var data = event.originalEvent.touches ? event.originalEvent.touches[0] : event;
                        stop = {
                            coords: [ data.pageX, data.pageY ]
                        };

                        start.coords[1] > stop.coords[1] ? moveUp() : moveDown();

                        function moveUp() {
                            if (currentPage === pages.length || dragDelta() < settings.minimumDrag) {
                                list.animate({ top: "+=" + dragDelta()}, settings.duration);
                                return;
                            }
                            list.animate({ top: "-=" + adjustment()}, settings.duration);
                            currentPage++;
                        }

                        function moveDown() {
                            if (currentPage === 1 || dragDelta() < settings.minimumDrag) {
                                list.animate({ top: "-=" + dragDelta()}, settings.duration);
                                return;
                            }
                            list.animate({ top: "+=" + adjustment()}, settings.duration);
                            currentPage--;
                        }

                        function dragDelta() {
                            return Math.abs(start.coords[1] - stop.coords[1]);
                        }

                        function adjustment() {
                            return height - dragDelta();
                        }
                    }
                });
            }

            container.append(list);

            originalList.replaceWith(container);
        });
    };
})(jQuery);