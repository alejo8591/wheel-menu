!function($){
  
  var defaults = {
		trigger: "click",
		animation: "fade",
		angle: [0,360],
		animationSpeed: "medium"
	};
	
	$.fn.centerAround = function (button) {
    var offset = button.offset(),
        width = button.outerWidth(),
        height = button.outerHeight(),
        buttonX = (offset.left - $(document).scrollLeft() ) + width / 2,
        buttonY = (offset.top -  $(document).scrollTop() ) + height / 2,
        objectOffset = this.offset();
    this.css("position","fixed");
    this.css("top", buttonY  - (this.outerHeight() / 2)  + "px");
    this.css("left", buttonX - (this.outerWidth() / 2)   + "px");
    return this;
  };
  
  $.fn.flyIn = function (el, button, width, height, angle, step, radius, settings) {
    var d = 0;
    this.stop(true,true);
    this.each(function(index) {
      angle = (settings.angle[0] + (step * index)) * (Math.PI/180); 
      var x = Math.round(width/2 + radius * Math.cos(angle) - $(this).find("a").outerWidth()/2),
          y = Math.round(height/2 + radius * Math.sin(angle) - $(this).find("a").outerHeight()/2);
      $(this).animateRotate(360).css({
          position: 'absolute',
          opacity: 0,
          left: "50%",
          top: "50%",
          marginLeft: "-" + $(this).outerWidth() / 2,
          marginTop: "-" + $(this).outerHeight() / 2
      }).delay(d).animate({
        opacity:1,
        left: x + 'px',
        top: y + 'px'
      }, settings.animationSpeed[1]);
      d += settings.animationSpeed[0];
    });
  };
  
  $.fn.flyOut = function (el, button) {
    var d = 0;
    this.stop(true,true);
    $(this.get().reverse()).each(function() {
	    $(this).animateRotate(-360).delay(d).animate({
	      opacity:0,
	      left: el.outerWidth() / 2 + "px",
        top: el.outerHeight() / 2 + "px"
	    }, 150);
      d += 15;
	  }).promise().done( function() {
      el.removeClass("active").css("visibility", "hidden").hide();
      button.removeClass("active");
    });
  };
  
  $.fn.fadeInIcon = function (el, button, width, height, angle, step, radius, settings) {
    var d = 0;
    this.stop(true,true);
    this.each(function(index) {
      angle = (settings.angle[0] + (step * index)) * (Math.PI/180); 
      var x = Math.round(width/2 + radius * Math.cos(angle) - $(this).find("a").outerWidth()/2),
          y = Math.round(height/2 + radius * Math.sin(angle) - $(this).find("a").outerHeight()/2);
      $(this).css({
          position: 'absolute',
          left: x + 'px',
          top: y + 'px',
          opacity: 0
      }).delay(d).animate({opacity:1}, settings.animationSpeed[1]);
      
      d += settings.animationSpeed[0];
    });
  };
  
  $.fn.fadeOutIcon = function (el, button) {
    var d = 0;
    this.stop(true,true);
    
    $(this.get().reverse()).each(function() {
	    $(this).delay(d).animate({opacity:0}, 150);
      d += 15;
	  }).promise().done( function() {
      el.removeClass("active").css("visibility", "hidden").hide();
      button.removeClass("active");
    });
  };
	
	$.fn.hideIcon = function (button, settings) {
	  var fields = this.find(".item"),
	      el = this;
	  switch (settings.animation) { 
      case 'fade': 
        fields.fadeOutIcon(el, button);
        break; 
    
      case 'fly': 
        fields.flyOut(el, button);
        break; 
    }
	  
	};
	
	$.fn.showIcon = function (button, settings) {
	  var el = this,
	      zindex = '6';
	  if (settings.trigger == "hover") {
	    var zindex = '3';
    }
	  button.addClass("active").css({
      'z-index': zindex
    });

    el.show().css({
        position: 'absolute',
        'z-index': '5',
        'padding': '30px' // add safe zone for mouseover
    }).centerAround(button);

    el.addClass("wheel active").css("visibility", "visible").show();
	  
	  if (el.attr('data-angle')) {
      settings.angle = el.attr('data-angle');
    }
    
    settings = predefineAngle(settings);
	  var radius = el.width() / 2,
      fields = el.find(".item"),
      container = el,
      width = container.innerWidth(),
      height = container.innerHeight(),
      angle =  0,
      step = (settings.angle[1] - settings.angle[0]) / fields.length;
     
     
      switch (settings.animation) { 
        case 'fade': 
          fields.fadeInIcon(el, button, width, height, angle, step, radius, settings);
          break; 
          
        case 'fly': 
          fields.flyIn(el, button, width, height, angle, step, radius, settings);
          break; 
      }
	};
	
	$.fn.animateRotate = function(angle, duration, easing, complete) {
      return this.each(function() {
          var $elem = $(this);

          $({deg: 0}).animate({deg: angle}, {
              duration: duration,
              easing: easing,
              step: function(now) {
                  $elem.css({
                      transform: 'rotate(' + now + 'deg)'
                  });
              },
              complete: complete || $.noop
          });
      });
    };
  
	
	function predefineAngle (settings) {
	  var convert = false;
	  if ($.type(settings.angle) === 'string') {
	    try {
            if(eval(settings.angle).length > 1) convert = true;
        }
        catch(err) {
            convert = false;
        }
	    if (convert === true) {
	      settings.angle = JSON.parse(settings.angle);
	    } else {
	      switch (settings.angle) { 
              case 'N':
            settings.angle = [180,380];
            break;
              case 'NE':
            settings.angle = [270,380];
            break;
              case 'E':
            settings.angle = [270,470];
            break;
              case 'SE':
            settings.angle = [360,470];
            break;
              case 'S':
            settings.angle = [360,560];
            break;
              case 'SW':
            settings.angle = [90,200];
            break;
              case 'W':
            settings.angle = [90,290];
            break;
          case 'NW':
            settings.angle = [180,290];
            break;
          case 'all':
            settings.angle = [0,360];
            break;
        }
	    } 
    }
    return settings;
	}
	
	function predefineSpeed(settings) {
	  if ($.type(settings.animationSpeed) == "string") { 
          switch (settings.animationSpeed) {
            case 'slow':
              settings.animationSpeed = [75,700];
              break;
            case 'medium':
              settings.animationSpeed = [50,500];
              break;
            case 'fast':
              settings.animationSpeed = [25,250];
              break;
            case 'instant':
              settings.animationSpeed = [0,0];
              break;
          }
    }
    return settings;
	}
  
  $.fn.wheelmenu = function(options){
    var settings = $.extend({}, defaults, options);
    
    settings = predefineSpeed(settings);
    
    return this.each(function(){
      var button = $(this);
      var el = $($(this).attr("href"));
      el.addClass("wheel");
      
      button.css("opacity", 0).animate({
        opacity: 1
      });

      if (settings.trigger == "hover") {

        button.bind({
          mouseenter: function() {
            el.showIcon(button, settings);
          }
        });
        
        el.bind({
          mouseleave: function() {
            el.hideIcon(button, settings);
          }
        });
        
      } else {
        button.click( function() {
          if (el.css('visibility') == "visible") {
            el.hideIcon(button, settings);
          } else {
            el.showIcon(button, settings);
          }
        });
      }
    });
  };
  
}(window.jQuery);



