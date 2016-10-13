// 移动端自适应画面
var iScale = 1 / window.devicePixelRatio, lqNo = localStorage.getItem('lqNo'), httpUrl = "http://192.168.110.23:8888/zhgx";
document.write('<meta name="viewport" content="width=device-width,initial-scale=' + iScale + ',minimum-scale=' + iScale + ',maximum-scale=' + iScale + ', user-scalable=0" />');
(function (){ $("html").css('font-size', 100 * document.documentElement.clientWidth / 480 + 'px')})();


function Picker(json){
	this.height = Math.round(parseInt($('html').css('font-size'))* 0.4);
	this.objs = json.objs;
	this.init(json.data, this.objs, this.height);
	this.doEvent(this.height);
	this.num = 0;
	this.callback = json.callback;

}

Picker.prototype = {
	'constructor' : Picker,
	'init': function(Arr, objs, height){
		objs.each(function(index, el) {
			console.log(el)
			el.tagName == 'INPUT'? $(el).attr('readonly', 'readonly'): {};
		});

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
			t.pickerScroll(event, height);
		})
		$('#sure').on('click', function(){
			var text = [],
				objs = t.objs,
				callback = t.callback;
			$('#picker-wrap .selected').each(function(i, obj){
				var value = $(obj).text();
				objs.eq(i).text(value)
				objs.eq(i).val(value)
				text.push(value)
			})

			typeof callback === 'function'? callback(text) : {};
		});
		if (!/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
			$('.picker-scroll ul').on('touchend', function(){
				var that = $(this);
				that.attr('touchend', 'true');
				if(that.attr('scrollend')){
					t.scrollTo(that, t.num, height);
				}
			})
		}
	},

	'pickerScroll': (function(){
		if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
			return function(event, height){
				var t = this,
					that = $(event.target),
					num;

				var scrTop = that.scrollTop();
				num = Math.round(scrTop/height);

				that.off('scroll');
				t.scrollTo(that, num, height, function () {
					that.on('scroll', function(event){
						t.pickerScroll(event, height);
					})
				});
			}
		} else {
			this.timer = null;
			return function(event, height){
				var t = this,
					that = $(event.target),
					x = 0,
					i = 0;

				var scrTop = that.scrollTop();
				that.removeAttr('scrollend');

				x = Math.round(scrTop/height);
				t.num = x == t.num? t.num: x;

				clearTimeout(this.timer);
				this.timer = setTimeout(function(){
					var num = t.num;
					that.attr('scrollend', 'true');
					if(that.attr('touchend')){
						that.off('scroll');
						t.scrollTo(that, num, height, function () {
							that.removeAttr('touchend');
							that.removeAttr('scrollend');
							that.on('scroll', function(event){
								t.pickerScroll(event, height);
							})
						});
					}
				}, 200);
			}
		}
	})(),

	'scrollTo': function(that, num, height, callback){
		var scrTop = that.scrollTop(),
			toTop = num * height,
			speed = (toTop - scrTop) / 5,
			i = 0;

		function move(){
			setTimeout(function(){
				if(i !== 5){
					that.scrollTop(scrTop += speed);
					i++;
					move();
				} else {
					that.children().eq(num + 2).addClass('selected').siblings('.selected').removeClass('selected');

					typeof callback === 'function' && callback();
				}
			}, 20)
		}

		move();
	}
}