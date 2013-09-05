(function() {
  var $, animationEndSupport, vex;
  $ = jQuery;
  animationEndSupport = false;
  $(function() {
    var s;
    s = (document.body || document.documentElement).style;
    return animationEndSupport = s.animation !== void 0 || s.WebkitAnimation !== void 0 || s.MozAnimation !== void 0 || s.MsAnimation !== void 0 || s.OAnimation !== void 0;
  });
  vex = {
    globalID: 1,
    animationEndEvent: 'animationend webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend',
    baseClassNames: {
      content: 'vex-content',
      overlay: 'vex-overlay',
      close: 'vex-close',
      closing: 'vex-closing'
    },
    defaultOptions: {
      content: '',
      showCloseButton: true,
      overlayClosesOnClick: true,
      appendLocation: 'body',
      className: '',
      css: {},
      overlayClassName: '',
      overlayCSS: {},
      closeClassName: '',
      closeCSS: {}
    },
    open: function(options) {
      options = $.extend({}, vex.defaultOptions, options);
      options.id = vex.globalID;
      vex.globalID += 1;
      options.$vexOverlay = $('<div>').addClass(vex.baseClassNames.overlay).addClass(options.overlayClassName).css(options.overlayCSS).data({
        vex: options
      });
      if (options.overlayClosesOnClick) {
        options.$vexOverlay.bind('click.vex', function(e) {
          if (e.target !== this) {
            return;
          }
          return vex.close($(this).data().vex.id);
        });
      }
      options.$vexContent = $('<div>').addClass(vex.baseClassNames.content).addClass(options.className).css(options.css).append(options.content).data({
        vex: options
      });
      options.$vexOverlay.append(options.$vexContent);
      if (options.showCloseButton) {
        options.$closeButton = $('<div>').addClass(vex.baseClassNames.close).addClass(options.closeClassName).css(options.closeCSS).data({
          vex: options
        }).bind('click.vex', function() {
          return vex.close($(this).data().vex.id);
        });
        options.$vexContent.append(options.$closeButton);
      }
      $(options.appendLocation).append(options.$vexOverlay);
      if (options.afterOpen) {
        options.afterOpen(options.$vexContent, options);
      }
      setTimeout((function() {
        return options.$vexContent.trigger('vexOpen', options);
      }), 0);
      return options.$vexContent;
    },
    getAllVexes: function() {
      return $("." + vex.baseClassNames.overlay + ":not(\"." + vex.baseClassNames.closing + "\") ." + vex.baseClassNames.content);
    },
    getVexByID: function(id) {
      return vex.getAllVexes().filter(function() {
        return $(this).data().vex.id === id;
      });
    },
    close: function(id) {
      var $lastVexContent;
      if (!id) {
        $lastVexContent = vex.getAllVexes().last();
        if (!$lastVexContent.length) {
          return false;
        }
        id = $lastVexContent.data().vex.id;
      }
      return vex.closeByID(id);
    },
    closeAll: function() {
      var ids;
      ids = vex.getAllVexes().map(function() {
        return $(this).data().vex.id;
      });
      if (!(ids && ids.length)) {
        return false;
      }
      $.each(ids.reverse(), function(index, id) {
        return vex.closeByID(id);
      });
      return true;
    },
    closeByID: function(id) {
      var $vexContent, $vexOverlay, beforeClose, close, options;
      $vexContent = vex.getVexByID(id);
      if (!$vexContent.length) {
        return;
      }
      $vexOverlay = $vexContent.data().vex.$vexOverlay;
      options = $.extend({}, $vexContent.data().vex);
      beforeClose = function() {
        if (options.beforeClose) {
          return options.beforeClose($vexContent, options);
        }
      };
      close = function() {
        $vexContent.trigger('vexClose', options);
        $vexOverlay.remove();
        if (options.afterClose) {
          return options.afterClose($vexContent, options);
        }
      };
      if (animationEndSupport) {
        beforeClose();
        $vexOverlay.unbind(vex.animationEndEvent).bind(vex.animationEndEvent, function() {
          return close();
        }).addClass(vex.baseClassNames.closing);
      } else {
        beforeClose();
        close();
      }
      return true;
    },
    hideLoading: function() {
      return $('.vex-loading-spinner').remove();
    },
    showLoading: function() {
      vex.hideLoading();
      return $('body').append('<div class="vex-loading-spinner"></div>');
    }
  };
  window.vex = vex;
}).call(this);
