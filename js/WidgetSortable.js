(function($) {
	
		Object.create = function(o) {
			var makeArgs = arguments 
			function jqueryWdgtSort() {
				for(prop in o) {
					this[prop] = o[prop];
				}
			}
			jqueryWdgtSort.prototype = o
			return new jqueryWdgtSort();
		}
	
		var WidgetConfig = {
			el:'',
			prop: {
			},
			initialize: function(){
				if(this.el.children().length){
                    this.loadControls();
                    this.el.find('.column').css({width: ($(window).width() - 150) / this.el.children('div').length });
                    this.el.find('.widget').width(($(window).width() - 170) / this.el.children('div').length);
                }else{
				    var columnCount = this.prop.col;
                    for(var i = 0; i< columnCount; i++){
					    this.el.append('<div class="column" id="column'+(i+1)+'"></div>');
				    }
				    this.el.find('.column').css({width: ($(window).width() - 150) / this.prop.col });
				    this.loadWidgets();
                }
			},
			loadWidgets: function(){
				var row = this.prop.row;
				this.el.find('.column').each(function(){
					for(var i = 0; i< row; i++){
						$(this).append('<div class="widget" id="widget'+(i+1)+'">'+
							'<div class="header">'+
								'<span>widget'+(i+1)+'</span>'+
							'</div>'+
							'<div class="content">Content'+(i+1)+'</div>'+
						'</div>');
					}
				});
                this.loadControls();
			},
            loadControls: function(){
                this.el.find('.header').append('<span class="wdgtControls"></span>');
                (this.prop.collapse ? this.applyCollapsing() : ''); 
				(this.prop.sortable ?  this.applySorting() : '') ;
				(this.prop.removable ?  this.applyClosing() : '');
                this.prop.enableResize ? this.applyResizing() : '';
            },
			applyResizing: function(){
				this.el.find('.content').resizable({
					minHeight: 50,
					maxHeight: 1000,
				});
			},
			applyCollapsing: function(){
                this.el.find('.wdgtControls').append('<span class="wdgtCollapse">--</span>');
                this.el.find('.wdgtControls .wdgtCollapse').click(function(){
                    $(this).parents('.widget').find('.content').slideToggle();
                });
			},
			applyClosing: function(){
                var self = this;
                this.el.find('.wdgtControls').append('<span class="wdgtRemove">X</span>');
                this.el.find('.wdgtControls .wdgtRemove').click(function(){
                    $(this).parents('.widget').fadeOut(500, function(){
                        $(this).remove();
                        self.emptyness();
                    });
                });
			},
			applySorting: function(){
				var self = this;
                this.el.find('.wdgtControls').append('<span class="wdgtDrag">:::</span>');
				var $columns = this.el.find('.column');
				$columns.sortable({
	                //items: self.el.find('#column2').find('div'),
	                connectWith: $columns,
	                handle: self.prop.handle,
	                placeholder: "widget-placeholder",
	                tolerance: "pointer",
	                dropOnEmpty: true,
	                forcePlaceholderSize: true,
	                revert: 300,
	                delay: 100,
	                opacity: 0.8,
	                /*containment: '',*/
	                scroll: true,
	                scrollSensitivity: 40,
	                start: function (e, ui) {
						//$(ui.helper).css({width: '420px'});
						$(".widget-placeholder").css({ 'border': '1px dashed #000' }).height($(ui.helper).height());  
	                },
	                stop: function (e, ui) {
	                     self.emptyness()
	                }
	            })
			},
            emptyness: function(){
                var $columns = this.el.find('.column');
                $columns.each(function(a, el){
					if($(this).children('div').length === 0){
                        if($(this).children('p').length === 0)
						$(this).append('<p class="widget app-holder" style="border: 1px solid transparent; width: 450px;"></p>');
					}else{
						$(this).find('p.app-holder').remove();
					}
				});
            }
		};
		
	    $.fn.WidgetSortable = function(config) {
			if(!config){ 
				//return;
			}else{
				WidgetConfig.prop = {
					col: config.col || 3,
					row: config.row || 4,
					handle: config.handle || '.wdgtDrag',
					collapse: config.collapse || false,
					sortable: config.sortable || false,
                    removable: config.removable || false,
					enableResize: config.enableResize || false
				};
				WidgetConfig.el = $(this);
				var widgetSort = Object.create(WidgetConfig)
                widgetSort.initialize()
				//WidgetConfig.el.children().length ? widgetSort.loadControls() : widgetSort.initialize();
				return widgetSort;
			}
	    }
})(jQuery);