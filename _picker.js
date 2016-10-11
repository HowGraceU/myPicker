// 移动端自适应画面
var iScale = 1 / window.devicePixelRatio, lqNo = localStorage.getItem('lqNo'), httpUrl = "http://192.168.110.23:8888/zhgx";
document.write('<meta name="viewport" content="width=device-width,initial-scale=' + iScale + ',minimum-scale=' + iScale + ',maximum-scale=' + iScale + ', user-scalable=0" />');
(function (){ $("html").css('font-size', 100 * document.documentElement.clientWidth / 480 + 'px')})();


function Picker(json){
	var height = Math.round(parseInt($('html').css('font-size'))* 0.4);
	this.init(json.data, json.objs, height);
	this.doEvent(height);

	$('#sure').on('touchend', function(){
		var text = [],
			objs = json.objs,
			callback = json.callback;
		$('#picker-wrap .selected').each(function(i, obj){
			var value = $(obj).text();
			objs.eq(i).text(value)
			objs.eq(i).val(value)
			text.push(value)
		})

		typeof callback === 'function'? callback(text) : {};
	})
}

Picker.prototype = {
	'constructor' : Picker,
	'init': function(Arr, objs, height){
		var html = '',
			pos = [];
		for(var i = 0, iLength = Arr.length; i < iLength; i++){
			var obj = Arr[i];
			html += '<div class="picker-scroll" style="width:' + 100/iLength + '%; line-height:' + height + 'px;"><div class="picker-title">' + obj.name + '</div><div class="picker-oh"><ul><li style="height:' + height + 'px;"></li><li style="height:' + height + 'px;"></li>'

			var option = obj.option,
				text = objs.eq(i).text();
			for(var j = 0, jLength = option.length; j < jLength; j++){
				var liClass = '';
				if(objs.eq(i).text() === option[j] || objs.eq(i).val() === option[j]){
					liClass = ' class="selected"';
					pos.push(j)
				}
				html += '<li' + liClass + '>' + option[j] + '</li>'
			}

			html += '<li style="height:' + height + 'px;"></li><li style="height:' + height + 'px;"></li></ul><div class="picker-change"></div></div></div>'
		}

		$('#picker-wrap').html(html);
		$('#picker').show();

		$('.picker-scroll ul').each(function(i, obj){
			$(obj).scrollTop(pos[i] * $('.picker-scroll li').height())
		})
	},

	'doEvent': function(height){
		var t = this;
		$('#picker').on('click', function(){
			$('#picker').hide();
			$('#sure,#picker,.picker-scroll,.picker-scroll ul').off();
		})
		$('.picker-scroll').on('click', function(event){
			event.stopPropagation();
		})
		$('.picker-scroll ul').on('scroll', function(event){
					console.log(2)
			t.pickerScroll(event, height);
		})
	},

	'pickerScroll': function(event, height){
		var t = this,
			that = $(event.target),
			num = 0,
			x = 0,
			i = 0;

		that.on('touchend', function(){
			that.attr('touchend', 'true');
			if(that.attr('scrollend')){
				t.scrollTo(that, num, height);
			}
		})
		that.on('scroll', function(event){
			var scrTop = that.scrollTop();
			that.removeAttr('scrollend');

			x = Math.round(scrTop/height);
			num = x == num? num: x;

			setTimeout(function(){
				var nowTop = that.scrollTop();
				if(scrTop == nowTop){
					that.attr('scrollend', 'true');
					if(that.attr('touchend')){
						t.scrollTo(that, num, height);
					}
				}
			}, 200);
		})
	},

	'scrollTo': function(that, num, height){
		var scrTop = that.scrollTop(),
			toTop = num * height,
			speed = (toTop - scrTop) / 5;

		for(var i = 0; i < 5; i++){
			setTimeout(function(){
				that.scrollTop(scrTop += speed);
			}, i * 20)
		}

		that.children().eq(num + 2).addClass('selected').siblings('.selected').removeClass('selected');

		that.removeAttr('touchend').removeAttr('scrollend');
	}
}