//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpxdWVyeS53aGVlbG1lbnUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJqcXVlcnkud2hlZWxtZW51LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIWZ1bmN0aW9uKCQpe1xuICBcbiAgdmFyIGRlZmF1bHRzID0ge1xuXHRcdHRyaWdnZXI6IFwiY2xpY2tcIixcblx0XHRhbmltYXRpb246IFwiZmFkZVwiLFxuXHRcdGFuZ2xlOiBbMCwzNjBdLFxuXHRcdGFuaW1hdGlvblNwZWVkOiBcIm1lZGl1bVwiXG5cdH07XG5cdFxuXHQkLmZuLmNlbnRlckFyb3VuZCA9IGZ1bmN0aW9uIChidXR0b24pIHtcbiAgICB2YXIgb2Zmc2V0ID0gYnV0dG9uLm9mZnNldCgpLFxuICAgICAgICB3aWR0aCA9IGJ1dHRvbi5vdXRlcldpZHRoKCksXG4gICAgICAgIGhlaWdodCA9IGJ1dHRvbi5vdXRlckhlaWdodCgpLFxuICAgICAgICBidXR0b25YID0gKG9mZnNldC5sZWZ0IC0gJChkb2N1bWVudCkuc2Nyb2xsTGVmdCgpICkgKyB3aWR0aCAvIDIsXG4gICAgICAgIGJ1dHRvblkgPSAob2Zmc2V0LnRvcCAtICAkKGRvY3VtZW50KS5zY3JvbGxUb3AoKSApICsgaGVpZ2h0IC8gMixcbiAgICAgICAgb2JqZWN0T2Zmc2V0ID0gdGhpcy5vZmZzZXQoKTtcbiAgICB0aGlzLmNzcyhcInBvc2l0aW9uXCIsXCJmaXhlZFwiKTtcbiAgICB0aGlzLmNzcyhcInRvcFwiLCBidXR0b25ZICAtICh0aGlzLm91dGVySGVpZ2h0KCkgLyAyKSAgKyBcInB4XCIpO1xuICAgIHRoaXMuY3NzKFwibGVmdFwiLCBidXR0b25YIC0gKHRoaXMub3V0ZXJXaWR0aCgpIC8gMikgICArIFwicHhcIik7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIFxuICAkLmZuLmZseUluID0gZnVuY3Rpb24gKGVsLCBidXR0b24sIHdpZHRoLCBoZWlnaHQsIGFuZ2xlLCBzdGVwLCByYWRpdXMsIHNldHRpbmdzKSB7XG4gICAgdmFyIGQgPSAwO1xuICAgIHRoaXMuc3RvcCh0cnVlLHRydWUpO1xuICAgIHRoaXMuZWFjaChmdW5jdGlvbihpbmRleCkge1xuICAgICAgYW5nbGUgPSAoc2V0dGluZ3MuYW5nbGVbMF0gKyAoc3RlcCAqIGluZGV4KSkgKiAoTWF0aC5QSS8xODApOyBcbiAgICAgIHZhciB4ID0gTWF0aC5yb3VuZCh3aWR0aC8yICsgcmFkaXVzICogTWF0aC5jb3MoYW5nbGUpIC0gJCh0aGlzKS5maW5kKFwiYVwiKS5vdXRlcldpZHRoKCkvMiksXG4gICAgICAgICAgeSA9IE1hdGgucm91bmQoaGVpZ2h0LzIgKyByYWRpdXMgKiBNYXRoLnNpbihhbmdsZSkgLSAkKHRoaXMpLmZpbmQoXCJhXCIpLm91dGVySGVpZ2h0KCkvMik7XG4gICAgICAkKHRoaXMpLmFuaW1hdGVSb3RhdGUoMzYwKS5jc3Moe1xuICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgIG9wYWNpdHk6IDAsXG4gICAgICAgICAgbGVmdDogXCI1MCVcIixcbiAgICAgICAgICB0b3A6IFwiNTAlXCIsXG4gICAgICAgICAgbWFyZ2luTGVmdDogXCItXCIgKyAkKHRoaXMpLm91dGVyV2lkdGgoKSAvIDIsXG4gICAgICAgICAgbWFyZ2luVG9wOiBcIi1cIiArICQodGhpcykub3V0ZXJIZWlnaHQoKSAvIDJcbiAgICAgIH0pLmRlbGF5KGQpLmFuaW1hdGUoe1xuICAgICAgICBvcGFjaXR5OjEsXG4gICAgICAgIGxlZnQ6IHggKyAncHgnLFxuICAgICAgICB0b3A6IHkgKyAncHgnXG4gICAgICB9LCBzZXR0aW5ncy5hbmltYXRpb25TcGVlZFsxXSk7XG4gICAgICBkICs9IHNldHRpbmdzLmFuaW1hdGlvblNwZWVkWzBdO1xuICAgIH0pO1xuICB9O1xuICBcbiAgJC5mbi5mbHlPdXQgPSBmdW5jdGlvbiAoZWwsIGJ1dHRvbikge1xuICAgIHZhciBkID0gMDtcbiAgICB0aGlzLnN0b3AodHJ1ZSx0cnVlKTtcbiAgICAkKHRoaXMuZ2V0KCkucmV2ZXJzZSgpKS5lYWNoKGZ1bmN0aW9uKCkge1xuXHQgICAgJCh0aGlzKS5hbmltYXRlUm90YXRlKC0zNjApLmRlbGF5KGQpLmFuaW1hdGUoe1xuXHQgICAgICBvcGFjaXR5OjAsXG5cdCAgICAgIGxlZnQ6IGVsLm91dGVyV2lkdGgoKSAvIDIgKyBcInB4XCIsXG4gICAgICAgIHRvcDogZWwub3V0ZXJIZWlnaHQoKSAvIDIgKyBcInB4XCJcblx0ICAgIH0sIDE1MCk7XG4gICAgICBkICs9IDE1O1xuXHQgIH0pLnByb21pc2UoKS5kb25lKCBmdW5jdGlvbigpIHtcbiAgICAgIGVsLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpLmNzcyhcInZpc2liaWxpdHlcIiwgXCJoaWRkZW5cIikuaGlkZSgpO1xuICAgICAgYnV0dG9uLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xuICAgIH0pO1xuICB9O1xuICBcbiAgJC5mbi5mYWRlSW5JY29uID0gZnVuY3Rpb24gKGVsLCBidXR0b24sIHdpZHRoLCBoZWlnaHQsIGFuZ2xlLCBzdGVwLCByYWRpdXMsIHNldHRpbmdzKSB7XG4gICAgdmFyIGQgPSAwO1xuICAgIHRoaXMuc3RvcCh0cnVlLHRydWUpO1xuICAgIHRoaXMuZWFjaChmdW5jdGlvbihpbmRleCkge1xuICAgICAgYW5nbGUgPSAoc2V0dGluZ3MuYW5nbGVbMF0gKyAoc3RlcCAqIGluZGV4KSkgKiAoTWF0aC5QSS8xODApOyBcbiAgICAgIHZhciB4ID0gTWF0aC5yb3VuZCh3aWR0aC8yICsgcmFkaXVzICogTWF0aC5jb3MoYW5nbGUpIC0gJCh0aGlzKS5maW5kKFwiYVwiKS5vdXRlcldpZHRoKCkvMiksXG4gICAgICAgICAgeSA9IE1hdGgucm91bmQoaGVpZ2h0LzIgKyByYWRpdXMgKiBNYXRoLnNpbihhbmdsZSkgLSAkKHRoaXMpLmZpbmQoXCJhXCIpLm91dGVySGVpZ2h0KCkvMik7XG4gICAgICAkKHRoaXMpLmNzcyh7XG4gICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgbGVmdDogeCArICdweCcsXG4gICAgICAgICAgdG9wOiB5ICsgJ3B4JyxcbiAgICAgICAgICBvcGFjaXR5OiAwXG4gICAgICB9KS5kZWxheShkKS5hbmltYXRlKHtvcGFjaXR5OjF9LCBzZXR0aW5ncy5hbmltYXRpb25TcGVlZFsxXSk7XG4gICAgICBcbiAgICAgIGQgKz0gc2V0dGluZ3MuYW5pbWF0aW9uU3BlZWRbMF07XG4gICAgfSk7XG4gIH07XG4gIFxuICAkLmZuLmZhZGVPdXRJY29uID0gZnVuY3Rpb24gKGVsLCBidXR0b24pIHtcbiAgICB2YXIgZCA9IDA7XG4gICAgdGhpcy5zdG9wKHRydWUsdHJ1ZSk7XG4gICAgXG4gICAgJCh0aGlzLmdldCgpLnJldmVyc2UoKSkuZWFjaChmdW5jdGlvbigpIHtcblx0ICAgICQodGhpcykuZGVsYXkoZCkuYW5pbWF0ZSh7b3BhY2l0eTowfSwgMTUwKTtcbiAgICAgIGQgKz0gMTU7XG5cdCAgfSkucHJvbWlzZSgpLmRvbmUoIGZ1bmN0aW9uKCkge1xuICAgICAgZWwucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIikuY3NzKFwidmlzaWJpbGl0eVwiLCBcImhpZGRlblwiKS5oaWRlKCk7XG4gICAgICBidXR0b24ucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgfSk7XG4gIH07XG5cdFxuXHQkLmZuLmhpZGVJY29uID0gZnVuY3Rpb24gKGJ1dHRvbiwgc2V0dGluZ3MpIHtcblx0ICB2YXIgZmllbGRzID0gdGhpcy5maW5kKFwiLml0ZW1cIiksXG5cdCAgICAgIGVsID0gdGhpcztcblx0ICBzd2l0Y2ggKHNldHRpbmdzLmFuaW1hdGlvbikgeyBcbiAgICAgIGNhc2UgJ2ZhZGUnOiBcbiAgICAgICAgZmllbGRzLmZhZGVPdXRJY29uKGVsLCBidXR0b24pO1xuICAgICAgICBicmVhazsgXG4gICAgXG4gICAgICBjYXNlICdmbHknOiBcbiAgICAgICAgZmllbGRzLmZseU91dChlbCwgYnV0dG9uKTtcbiAgICAgICAgYnJlYWs7IFxuICAgIH1cblx0ICBcblx0fTtcblx0XG5cdCQuZm4uc2hvd0ljb24gPSBmdW5jdGlvbiAoYnV0dG9uLCBzZXR0aW5ncykge1xuXHQgIHZhciBlbCA9IHRoaXMsXG5cdCAgICAgIHppbmRleCA9ICc2Jztcblx0ICBpZiAoc2V0dGluZ3MudHJpZ2dlciA9PSBcImhvdmVyXCIpIHtcblx0ICAgIHZhciB6aW5kZXggPSAnMyc7XG4gICAgfVxuXHQgIGJ1dHRvbi5hZGRDbGFzcyhcImFjdGl2ZVwiKS5jc3Moe1xuICAgICAgJ3otaW5kZXgnOiB6aW5kZXhcbiAgICB9KTtcblxuICAgIGVsLnNob3coKS5jc3Moe1xuICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgJ3otaW5kZXgnOiAnNScsXG4gICAgICAgICdwYWRkaW5nJzogJzMwcHgnIC8vIGFkZCBzYWZlIHpvbmUgZm9yIG1vdXNlb3ZlclxuICAgIH0pLmNlbnRlckFyb3VuZChidXR0b24pO1xuXG4gICAgZWwuYWRkQ2xhc3MoXCJ3aGVlbCBhY3RpdmVcIikuY3NzKFwidmlzaWJpbGl0eVwiLCBcInZpc2libGVcIikuc2hvdygpO1xuXHQgIFxuXHQgIGlmIChlbC5hdHRyKCdkYXRhLWFuZ2xlJykpIHtcbiAgICAgIHNldHRpbmdzLmFuZ2xlID0gZWwuYXR0cignZGF0YS1hbmdsZScpO1xuICAgIH1cbiAgICBcbiAgICBzZXR0aW5ncyA9IHByZWRlZmluZUFuZ2xlKHNldHRpbmdzKTtcblx0ICB2YXIgcmFkaXVzID0gZWwud2lkdGgoKSAvIDIsXG4gICAgICBmaWVsZHMgPSBlbC5maW5kKFwiLml0ZW1cIiksXG4gICAgICBjb250YWluZXIgPSBlbCxcbiAgICAgIHdpZHRoID0gY29udGFpbmVyLmlubmVyV2lkdGgoKSxcbiAgICAgIGhlaWdodCA9IGNvbnRhaW5lci5pbm5lckhlaWdodCgpLFxuICAgICAgYW5nbGUgPSAgMCxcbiAgICAgIHN0ZXAgPSAoc2V0dGluZ3MuYW5nbGVbMV0gLSBzZXR0aW5ncy5hbmdsZVswXSkgLyBmaWVsZHMubGVuZ3RoO1xuICAgICBcbiAgICAgXG4gICAgICBzd2l0Y2ggKHNldHRpbmdzLmFuaW1hdGlvbikgeyBcbiAgICAgICAgY2FzZSAnZmFkZSc6IFxuICAgICAgICAgIGZpZWxkcy5mYWRlSW5JY29uKGVsLCBidXR0b24sIHdpZHRoLCBoZWlnaHQsIGFuZ2xlLCBzdGVwLCByYWRpdXMsIHNldHRpbmdzKTtcbiAgICAgICAgICBicmVhazsgXG4gICAgICAgICAgXG4gICAgICAgIGNhc2UgJ2ZseSc6IFxuICAgICAgICAgIGZpZWxkcy5mbHlJbihlbCwgYnV0dG9uLCB3aWR0aCwgaGVpZ2h0LCBhbmdsZSwgc3RlcCwgcmFkaXVzLCBzZXR0aW5ncyk7XG4gICAgICAgICAgYnJlYWs7IFxuICAgICAgfVxuXHR9O1xuXHRcblx0JC5mbi5hbmltYXRlUm90YXRlID0gZnVuY3Rpb24oYW5nbGUsIGR1cmF0aW9uLCBlYXNpbmcsIGNvbXBsZXRlKSB7XG4gICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciAkZWxlbSA9ICQodGhpcyk7XG5cbiAgICAgICAgICAkKHtkZWc6IDB9KS5hbmltYXRlKHtkZWc6IGFuZ2xlfSwge1xuICAgICAgICAgICAgICBkdXJhdGlvbjogZHVyYXRpb24sXG4gICAgICAgICAgICAgIGVhc2luZzogZWFzaW5nLFxuICAgICAgICAgICAgICBzdGVwOiBmdW5jdGlvbihub3cpIHtcbiAgICAgICAgICAgICAgICAgICRlbGVtLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtOiAncm90YXRlKCcgKyBub3cgKyAnZGVnKSdcbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBjb21wbGV0ZTogY29tcGxldGUgfHwgJC5ub29wXG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9O1xuICBcblx0XG5cdGZ1bmN0aW9uIHByZWRlZmluZUFuZ2xlIChzZXR0aW5ncykge1xuXHQgIHZhciBjb252ZXJ0ID0gZmFsc2U7XG5cdCAgaWYgKCQudHlwZShzZXR0aW5ncy5hbmdsZSkgPT09ICdzdHJpbmcnKSB7XG5cdCAgICB0cnkge1xuICAgICAgICAgICAgaWYoZXZhbChzZXR0aW5ncy5hbmdsZSkubGVuZ3RoID4gMSkgY29udmVydCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2goZXJyKSB7XG4gICAgICAgICAgICBjb252ZXJ0ID0gZmFsc2U7XG4gICAgICAgIH1cblx0ICAgIGlmIChjb252ZXJ0ID09PSB0cnVlKSB7XG5cdCAgICAgIHNldHRpbmdzLmFuZ2xlID0gSlNPTi5wYXJzZShzZXR0aW5ncy5hbmdsZSk7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICBzd2l0Y2ggKHNldHRpbmdzLmFuZ2xlKSB7IFxuICAgICAgICAgICAgICBjYXNlICdOJzpcbiAgICAgICAgICAgIHNldHRpbmdzLmFuZ2xlID0gWzE4MCwzODBdO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgJ05FJzpcbiAgICAgICAgICAgIHNldHRpbmdzLmFuZ2xlID0gWzI3MCwzODBdO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgJ0UnOlxuICAgICAgICAgICAgc2V0dGluZ3MuYW5nbGUgPSBbMjcwLDQ3MF07XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgY2FzZSAnU0UnOlxuICAgICAgICAgICAgc2V0dGluZ3MuYW5nbGUgPSBbMzYwLDQ3MF07XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgY2FzZSAnUyc6XG4gICAgICAgICAgICBzZXR0aW5ncy5hbmdsZSA9IFszNjAsNTYwXTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBjYXNlICdTVyc6XG4gICAgICAgICAgICBzZXR0aW5ncy5hbmdsZSA9IFs5MCwyMDBdO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgJ1cnOlxuICAgICAgICAgICAgc2V0dGluZ3MuYW5nbGUgPSBbOTAsMjkwXTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ05XJzpcbiAgICAgICAgICAgIHNldHRpbmdzLmFuZ2xlID0gWzE4MCwyOTBdO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnYWxsJzpcbiAgICAgICAgICAgIHNldHRpbmdzLmFuZ2xlID0gWzAsMzYwXTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cdCAgICB9IFxuICAgIH1cbiAgICByZXR1cm4gc2V0dGluZ3M7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIHByZWRlZmluZVNwZWVkKHNldHRpbmdzKSB7XG5cdCAgaWYgKCQudHlwZShzZXR0aW5ncy5hbmltYXRpb25TcGVlZCkgPT0gXCJzdHJpbmdcIikgeyBcbiAgICAgICAgICBzd2l0Y2ggKHNldHRpbmdzLmFuaW1hdGlvblNwZWVkKSB7XG4gICAgICAgICAgICBjYXNlICdzbG93JzpcbiAgICAgICAgICAgICAgc2V0dGluZ3MuYW5pbWF0aW9uU3BlZWQgPSBbNzUsNzAwXTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdtZWRpdW0nOlxuICAgICAgICAgICAgICBzZXR0aW5ncy5hbmltYXRpb25TcGVlZCA9IFs1MCw1MDBdO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2Zhc3QnOlxuICAgICAgICAgICAgICBzZXR0aW5ncy5hbmltYXRpb25TcGVlZCA9IFsyNSwyNTBdO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2luc3RhbnQnOlxuICAgICAgICAgICAgICBzZXR0aW5ncy5hbmltYXRpb25TcGVlZCA9IFswLDBdO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzZXR0aW5ncztcblx0fVxuICBcbiAgJC5mbi53aGVlbG1lbnUgPSBmdW5jdGlvbihvcHRpb25zKXtcbiAgICB2YXIgc2V0dGluZ3MgPSAkLmV4dGVuZCh7fSwgZGVmYXVsdHMsIG9wdGlvbnMpO1xuICAgIFxuICAgIHNldHRpbmdzID0gcHJlZGVmaW5lU3BlZWQoc2V0dGluZ3MpO1xuICAgIFxuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgIHZhciBidXR0b24gPSAkKHRoaXMpO1xuICAgICAgdmFyIGVsID0gJCgkKHRoaXMpLmF0dHIoXCJocmVmXCIpKTtcbiAgICAgIGVsLmFkZENsYXNzKFwid2hlZWxcIik7XG4gICAgICBcbiAgICAgIGJ1dHRvbi5jc3MoXCJvcGFjaXR5XCIsIDApLmFuaW1hdGUoe1xuICAgICAgICBvcGFjaXR5OiAxXG4gICAgICB9KTtcblxuICAgICAgaWYgKHNldHRpbmdzLnRyaWdnZXIgPT0gXCJob3ZlclwiKSB7XG5cbiAgICAgICAgYnV0dG9uLmJpbmQoe1xuICAgICAgICAgIG1vdXNlZW50ZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZWwuc2hvd0ljb24oYnV0dG9uLCBzZXR0aW5ncyk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIGVsLmJpbmQoe1xuICAgICAgICAgIG1vdXNlbGVhdmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZWwuaGlkZUljb24oYnV0dG9uLCBzZXR0aW5ncyk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBidXR0b24uY2xpY2soIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmIChlbC5jc3MoJ3Zpc2liaWxpdHknKSA9PSBcInZpc2libGVcIikge1xuICAgICAgICAgICAgZWwuaGlkZUljb24oYnV0dG9uLCBzZXR0aW5ncyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVsLnNob3dJY29uKGJ1dHRvbiwgc2V0dGluZ3MpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG4gIFxufSh3aW5kb3cualF1ZXJ5KTtcblxuXG4iXX0=
