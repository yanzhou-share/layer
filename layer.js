var Layer = (function($, undefined){
	var defaults = {
		target : '',
		left : 0,
		top : 0,
		noClear : false,
		blur : true,//when layer blur and the layer is hide
		closeCallback : function(){},//when blur layer hide callback
		tmpl : ''
	}
	
	, __hasProp = {}.hasOwnProperty
	/**extend the child**/
	, __extends = function(child, parent){
		for(var key in parent)	{
			if(__hasProp.call(parent, key))	child[key] = parent[key];
		}
		
		child.__super__ = parent.prototype;
		
		return child;
	}, _winW = $(window).width()
	
	,_winH = $(window).height();
	
	var layer = function(options){
		this._init(options);
	}
	
	layer.prototype = {
		/**
		*initialize the plugin
		*/
		_init : function(options){
			this.options = __extends(defaults, options);
			this.$layer = $(this.options.tmpl);
			this._layerfocus = true;
			this._inputfocus = false;
			this._layerover = true;
			this._addEvents();
		},
		/**
		*register events
		*/
		_addEvents : function(){
			var that = this;
			
			$(this.options.target).on("click", function(){
				that._appendTmpl();
				
				if($.isArray(that.options.exceptHide) && that.options.exceptHide.length > 0){
					for(var i =0, len = that.options.exceptHide.length;i<len;i++){
						(function(node){
							if($(node)[0].nodeName.toUpperCase()==="INPUT" || $(node)[0].nodeName.toUpperCase()==="TEXTAREA")
							{
								$(node).on("focus", function(){
									that._inputfocus = true;
								});
								$(node).on("blur", function(){
									that._inputfocus = false;
									that.$layer.trigger("blur");
								});
							}
						})(that.options.exceptHide[i]);
					}
				}
			});
			
			var timer = true;
			if(this.options.blur){
				this.$layer.on("blur",function(){
					if(timer){
						clearTimeout(timer);
						timer = setTimeout(function(){
							if(!!that.options.closeCallback && $.isFunction(that.options.closeCallback) && !that._inputfocus && !that._layerover){
								that.options.closeCallback();	
							}
						},200);					
					}
				});
			}
			
			this.$layer.on("mouseover", function(){
				that._layerover = true;
			});
			
			this.$layer.on("mouseout", function(){
				that._layerover = false;
			});
		},
		/**
		*position the layer must be set the layer position absolute
		*/
		_position : function(){
			var op = this.options, _target = op.target, _offset = this._getOffset(_target), _targetH = $(_target).outerHeight(),
				
				nodeOffset = {left:_offset.left+op.left + "px", top:_offset.top+op.top+_targetH + "px", position:"absolute"};
			
			return nodeOffset;
		},
		/**
		*get the node offset
		*/
		_getOffset : function(node){
			return $(node).length > 0 ? $(node).offset() : {left:(_winW/2), top:(_winH/2)};
		},
		/**
		*append html to body
		*/
		_appendTmpl : function(){
			this.$layer.css(this._position()).appendTo('body').focus().show();	;
		},
		
		alert : function(){
			alert(3);
		},
		/**
		*hide layer
		*/
		_hide : function(){
			this.$layer.hide();
			this._reset();
		},
		/**
		*show layer
		*/
		_show : function(){
			this.$layer.show().focus();
		},
		/**
		*reset all data
		*/
		_reset : function(){
			if(this.options.noClear)	this.$layer.find('input, textarea').val('');
		},
		/**
		*get values to layer
		*/
		_getValues : function(){
			var nodes = this.$layer.find("input, textarea"), _inputs = {};
			
			for(var i = 0, len = nodes.length; i < len; i++){
				var __node = $(nodes[i]), __nname = !!__node.attr("name") ? __node.attr("name") : __node.attr("id"), __val = __node.val();
				if(!!__node.attr("type")&&__node.attr("type").toUpperCase()==="BUTTON")	continue;
				_inputs[__nname] = __val;
			}
			
			return _inputs;
		}
	}
	
	return layer;
	
})(window.jQuery);
