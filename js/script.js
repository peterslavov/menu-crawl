(function($) {
    
    function Menu(options, $ol, $cnt) {
        var increment = 10;
        var spacing;
        var elHeight;

        function init() {
            populate();
            spacing = parseInt($(".option").first().css("margin-top").replace("px", ""));
            calcScrollUp();
        }

        function scrollCont(distance) {
            if (distance < 0) {
                var top = parseInt($ol.css("top").replace("px", ""));
                $ol.removeAttr("style");
                $ol.css("top", top+distance);
                calcScrollUp();
            } else if (distance > 0) {
                var bottom = parseInt($ol.css("bottom").replace("px", ""));
                $ol.removeAttr("style");
                $ol.css("bottom", bottom-distance);
                calcScrollDown();
            }
        }

        function populate() {
            $.each(options, function(i, v) {
                $ol.append("<div class='option' data-option='"+i+"'>"+v+"</div>");
            });
        }

        function calcScrollUp() {
            var cntBot = $cnt.offset().top + $cnt.outerHeight();
            var cntTop = $cnt.offset().top;
            
            $ol.children(".option").each(function() {
                changeOpacity(this);
                //Remove top elements
                var elTop = $(this).offset().top;
                elHeight = $(this).outerHeight();
                var elBot = elTop + elHeight;
                if ((elBot - cntTop) <= 0) {
                    //Shift whole list down
                    //console.log("Before shift second element is at: "+$ol.find(":nth-child(2)").offset().top);
                    $ol.css("top", 0);
                    $(this).remove();
                    //console.log("After shift same element is at: "+$ol.find(":nth-child(1)").offset().top);
                }
            });
            //Append element bottom
            var elBot = $ol.children(".option").last().offset().top + elHeight;
            if ((cntBot - elBot) > spacing) {
                var newId = $ol.children(".option").last().data("option")+1;
                if (newId >= options.length) newId -= options.length;
                var newEl = options[newId];
                $ol.append("<div class='option' data-option='"+newId+"'>"+newEl+"</div>");
            }
        }

        function calcScrollDown() {
            var cntBot = $cnt.offset().top + $cnt.outerHeight();
            var cntTop = $cnt.offset().top;

            $ol.children(".option").each(function() {
                changeOpacity(this);
                //Remove bottom elements
                var elTop = $(this).offset().top;
                if ((cntBot - elTop) <= 0) {
                    //Shift list up
                    //var num = $ol.children().length;
                    //console.log("Befor shift second to last element is at: "+$ol.find(":nth-child("+(num-1)+")").offset().top);
                    $ol.css("bottom", 0);
                    $(this).remove();
                    //console.log("After shift last element is at: "+$ol.children().last().offset().top);
                }
            });
            //Prepend element top
            var elTop = $ol.children(".option").first().offset().top;
            if ((elTop - cntTop) > spacing) {
                var newId = $ol.children(".option").first().data("option")-1;
                if (newId < 0) newId += options.length;
                var newEl = options[newId];
                $ol.prepend("<div class='option' data-option='"+newId+"'>"+newEl+"</div>");
            }
        }

        function changeOpacity(el) {
            var elBot = $(el).offset().top + $(el).outerHeight();
            var cntTop = $cnt.offset().top;
            var diff = elBot - cntTop;
            //console.log($(el).html() + " is " + diff);
            var cntHeight = $cnt.height();
            //console.log(elBot/cntHeight);
        }

        init();

        this.scroll = function(distance) {
            scrollCont(distance);
        };

        return this;
    }

    function E(id) {
        return document.getElementById(id)
    }

    var carousel = new Menu(["Option 1", "Option 2", "Option 3", "Option 4", "Option 5"],
        $("#optsList"), $("#container"));

    var distance = 0;
    var cnt = document.getElementById('container');
    var hammertime = new Hammer(cnt);
    hammertime.get('pan').set({
        direction: Hammer.DIRECTION_ALL
    });
    hammertime.on('panstart', function(ev) {
        distance = 0;
    });
    hammertime.on('pan', function(ev) {
        var deltaY = ev.deltaY - distance;
        distance = ev.deltaY;
        carousel.scroll(deltaY);
    });
    
})(jQuery);