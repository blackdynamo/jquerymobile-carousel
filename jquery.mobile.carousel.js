/*!
 * jQuery Mobile Carousel
 * Source: https://github.com/blackdynamo/jQuery-Mobile-Carousel
 * Demo: http://jsfiddle.net/blackdynamo/yxhzU/
 * Blog: http://developingwithstyle.blogspot.com
 *
 * Copyright 2010, Donnovan Lewis
 * Edits: Benjamin Gleitzman (gleitz@mit.edu)
 * Licensed under the MIT
 */

(function($) {
    $.fn.carousel = function(options) {
        var settings = {
            duration: 300,
            direction: "horizontal",
            minimumDrag: 20,
            beforeStart: function(){},
            afterStart: function(){},
            beforeStop: function(){},
            afterStop: function(){}
        };

        $.extend(settings, options || {});

        return this.each(function() {
            if (this.tagName.toLowerCase() != "ul") return;

            var originalList = $(this);
            var pages = originalList.children();
            //var width = originalList.parent().width();
            //var height = originalList.parent().height();
            var width = originalList.parent().css('width');
            var height = originalList.parent().css('width');
            
            // scales the dimension (height or width).  if it is a relative
            // dimension, it strips the % and scales, then reattaches
            function scaleDimension(dim, scale){
                new_dim = dim * scale;
                if(dim.match(/%$/))
                {
                    pct = parseFloat(dim.substring(0, dim.length - 1));
                    new_dim = '' + (scale * pct) + '%';
                }
                return new_dim;
            }
            
            // if the width and height are percentages, we want to strip
            // the percentages, compute the new percentages, then re-attach
            listWidth = scaleDimension(width, pages.length);
            listItemWidth = width
            if(width.match(/%$/))
            {
                listItemWidth = scaleDimension(width, (1/pages.length));
            }

            //Css
            var containerCss = {position: "relative", overflow: "hidden", width: width, height: height};
            var listCss = {position: "relative", padding: "0", margin: "0", listStyle: "none", width: listWidth};
            var listItemCss = {width: listItemWidth, height: height};

            var container = $("<div>").css(containerCss);
            var list = $("<ul>").css(listCss);

            var currentPage = 1, start, stop;
            if (settings.direction.toLowerCase() === "horizontal") {
                list.css({float: "left"});
                $.each(pages, function(i) {
                    var li = $("<li>")
                            .css($.extend(listItemCss, {float: "left"}))
                            .addClass($(this).attr('class'))
                            .html($(this).html());
                    list.append(li);
                });

                list.draggable({
                    axis: "x",
                    start: function(event) {
                        settings.beforeStart.apply(list, arguments);

                        var data = event.originalEvent.touches ? event.originalEvent.touches[0] : event;
                        start = {
                            coords: [ data.pageX, data.pageY ]
                        };

                        settings.afterStart.apply(list, arguments);
                    },
                    stop: function(event) {
                        settings.beforeStop.apply(list, arguments);

                        var data = event.originalEvent.touches ? event.originalEvent.touches[0] : event;
                        stop = {
                            coords: [ data.pageX, data.pageY ]
                        };

                        start.coords[0] > stop.coords[0] ? moveLeft() : moveRight();
                        
                        function moveToNewPage(newPage)
                        {
                            var new_x = scaleDimension(width, -1 * (newPage - 1));
                            list.animate({ left: new_x}, settings.duration);
                            currentPage = newPage;
                        }

                        function moveLeft() {
                            newPage = currentPage + 1;
                            if (currentPage === pages.length || dragDelta() < settings.minimumDrag) {
                                newPage = currentPage;
                            }
                            moveToNewPage(newPage);
                        }

                        function moveRight() {
                            newPage = currentPage - 1;
                            if (currentPage === 1 || dragDelta() < settings.minimumDrag) {
                                newPage = currentPage;
                            }
                            moveToNewPage(newPage);
                        }

                        function dragDelta() {
                            return Math.abs(start.coords[0] - stop.coords[0]);
                        }

                        function adjustment() {
                            return width - dragDelta();
                        }

                        settings.afterStop.apply(list, arguments);
                    }
                });
            } else if (settings.direction.toLowerCase() === "vertical") {
                $.each(pages, function(i) {
                    var li = $("<li>")
                            .css(listItemCss)
                            .addClass($(this).attr('class'))
                            .html($(this).html());
                    list.append(li);
                });

                list.draggable({
                    axis: "y",
                    start: function(event) {
                        settings.beforeStart.apply(list, arguments);

                        var data = event.originalEvent.touches ? event.originalEvent.touches[0] : event;
                        start = {
                            coords: [ data.pageX, data.pageY ]
                        };

                        settings.afterStart.apply(list, arguments);
                    },
                    stop: function(event) {
                        settings.beforeStop.apply(list, arguments);

                        var data = event.originalEvent.touches ? event.originalEvent.touches[0] : event;
                        stop = {
                            coords: [ data.pageX, data.pageY ]
                        };

                        start.coords[1] > stop.coords[1] ? moveUp() : moveDown();
                        
                        function moveToNewPage(newPage)
                        {
                            var new_y = scaleDimension(height, -1 * (newPage - 1));
                            list.animate({ top: new_y}, settings.duration);
                            currentPage = newPage;
                        }

                        function moveUp() {
                            newPage = currentPage + 1;
                            if (currentPage === pages.length || dragDelta() < settings.minimumDrag) {
                                newPage = currentPage;
                            }
                            moveToNewPage(newPage);
                        }

                        function moveDown() {
                            newPage = currentPage - 1;
                            if (currentPage === 1 || dragDelta() < settings.minimumDrag) {
                                newPage = currentPage;
                            }
                            moveToNewPage(newPage);
                        }

                        function dragDelta() {
                            return Math.abs(start.coords[1] - stop.coords[1]);
                        }

                        function adjustment() {
                            return height - dragDelta();
                        }

                        settings.afterStop.apply(list, arguments);
                    }
                });
            }

            container.append(list);

            originalList.replaceWith(container);
        });
    };
})(jQuery);
