/* ========================================================================
 * Bootstrap: affix.js v3.3.7
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)

    this.$target = $(this.options.target)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element     = $(element)
    this.affixed      = null
    this.unpin        = null
    this.pinnedOffset = null

    this.checkPosition()
  }

  Affix.VERSION  = '3.3.7'

  Affix.RESET    = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  }

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop    = this.$target.scrollTop()
    var position     = this.$element.offset()
    var targetHeight = this.$target.height()

    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false

    if (this.affixed == 'bottom') {
      if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
      return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
    }

    var initializing   = this.affixed == null
    var colliderTop    = initializing ? scrollTop : position.top
    var colliderHeight = initializing ? targetHeight : height

    if (offsetTop != null && scrollTop <= offsetTop) return 'top'
    if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'

    return false
  }

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset
    this.$element.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.$target.scrollTop()
    var position  = this.$element.offset()
    return (this.pinnedOffset = position.top - scrollTop)
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var height       = this.$element.height()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom
    var scrollHeight = Math.max($(document).height(), $(document.body).height())

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)

    if (this.affixed != affix) {
      if (this.unpin != null) this.$element.css('top', '')

      var affixType = 'affix' + (affix ? '-' + affix : '')
      var e         = $.Event(affixType + '.bs.affix')

      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      this.affixed = affix
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

      this.$element
        .removeClass(Affix.RESET)
        .addClass(affixType)
        .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
    }

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - height - offsetBottom
      })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.affix

  $.fn.affix             = Plugin
  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
      if (data.offsetTop    != null) data.offset.top    = data.offsetTop

      Plugin.call($spy, data)
    })
  })

}(jQuery);
;
/* ========================================================================
 * Bootstrap: alert.js v3.1.1
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.hasClass('alert') ? $this : $this.parent()
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent.trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one($.support.transition.end, removeElement)
        .emulateTransitionEnd(150) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  var old = $.fn.alert

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);
;
/* ========================================================================
 * Bootstrap: button.js v3.1.1
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element  = $(element)
    this.options   = $.extend({}, Button.DEFAULTS, options)
    this.isLoading = false
  }

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state = state + 'Text'

    if (!data.resetText) $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      if (state == 'loadingText') {
        this.isLoading = true
        $el.addClass(d).attr(d, d)
      } else if (this.isLoading) {
        this.isLoading = false
        $el.removeClass(d).removeAttr(d)
      }
    }, this), 0)
  }

  Button.prototype.toggle = function () {
    var changed = true
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked') && this.$element.hasClass('active')) changed = false
        else $parent.find('.active').removeClass('active')
      }
      if (changed) $input.prop('checked', !this.$element.hasClass('active')).trigger('change')
    }

    if (changed) this.$element.toggleClass('active')
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  var old = $.fn.button

  $.fn.button = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document).on('click.bs.button.data-api', '[data-toggle^=button]', function (e) {
    var $btn = $(e.target)
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
    $btn.button('toggle')
    e.preventDefault()
  })

}(jQuery);
;
/* ========================================================================
 * Bootstrap: carousel.js v3.1.1
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      =
    this.sliding     =
    this.interval    =
    this.$active     =
    this.$items      = null

    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true
  }

  Carousel.prototype.cycle =  function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getActiveIndex = function () {
    this.$active = this.$element.find('.item.active')
    this.$items  = this.$active.parent().children()

    return this.$items.index(this.$active)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getActiveIndex()

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) })
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || $active[type]()
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var fallback  = type == 'next' ? 'first' : 'last'
    var that      = this

    if (!$next.length) {
      if (!this.options.wrap) return
      $next = this.$element.find('.item')[fallback]()
    }

    if ($next.hasClass('active')) return this.sliding = false

    var e = $.Event('slide.bs.carousel', { relatedTarget: $next[0], direction: direction })
    this.$element.trigger(e)
    if (e.isDefaultPrevented()) return

    this.sliding = true

    isCycling && this.pause()

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      this.$element.one('slid.bs.carousel', function () {
        var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
        $nextIndicator && $nextIndicator.addClass('active')
      })
    }

    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid.bs.carousel') }, 0)
        })
        .emulateTransitionEnd($active.css('transition-duration').slice(0, -1) * 1000)
    } else {
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger('slid.bs.carousel')
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  var old = $.fn.carousel

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  $(document).on('click.bs.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this   = $(this), href
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    $target.carousel(options)

    if (slideIndex = $this.attr('data-slide-to')) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  })

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      $carousel.carousel($carousel.data())
    })
  })

}(jQuery);
;
/* ========================================================================
 * Bootstrap: collapse.js v3.1.1
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.transitioning = null

    if (this.options.parent) this.$parent = $(this.options.parent)
    if (this.options.toggle) this.toggle()
  }

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var actives = this.$parent && this.$parent.find('> .panel > .in')

    if (actives && actives.length) {
      var hasData = actives.data('bs.collapse')
      if (hasData && hasData.transitioning) return
      actives.collapse('hide')
      hasData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')
      [dimension](0)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')
        [dimension]('auto')
      this.transitioning = 0
      this.$element.trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
      [dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element
      [dimension](this.$element[dimension]())
      [0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse')
      .removeClass('in')

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .trigger('hidden.bs.collapse')
        .removeClass('collapsing')
        .addClass('collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  var old = $.fn.collapse

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && option == 'show') option = !option
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle=collapse]', function (e) {
    var $this   = $(this), href
    var target  = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
    var $target = $(target)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()
    var parent  = $this.attr('data-parent')
    var $parent = parent && $(parent)

    if (!data || !data.transitioning) {
      if ($parent) $parent.find('[data-toggle=collapse][data-parent="' + parent + '"]').not($this).addClass('collapsed')
      $this[$target.hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
    }

    $target.collapse(option)
  })

}(jQuery);
;
/* ========================================================================
 * Bootstrap: dropdown.js v3.1.1
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle=dropdown]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown', relatedTarget)

      $this.focus()
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27)/.test(e.keyCode)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive || (isActive && e.keyCode == 27)) {
      if (e.which == 27) $parent.find(toggle).focus()
      return $this.click()
    }

    var desc = ' li:not(.divider):visible a'
    var $items = $parent.find('[role=menu]' + desc + ', [role=listbox]' + desc)

    if (!$items.length) return

    var index = $items.index($items.filter(':focus'))

    if (e.keyCode == 38 && index > 0)                 index--                        // up
    if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
    if (!~index)                                      index = 0

    $items.eq(index).focus()
  }

  function clearMenus(e) {
    $(backdrop).remove()
    $(toggle).each(function () {
      var $parent = getParent($(this))
      var relatedTarget = { relatedTarget: this }
      if (!$parent.hasClass('open')) return
      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))
      if (e.isDefaultPrevented()) return
      $parent.removeClass('open').trigger('hidden.bs.dropdown', relatedTarget)
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  var old = $.fn.dropdown

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle + ', [role=menu], [role=listbox]', Dropdown.prototype.keydown)

}(jQuery);
;
/* ========================================================================
 * Bootstrap: modal.js v3.1.1
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options   = options
    this.$element  = $(element)
    this.$backdrop =
    this.isShown   = null

    if (this.options.remote) {
      this.$element
        .find('.modal-content')
        .load(this.options.remote, $.proxy(function () {
          this.$element.trigger('loaded.bs.modal')
        }, this))
    }
  }

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.escape()

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(document.body) // don't move modals dom position
      }

      that.$element
        .show()
        .scrollTop(0)

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element
        .addClass('in')
        .attr('aria-hidden', false)

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$element.find('.modal-dialog') // wait for modal to slide in
          .one($.support.transition.end, function () {
            that.$element.focus().trigger(e)
          })
          .emulateTransitionEnd(300) :
        that.$element.focus().trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .attr('aria-hidden', true)
      .off('click.dismiss.bs.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one($.support.transition.end, $.proxy(this.hideModal, this))
        .emulateTransitionEnd(300) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.focus()
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keyup.dismiss.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.removeBackdrop()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .appendTo(document.body)

      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus.call(this.$element[0])
          : this.hide.call(this)
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      $.support.transition && this.$element.hasClass('fade') ?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (callback) {
      callback()
    }
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  var old = $.fn.modal

  $.fn.modal = function (option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
    var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    if ($this.is('a')) e.preventDefault()

    $target
      .modal(option, this)
      .one('hide', function () {
        $this.is(':visible') && $this.focus()
      })
  })

  $(document)
    .on('show.bs.modal', '.modal', function () { $(document.body).addClass('modal-open') })
    .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(jQuery);
;
/* ========================================================================
 * Bootstrap: tooltip.js v3.1.1
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       =
    this.options    =
    this.enabled    =
    this.timeout    =
    this.hoverState =
    this.$element   = null

    this.init('tooltip', element, options)
  }

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled  = true
    this.type     = type
    this.$element = $(element)
    this.options  = this.getOptions(options)

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return
      var that = this;

      var $tip = this.tip()

      this.setContent()

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var $parent = this.$element.parent()

        var orgPlacement = placement
        var docScroll    = document.documentElement.scrollTop || document.body.scrollTop
        var parentWidth  = this.options.container == 'body' ? window.innerWidth  : $parent.outerWidth()
        var parentHeight = this.options.container == 'body' ? window.innerHeight : $parent.outerHeight()
        var parentLeft   = this.options.container == 'body' ? 0 : $parent.offset().left

        placement = placement == 'bottom' && pos.top   + pos.height  + actualHeight - docScroll > parentHeight  ? 'top'    :
                    placement == 'top'    && pos.top   - docScroll   - actualHeight < 0                         ? 'bottom' :
                    placement == 'right'  && pos.right + actualWidth > parentWidth                              ? 'left'   :
                    placement == 'left'   && pos.left  - actualWidth < parentLeft                               ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)
      this.hoverState = null

      var complete = function() {
        that.$element.trigger('shown.bs.' + that.type)
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one($.support.transition.end, complete)
          .emulateTransitionEnd(150) :
        complete()
    }
  }

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var replace
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  = offset.top  + marginTop
    offset.left = offset.left + marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      replace = true
      offset.top = offset.top + height - actualHeight
    }

    if (/bottom|top/.test(placement)) {
      var delta = 0

      if (offset.left < 0) {
        delta       = offset.left * -2
        offset.left = 0

        $tip.offset(offset)

        actualWidth  = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight
      }

      this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
    } else {
      this.replaceArrow(actualHeight - height, actualHeight, 'top')
    }

    if (replace) $tip.offset(offset)
  }

  Tooltip.prototype.replaceArrow = function (delta, dimension, position) {
    this.arrow().css(position, delta ? (50 * (1 - delta / dimension) + '%') : '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function () {
    var that = this
    var $tip = this.tip()
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      that.$element.trigger('hidden.bs.' + that.type)
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && this.$tip.hasClass('fade') ?
      $tip
        .one($.support.transition.end, complete)
        .emulateTransitionEnd(150) :
      complete()

    this.hoverState = null

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function () {
    var el = this.$element[0]
    return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
      width: el.offsetWidth,
      height: el.offsetHeight
    }, this.$element.offset())
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   }
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.tip = function () {
    return this.$tip = this.$tip || $(this.options.template)
  }

  Tooltip.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow')
  }

  Tooltip.prototype.validate = function () {
    if (!this.$element[0].parentNode) {
      this.hide()
      this.$element = null
      this.options  = null
    }
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = e ? $(e.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type) : this
    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
  }

  Tooltip.prototype.destroy = function () {
    clearTimeout(this.timeout)
    this.hide().$element.off('.' + this.type).removeData('bs.' + this.type)
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  var old = $.fn.tooltip

  $.fn.tooltip = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data && option == 'destroy') return
      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);
;
/* ========================================================================
 * Bootstrap: popover.js v3.1.1
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content')[ // we use append for html objects to maintain js events
      this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
    ](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.arrow')
  }

  Popover.prototype.tip = function () {
    if (!this.$tip) this.$tip = $(this.options.template)
    return this.$tip
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  var old = $.fn.popover

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data && option == 'destroy') return
      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);
;
/* ========================================================================
 * Bootstrap: scrollspy.js v3.1.1
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    var href
    var process  = $.proxy(this.process, this)

    this.$element       = $(element).is('body') ? $(window) : $(element)
    this.$body          = $('body')
    this.$scrollElement = this.$element.on('scroll.bs.scroll-spy.data-api', process)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' .nav li > a'
    this.offsets        = $([])
    this.targets        = $([])
    this.activeTarget   = null

    this.refresh()
    this.process()
  }

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.refresh = function () {
    var offsetMethod = this.$element[0] == window ? 'offset' : 'position'

    this.offsets = $([])
    this.targets = $([])

    var self     = this
    var $targets = this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#./.test(href) && $(href)

        return ($href
          && $href.length
          && $href.is(':visible')
          && [[ $href[offsetMethod]().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href ]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        self.offsets.push(this[0])
        self.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
    var maxScroll    = scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets.last()[0]) && this.activate(i)
    }

    if (activeTarget && scrollTop <= offsets[0]) {
      return activeTarget != (i = targets[0]) && this.activate(i)
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
        && this.activate( targets[i] )
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    $(this.selector)
      .parentsUntil(this.options.target, '.active')
      .removeClass('active')

    var selector = this.selector +
        '[data-target="' + target + '"],' +
        this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length) {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  var old = $.fn.scrollspy

  $.fn.scrollspy = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      $spy.scrollspy($spy.data())
    })
  })

}(jQuery);
;
/* ========================================================================
 * Bootstrap: tab.js v3.1.1
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var previous = $ul.find('.active:last a')[0]
    var e        = $.Event('show.bs.tab', {
      relatedTarget: previous
    })

    $this.trigger(e)

    if (e.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.parent('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: previous
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && $active.hasClass('fade')

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
        .removeClass('active')

      element.addClass('active')

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu')) {
        element.closest('li.dropdown').addClass('active')
      }

      callback && callback()
    }

    transition ?
      $active
        .one($.support.transition.end, next)
        .emulateTransitionEnd(150) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  var old = $.fn.tab

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  $(document).on('click.bs.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    $(this).tab('show')
  })

}(jQuery);
;
/* ========================================================================
 * Bootstrap: transition.js v3.1.1
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      'WebkitTransition' : 'webkitTransitionEnd',
      'MozTransition'    : 'transitionend',
      'OTransition'      : 'oTransitionEnd otransitionend',
      'transition'       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false, $el = this
    $(this).one($.support.transition.end, function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()
  })

}(jQuery);
;
/**
 * BxSlider v4.1.2 - Fully loaded, responsive content slider
 * http://bxslider.com
 *
 * Copyright 2014, Steven Wanderski - http://stevenwanderski.com - http://bxcreative.com
 * Written while drinking Belgian ales and listening to jazz
 *
 * Released under the MIT license - http://opensource.org/licenses/MIT
 */
!function(t){var e={},s={mode:"horizontal",slideSelector:"",infiniteLoop:!0,hideControlOnEnd:!1,speed:500,easing:null,slideMargin:0,startSlide:0,randomStart:!1,captions:!1,ticker:!1,tickerHover:!1,adaptiveHeight:!1,adaptiveHeightSpeed:500,video:!1,useCSS:!0,preloadImages:"visible",responsive:!0,slideZIndex:50,touchEnabled:!0,swipeThreshold:50,oneToOneTouch:!0,preventDefaultSwipeX:!0,preventDefaultSwipeY:!1,pager:!0,pagerType:"full",pagerShortSeparator:" / ",pagerSelector:null,buildPager:null,pagerCustom:null,controls:!0,nextText:"Next",prevText:"Prev",nextSelector:null,prevSelector:null,autoControls:!1,startText:"Start",stopText:"Stop",autoControlsCombine:!1,autoControlsSelector:null,auto:!1,pause:4e3,autoStart:!0,autoDirection:"next",autoHover:!1,autoDelay:0,minSlides:1,maxSlides:1,moveSlides:0,slideWidth:0,onSliderLoad:function(){},onSlideBefore:function(){},onSlideAfter:function(){},onSlideNext:function(){},onSlidePrev:function(){},onSliderResize:function(){}};t.fn.bxSlider=function(n){if(0==this.length)return this;if(this.length>1)return this.each(function(){t(this).bxSlider(n)}),this;var o={},r=this;e.el=this;var a=t(window).width(),l=t(window).height(),d=function(){o.settings=t.extend({},s,n),o.settings.slideWidth=parseInt(o.settings.slideWidth),o.children=r.children(o.settings.slideSelector),o.children.length<o.settings.minSlides&&(o.settings.minSlides=o.children.length),o.children.length<o.settings.maxSlides&&(o.settings.maxSlides=o.children.length),o.settings.randomStart&&(o.settings.startSlide=Math.floor(Math.random()*o.children.length)),o.active={index:o.settings.startSlide},o.carousel=o.settings.minSlides>1||o.settings.maxSlides>1,o.carousel&&(o.settings.preloadImages="all"),o.minThreshold=o.settings.minSlides*o.settings.slideWidth+(o.settings.minSlides-1)*o.settings.slideMargin,o.maxThreshold=o.settings.maxSlides*o.settings.slideWidth+(o.settings.maxSlides-1)*o.settings.slideMargin,o.working=!1,o.controls={},o.interval=null,o.animProp="vertical"==o.settings.mode?"top":"left",o.usingCSS=o.settings.useCSS&&"fade"!=o.settings.mode&&function(){var t=document.createElement("div"),e=["WebkitPerspective","MozPerspective","OPerspective","msPerspective"];for(var i in e)if(void 0!==t.style[e[i]])return o.cssPrefix=e[i].replace("Perspective","").toLowerCase(),o.animProp="-"+o.cssPrefix+"-transform",!0;return!1}(),"vertical"==o.settings.mode&&(o.settings.maxSlides=o.settings.minSlides),r.data("origStyle",r.attr("style")),r.children(o.settings.slideSelector).each(function(){t(this).data("origStyle",t(this).attr("style"))}),c()},c=function(){r.wrap('<div class="bx-wrapper"><div class="bx-viewport"></div></div>'),o.viewport=r.parent(),o.loader=t('<div class="bx-loading" />'),o.viewport.prepend(o.loader),r.css({width:"horizontal"==o.settings.mode?100*o.children.length+215+"%":"auto",position:"relative"}),o.usingCSS&&o.settings.easing?r.css("-"+o.cssPrefix+"-transition-timing-function",o.settings.easing):o.settings.easing||(o.settings.easing="swing"),f(),o.viewport.css({width:"100%",overflow:"hidden",position:"relative"}),o.viewport.parent().css({maxWidth:p()}),o.settings.pager||o.viewport.parent().css({margin:"0 auto 0px"}),o.children.css({"float":"horizontal"==o.settings.mode?"left":"none",listStyle:"none",position:"relative"}),o.children.css("width",u()),"horizontal"==o.settings.mode&&o.settings.slideMargin>0&&o.children.css("marginRight",o.settings.slideMargin),"vertical"==o.settings.mode&&o.settings.slideMargin>0&&o.children.css("marginBottom",o.settings.slideMargin),"fade"==o.settings.mode&&(o.children.css({position:"absolute",zIndex:0,display:"none"}),o.children.eq(o.settings.startSlide).css({zIndex:o.settings.slideZIndex,display:"block"})),o.controls.el=t('<div class="bx-controls" />'),o.settings.captions&&P(),o.active.last=o.settings.startSlide==x()-1,o.settings.video&&r.fitVids();var e=o.children.eq(o.settings.startSlide);"all"==o.settings.preloadImages&&(e=o.children),o.settings.ticker?o.settings.pager=!1:(o.settings.pager&&T(),o.settings.controls&&C(),o.settings.auto&&o.settings.autoControls&&E(),(o.settings.controls||o.settings.autoControls||o.settings.pager)&&o.viewport.after(o.controls.el)),g(e,h)},g=function(e,i){var s=e.find("img, iframe").length;if(0==s)return i(),void 0;var n=0;e.find("img, iframe").each(function(){t(this).one("load",function(){++n==s&&i()}).each(function(){this.complete&&t(this).load()})})},h=function(){if(o.settings.infiniteLoop&&"fade"!=o.settings.mode&&!o.settings.ticker){var e="vertical"==o.settings.mode?o.settings.minSlides:o.settings.maxSlides,i=o.children.slice(0,e).clone().addClass("bx-clone"),s=o.children.slice(-e).clone().addClass("bx-clone");r.append(i).prepend(s)}o.loader.remove(),S(),"vertical"==o.settings.mode&&(o.settings.adaptiveHeight=!0),o.viewport.height(v()),r.redrawSlider(),o.settings.onSliderLoad(o.active.index),o.initialized=!0,o.settings.responsive&&t(window).bind("resize",Z),o.settings.auto&&o.settings.autoStart&&H(),o.settings.ticker&&L(),o.settings.pager&&q(o.settings.startSlide),o.settings.controls&&W(),o.settings.touchEnabled&&!o.settings.ticker&&O()},v=function(){var e=0,s=t();if("vertical"==o.settings.mode||o.settings.adaptiveHeight)if(o.carousel){var n=1==o.settings.moveSlides?o.active.index:o.active.index*m();for(s=o.children.eq(n),i=1;i<=o.settings.maxSlides-1;i++)s=n+i>=o.children.length?s.add(o.children.eq(i-1)):s.add(o.children.eq(n+i))}else s=o.children.eq(o.active.index);else s=o.children;return"vertical"==o.settings.mode?(s.each(function(){e+=t(this).outerHeight()}),o.settings.slideMargin>0&&(e+=o.settings.slideMargin*(o.settings.minSlides-1))):e=Math.max.apply(Math,s.map(function(){return t(this).outerHeight(!1)}).get()),e},p=function(){var t="100%";return o.settings.slideWidth>0&&(t="horizontal"==o.settings.mode?o.settings.maxSlides*o.settings.slideWidth+(o.settings.maxSlides-1)*o.settings.slideMargin:o.settings.slideWidth),t},u=function(){var t=o.settings.slideWidth,e=o.viewport.width();return 0==o.settings.slideWidth||o.settings.slideWidth>e&&!o.carousel||"vertical"==o.settings.mode?t=e:o.settings.maxSlides>1&&"horizontal"==o.settings.mode&&(e>o.maxThreshold||e<o.minThreshold&&(t=(e-o.settings.slideMargin*(o.settings.minSlides-1))/o.settings.minSlides)),t},f=function(){var t=1;if("horizontal"==o.settings.mode&&o.settings.slideWidth>0)if(o.viewport.width()<o.minThreshold)t=o.settings.minSlides;else if(o.viewport.width()>o.maxThreshold)t=o.settings.maxSlides;else{var e=o.children.first().width();t=Math.floor(o.viewport.width()/e)}else"vertical"==o.settings.mode&&(t=o.settings.minSlides);return t},x=function(){var t=0;if(o.settings.moveSlides>0)if(o.settings.infiniteLoop)t=o.children.length/m();else for(var e=0,i=0;e<o.children.length;)++t,e=i+f(),i+=o.settings.moveSlides<=f()?o.settings.moveSlides:f();else t=Math.ceil(o.children.length/f());return t},m=function(){return o.settings.moveSlides>0&&o.settings.moveSlides<=f()?o.settings.moveSlides:f()},S=function(){if(o.children.length>o.settings.maxSlides&&o.active.last&&!o.settings.infiniteLoop){if("horizontal"==o.settings.mode){var t=o.children.last(),e=t.position();b(-(e.left-(o.viewport.width()-t.width())),"reset",0)}else if("vertical"==o.settings.mode){var i=o.children.length-o.settings.minSlides,e=o.children.eq(i).position();b(-e.top,"reset",0)}}else{var e=o.children.eq(o.active.index*m()).position();o.active.index==x()-1&&(o.active.last=!0),void 0!=e&&("horizontal"==o.settings.mode?b(-e.left,"reset",0):"vertical"==o.settings.mode&&b(-e.top,"reset",0))}},b=function(t,e,i,s){if(o.usingCSS){var n="vertical"==o.settings.mode?"translate3d(0, "+t+"px, 0)":"translate3d("+t+"px, 0, 0)";r.css("-"+o.cssPrefix+"-transition-duration",i/1e3+"s"),"slide"==e?(r.css(o.animProp,n),r.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",function(){r.unbind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd"),D()})):"reset"==e?r.css(o.animProp,n):"ticker"==e&&(r.css("-"+o.cssPrefix+"-transition-timing-function","linear"),r.css(o.animProp,n),r.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",function(){r.unbind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd"),b(s.resetValue,"reset",0),N()}))}else{var a={};a[o.animProp]=t,"slide"==e?r.animate(a,i,o.settings.easing,function(){D()}):"reset"==e?r.css(o.animProp,t):"ticker"==e&&r.animate(a,speed,"linear",function(){b(s.resetValue,"reset",0),N()})}},w=function(){for(var e="",i=x(),s=0;i>s;s++){var n="";o.settings.buildPager&&t.isFunction(o.settings.buildPager)?(n=o.settings.buildPager(s),o.pagerEl.addClass("bx-custom-pager")):(n=s+1,o.pagerEl.addClass("bx-default-pager")),e+='<div class="bx-pager-item"><a href="" data-slide-index="'+s+'" class="bx-pager-link">'+n+"</a></div>"}o.pagerEl.html(e)},T=function(){o.settings.pagerCustom?o.pagerEl=t(o.settings.pagerCustom):(o.pagerEl=t('<div class="bx-pager" />'),o.settings.pagerSelector?t(o.settings.pagerSelector).html(o.pagerEl):o.controls.el.addClass("bx-has-pager").append(o.pagerEl),w()),o.pagerEl.on("click","a",I)},C=function(){o.controls.next=t('<a class="bx-next" href="">'+o.settings.nextText+"</a>"),o.controls.prev=t('<a class="bx-prev" href="">'+o.settings.prevText+"</a>"),o.controls.next.bind("click",y),o.controls.prev.bind("click",z),o.settings.nextSelector&&t(o.settings.nextSelector).append(o.controls.next),o.settings.prevSelector&&t(o.settings.prevSelector).append(o.controls.prev),o.settings.nextSelector||o.settings.prevSelector||(o.controls.directionEl=t('<div class="bx-controls-direction" />'),o.controls.directionEl.append(o.controls.prev).append(o.controls.next),o.controls.el.addClass("bx-has-controls-direction").append(o.controls.directionEl))},E=function(){o.controls.start=t('<div class="bx-controls-auto-item"><a class="bx-start" href="">'+o.settings.startText+"</a></div>"),o.controls.stop=t('<div class="bx-controls-auto-item"><a class="bx-stop" href="">'+o.settings.stopText+"</a></div>"),o.controls.autoEl=t('<div class="bx-controls-auto" />'),o.controls.autoEl.on("click",".bx-start",k),o.controls.autoEl.on("click",".bx-stop",M),o.settings.autoControlsCombine?o.controls.autoEl.append(o.controls.start):o.controls.autoEl.append(o.controls.start).append(o.controls.stop),o.settings.autoControlsSelector?t(o.settings.autoControlsSelector).html(o.controls.autoEl):o.controls.el.addClass("bx-has-controls-auto").append(o.controls.autoEl),A(o.settings.autoStart?"stop":"start")},P=function(){o.children.each(function(){var e=t(this).find("img:first").attr("title");void 0!=e&&(""+e).length&&t(this).append('<div class="bx-caption"><span>'+e+"</span></div>")})},y=function(t){o.settings.auto&&r.stopAuto(),r.goToNextSlide(),t.preventDefault()},z=function(t){o.settings.auto&&r.stopAuto(),r.goToPrevSlide(),t.preventDefault()},k=function(t){r.startAuto(),t.preventDefault()},M=function(t){r.stopAuto(),t.preventDefault()},I=function(e){o.settings.auto&&r.stopAuto();var i=t(e.currentTarget),s=parseInt(i.attr("data-slide-index"));s!=o.active.index&&r.goToSlide(s),e.preventDefault()},q=function(e){var i=o.children.length;return"short"==o.settings.pagerType?(o.settings.maxSlides>1&&(i=Math.ceil(o.children.length/o.settings.maxSlides)),o.pagerEl.html(e+1+o.settings.pagerShortSeparator+i),void 0):(o.pagerEl.find("a").removeClass("active"),o.pagerEl.each(function(i,s){t(s).find("a").eq(e).addClass("active")}),void 0)},D=function(){if(o.settings.infiniteLoop){var t="";0==o.active.index?t=o.children.eq(0).position():o.active.index==x()-1&&o.carousel?t=o.children.eq((x()-1)*m()).position():o.active.index==o.children.length-1&&(t=o.children.eq(o.children.length-1).position()),t&&("horizontal"==o.settings.mode?b(-t.left,"reset",0):"vertical"==o.settings.mode&&b(-t.top,"reset",0))}o.working=!1,o.settings.onSlideAfter(o.children.eq(o.active.index),o.oldIndex,o.active.index)},A=function(t){o.settings.autoControlsCombine?o.controls.autoEl.html(o.controls[t]):(o.controls.autoEl.find("a").removeClass("active"),o.controls.autoEl.find("a:not(.bx-"+t+")").addClass("active"))},W=function(){1==x()?(o.controls.prev.addClass("disabled"),o.controls.next.addClass("disabled")):!o.settings.infiniteLoop&&o.settings.hideControlOnEnd&&(0==o.active.index?(o.controls.prev.addClass("disabled"),o.controls.next.removeClass("disabled")):o.active.index==x()-1?(o.controls.next.addClass("disabled"),o.controls.prev.removeClass("disabled")):(o.controls.prev.removeClass("disabled"),o.controls.next.removeClass("disabled")))},H=function(){o.settings.autoDelay>0?setTimeout(r.startAuto,o.settings.autoDelay):r.startAuto(),o.settings.autoHover&&r.hover(function(){o.interval&&(r.stopAuto(!0),o.autoPaused=!0)},function(){o.autoPaused&&(r.startAuto(!0),o.autoPaused=null)})},L=function(){var e=0;if("next"==o.settings.autoDirection)r.append(o.children.clone().addClass("bx-clone"));else{r.prepend(o.children.clone().addClass("bx-clone"));var i=o.children.first().position();e="horizontal"==o.settings.mode?-i.left:-i.top}b(e,"reset",0),o.settings.pager=!1,o.settings.controls=!1,o.settings.autoControls=!1,o.settings.tickerHover&&!o.usingCSS&&o.viewport.hover(function(){r.stop()},function(){var e=0;o.children.each(function(){e+="horizontal"==o.settings.mode?t(this).outerWidth(!0):t(this).outerHeight(!0)});var i=o.settings.speed/e,s="horizontal"==o.settings.mode?"left":"top",n=i*(e-Math.abs(parseInt(r.css(s))));N(n)}),N()},N=function(t){speed=t?t:o.settings.speed;var e={left:0,top:0},i={left:0,top:0};"next"==o.settings.autoDirection?e=r.find(".bx-clone").first().position():i=o.children.first().position();var s="horizontal"==o.settings.mode?-e.left:-e.top,n="horizontal"==o.settings.mode?-i.left:-i.top,a={resetValue:n};b(s,"ticker",speed,a)},O=function(){o.touch={start:{x:0,y:0},end:{x:0,y:0}},o.viewport.bind("touchstart",X)},X=function(t){if(o.working)t.preventDefault();else{o.touch.originalPos=r.position();var e=t.originalEvent;o.touch.start.x=e.changedTouches[0].pageX,o.touch.start.y=e.changedTouches[0].pageY,o.viewport.bind("touchmove",Y),o.viewport.bind("touchend",V)}},Y=function(t){var e=t.originalEvent,i=Math.abs(e.changedTouches[0].pageX-o.touch.start.x),s=Math.abs(e.changedTouches[0].pageY-o.touch.start.y);if(3*i>s&&o.settings.preventDefaultSwipeX?t.preventDefault():3*s>i&&o.settings.preventDefaultSwipeY&&t.preventDefault(),"fade"!=o.settings.mode&&o.settings.oneToOneTouch){var n=0;if("horizontal"==o.settings.mode){var r=e.changedTouches[0].pageX-o.touch.start.x;n=o.touch.originalPos.left+r}else{var r=e.changedTouches[0].pageY-o.touch.start.y;n=o.touch.originalPos.top+r}b(n,"reset",0)}},V=function(t){o.viewport.unbind("touchmove",Y);var e=t.originalEvent,i=0;if(o.touch.end.x=e.changedTouches[0].pageX,o.touch.end.y=e.changedTouches[0].pageY,"fade"==o.settings.mode){var s=Math.abs(o.touch.start.x-o.touch.end.x);s>=o.settings.swipeThreshold&&(o.touch.start.x>o.touch.end.x?r.goToNextSlide():r.goToPrevSlide(),r.stopAuto())}else{var s=0;"horizontal"==o.settings.mode?(s=o.touch.end.x-o.touch.start.x,i=o.touch.originalPos.left):(s=o.touch.end.y-o.touch.start.y,i=o.touch.originalPos.top),!o.settings.infiniteLoop&&(0==o.active.index&&s>0||o.active.last&&0>s)?b(i,"reset",200):Math.abs(s)>=o.settings.swipeThreshold?(0>s?r.goToNextSlide():r.goToPrevSlide(),r.stopAuto()):b(i,"reset",200)}o.viewport.unbind("touchend",V)},Z=function(){var e=t(window).width(),i=t(window).height();(a!=e||l!=i)&&(a=e,l=i,r.redrawSlider(),o.settings.onSliderResize.call(r,o.active.index))};return r.goToSlide=function(e,i){if(!o.working&&o.active.index!=e)if(o.working=!0,o.oldIndex=o.active.index,o.active.index=0>e?x()-1:e>=x()?0:e,o.settings.onSlideBefore(o.children.eq(o.active.index),o.oldIndex,o.active.index),"next"==i?o.settings.onSlideNext(o.children.eq(o.active.index),o.oldIndex,o.active.index):"prev"==i&&o.settings.onSlidePrev(o.children.eq(o.active.index),o.oldIndex,o.active.index),o.active.last=o.active.index>=x()-1,o.settings.pager&&q(o.active.index),o.settings.controls&&W(),"fade"==o.settings.mode)o.settings.adaptiveHeight&&o.viewport.height()!=v()&&o.viewport.animate({height:v()},o.settings.adaptiveHeightSpeed),o.children.filter(":visible").fadeOut(o.settings.speed).css({zIndex:0}),o.children.eq(o.active.index).css("zIndex",o.settings.slideZIndex+1).fadeIn(o.settings.speed,function(){t(this).css("zIndex",o.settings.slideZIndex),D()});else{o.settings.adaptiveHeight&&o.viewport.height()!=v()&&o.viewport.animate({height:v()},o.settings.adaptiveHeightSpeed);var s=0,n={left:0,top:0};if(!o.settings.infiniteLoop&&o.carousel&&o.active.last)if("horizontal"==o.settings.mode){var a=o.children.eq(o.children.length-1);n=a.position(),s=o.viewport.width()-a.outerWidth()}else{var l=o.children.length-o.settings.minSlides;n=o.children.eq(l).position()}else if(o.carousel&&o.active.last&&"prev"==i){var d=1==o.settings.moveSlides?o.settings.maxSlides-m():(x()-1)*m()-(o.children.length-o.settings.maxSlides),a=r.children(".bx-clone").eq(d);n=a.position()}else if("next"==i&&0==o.active.index)n=r.find("> .bx-clone").eq(o.settings.maxSlides).position(),o.active.last=!1;else if(e>=0){var c=e*m();n=o.children.eq(c).position()}if("undefined"!=typeof n){var g="horizontal"==o.settings.mode?-(n.left-s):-n.top;b(g,"slide",o.settings.speed)}}},r.goToNextSlide=function(){if(o.settings.infiniteLoop||!o.active.last){var t=parseInt(o.active.index)+1;r.goToSlide(t,"next")}},r.goToPrevSlide=function(){if(o.settings.infiniteLoop||0!=o.active.index){var t=parseInt(o.active.index)-1;r.goToSlide(t,"prev")}},r.startAuto=function(t){o.interval||(o.interval=setInterval(function(){"next"==o.settings.autoDirection?r.goToNextSlide():r.goToPrevSlide()},o.settings.pause),o.settings.autoControls&&1!=t&&A("stop"))},r.stopAuto=function(t){o.interval&&(clearInterval(o.interval),o.interval=null,o.settings.autoControls&&1!=t&&A("start"))},r.getCurrentSlide=function(){return o.active.index},r.getCurrentSlideElement=function(){return o.children.eq(o.active.index)},r.getSlideCount=function(){return o.children.length},r.redrawSlider=function(){o.children.add(r.find(".bx-clone")).outerWidth(u()),o.viewport.css("height",v()),o.settings.ticker||S(),o.active.last&&(o.active.index=x()-1),o.active.index>=x()&&(o.active.last=!0),o.settings.pager&&!o.settings.pagerCustom&&(w(),q(o.active.index))},r.destroySlider=function(){o.initialized&&(o.initialized=!1,t(".bx-clone",this).remove(),o.children.each(function(){void 0!=t(this).data("origStyle")?t(this).attr("style",t(this).data("origStyle")):t(this).removeAttr("style")}),void 0!=t(this).data("origStyle")?this.attr("style",t(this).data("origStyle")):t(this).removeAttr("style"),t(this).unwrap().unwrap(),o.controls.el&&o.controls.el.remove(),o.controls.next&&o.controls.next.remove(),o.controls.prev&&o.controls.prev.remove(),o.pagerEl&&o.settings.controls&&o.pagerEl.remove(),t(".bx-caption",this).remove(),o.controls.autoEl&&o.controls.autoEl.remove(),clearInterval(o.interval),o.settings.responsive&&t(window).unbind("resize",Z))},r.reloadSlider=function(t){void 0!=t&&(n=t),r.destroySlider(),d()},d(),this}}(jQuery);;
!function(i){"use strict";"function"==typeof define&&define.amd?define(["jquery"],i):"undefined"!=typeof exports?module.exports=i(require("jquery")):i(jQuery)}(function(i){"use strict";var e=window.Slick||{};(e=function(){var e=0;return function(t,o){var s,n=this;n.defaults={accessibility:!0,adaptiveHeight:!1,appendArrows:i(t),appendDots:i(t),arrows:!0,asNavFor:null,prevArrow:'<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',nextArrow:'<button class="slick-next" aria-label="Next" type="button">Next</button>',autoplay:!1,autoplaySpeed:3e3,centerMode:!1,centerPadding:"50px",cssEase:"ease",customPaging:function(e,t){return i('<button type="button" />').text(t+1)},dots:!1,dotsClass:"slick-dots",draggable:!0,easing:"linear",edgeFriction:.35,fade:!1,focusOnSelect:!1,focusOnChange:!1,infinite:!0,initialSlide:0,lazyLoad:"ondemand",mobileFirst:!1,pauseOnHover:!0,pauseOnFocus:!0,pauseOnDotsHover:!1,respondTo:"window",responsive:null,rows:1,rtl:!1,slide:"",slidesPerRow:1,slidesToShow:1,slidesToScroll:1,speed:500,swipe:!0,swipeToSlide:!1,touchMove:!0,touchThreshold:5,useCSS:!0,useTransform:!0,variableWidth:!1,vertical:!1,verticalSwiping:!1,waitForAnimate:!0,zIndex:1e3},n.initials={animating:!1,dragging:!1,autoPlayTimer:null,currentDirection:0,currentLeft:null,currentSlide:0,direction:1,$dots:null,listWidth:null,listHeight:null,loadIndex:0,$nextArrow:null,$prevArrow:null,scrolling:!1,slideCount:null,slideWidth:null,$slideTrack:null,$slides:null,sliding:!1,slideOffset:0,swipeLeft:null,swiping:!1,$list:null,touchObject:{},transformsEnabled:!1,unslicked:!1},i.extend(n,n.initials),n.activeBreakpoint=null,n.animType=null,n.animProp=null,n.breakpoints=[],n.breakpointSettings=[],n.cssTransitions=!1,n.focussed=!1,n.interrupted=!1,n.hidden="hidden",n.paused=!0,n.positionProp=null,n.respondTo=null,n.rowCount=1,n.shouldClick=!0,n.$slider=i(t),n.$slidesCache=null,n.transformType=null,n.transitionType=null,n.visibilityChange="visibilitychange",n.windowWidth=0,n.windowTimer=null,s=i(t).data("slick")||{},n.options=i.extend({},n.defaults,o,s),n.currentSlide=n.options.initialSlide,n.originalSettings=n.options,void 0!==document.mozHidden?(n.hidden="mozHidden",n.visibilityChange="mozvisibilitychange"):void 0!==document.webkitHidden&&(n.hidden="webkitHidden",n.visibilityChange="webkitvisibilitychange"),n.autoPlay=i.proxy(n.autoPlay,n),n.autoPlayClear=i.proxy(n.autoPlayClear,n),n.autoPlayIterator=i.proxy(n.autoPlayIterator,n),n.changeSlide=i.proxy(n.changeSlide,n),n.clickHandler=i.proxy(n.clickHandler,n),n.selectHandler=i.proxy(n.selectHandler,n),n.setPosition=i.proxy(n.setPosition,n),n.swipeHandler=i.proxy(n.swipeHandler,n),n.dragHandler=i.proxy(n.dragHandler,n),n.keyHandler=i.proxy(n.keyHandler,n),n.instanceUid=e++,n.htmlExpr=/^(?:\s*(<[\w\W]+>)[^>]*)$/,n.registerBreakpoints(),n.init(!0)}}()).prototype.activateADA=function(){this.$slideTrack.find(".slick-active").attr({"aria-hidden":"false"}).find("a, input, button, select").attr({tabindex:"0"})},e.prototype.addSlide=e.prototype.slickAdd=function(e,t,o){var s=this;if("boolean"==typeof t)o=t,t=null;else if(t<0||t>=s.slideCount)return!1;s.unload(),"number"==typeof t?0===t&&0===s.$slides.length?i(e).appendTo(s.$slideTrack):o?i(e).insertBefore(s.$slides.eq(t)):i(e).insertAfter(s.$slides.eq(t)):!0===o?i(e).prependTo(s.$slideTrack):i(e).appendTo(s.$slideTrack),s.$slides=s.$slideTrack.children(this.options.slide),s.$slideTrack.children(this.options.slide).detach(),s.$slideTrack.append(s.$slides),s.$slides.each(function(e,t){i(t).attr("data-slick-index",e)}),s.$slidesCache=s.$slides,s.reinit()},e.prototype.animateHeight=function(){var i=this;if(1===i.options.slidesToShow&&!0===i.options.adaptiveHeight&&!1===i.options.vertical){var e=i.$slides.eq(i.currentSlide).outerHeight(!0);i.$list.animate({height:e},i.options.speed)}},e.prototype.animateSlide=function(e,t){var o={},s=this;s.animateHeight(),!0===s.options.rtl&&!1===s.options.vertical&&(e=-e),!1===s.transformsEnabled?!1===s.options.vertical?s.$slideTrack.animate({left:e},s.options.speed,s.options.easing,t):s.$slideTrack.animate({top:e},s.options.speed,s.options.easing,t):!1===s.cssTransitions?(!0===s.options.rtl&&(s.currentLeft=-s.currentLeft),i({animStart:s.currentLeft}).animate({animStart:e},{duration:s.options.speed,easing:s.options.easing,step:function(i){i=Math.ceil(i),!1===s.options.vertical?(o[s.animType]="translate("+i+"px, 0px)",s.$slideTrack.css(o)):(o[s.animType]="translate(0px,"+i+"px)",s.$slideTrack.css(o))},complete:function(){t&&t.call()}})):(s.applyTransition(),e=Math.ceil(e),!1===s.options.vertical?o[s.animType]="translate3d("+e+"px, 0px, 0px)":o[s.animType]="translate3d(0px,"+e+"px, 0px)",s.$slideTrack.css(o),t&&setTimeout(function(){s.disableTransition(),t.call()},s.options.speed))},e.prototype.getNavTarget=function(){var e=this,t=e.options.asNavFor;return t&&null!==t&&(t=i(t).not(e.$slider)),t},e.prototype.asNavFor=function(e){var t=this.getNavTarget();null!==t&&"object"==typeof t&&t.each(function(){var t=i(this).slick("getSlick");t.unslicked||t.slideHandler(e,!0)})},e.prototype.applyTransition=function(i){var e=this,t={};!1===e.options.fade?t[e.transitionType]=e.transformType+" "+e.options.speed+"ms "+e.options.cssEase:t[e.transitionType]="opacity "+e.options.speed+"ms "+e.options.cssEase,!1===e.options.fade?e.$slideTrack.css(t):e.$slides.eq(i).css(t)},e.prototype.autoPlay=function(){var i=this;i.autoPlayClear(),i.slideCount>i.options.slidesToShow&&(i.autoPlayTimer=setInterval(i.autoPlayIterator,i.options.autoplaySpeed))},e.prototype.autoPlayClear=function(){var i=this;i.autoPlayTimer&&clearInterval(i.autoPlayTimer)},e.prototype.autoPlayIterator=function(){var i=this,e=i.currentSlide+i.options.slidesToScroll;i.paused||i.interrupted||i.focussed||(!1===i.options.infinite&&(1===i.direction&&i.currentSlide+1===i.slideCount-1?i.direction=0:0===i.direction&&(e=i.currentSlide-i.options.slidesToScroll,i.currentSlide-1==0&&(i.direction=1))),i.slideHandler(e))},e.prototype.buildArrows=function(){var e=this;!0===e.options.arrows&&(e.$prevArrow=i(e.options.prevArrow).addClass("slick-arrow"),e.$nextArrow=i(e.options.nextArrow).addClass("slick-arrow"),e.slideCount>e.options.slidesToShow?(e.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),e.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),e.htmlExpr.test(e.options.prevArrow)&&e.$prevArrow.prependTo(e.options.appendArrows),e.htmlExpr.test(e.options.nextArrow)&&e.$nextArrow.appendTo(e.options.appendArrows),!0!==e.options.infinite&&e.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true")):e.$prevArrow.add(e.$nextArrow).addClass("slick-hidden").attr({"aria-disabled":"true",tabindex:"-1"}))},e.prototype.buildDots=function(){var e,t,o=this;if(!0===o.options.dots){for(o.$slider.addClass("slick-dotted"),t=i("<ul />").addClass(o.options.dotsClass),e=0;e<=o.getDotCount();e+=1)t.append(i("<li />").append(o.options.customPaging.call(this,o,e)));o.$dots=t.appendTo(o.options.appendDots),o.$dots.find("li").first().addClass("slick-active")}},e.prototype.buildOut=function(){var e=this;e.$slides=e.$slider.children(e.options.slide+":not(.slick-cloned)").addClass("slick-slide"),e.slideCount=e.$slides.length,e.$slides.each(function(e,t){i(t).attr("data-slick-index",e).data("originalStyling",i(t).attr("style")||"")}),e.$slider.addClass("slick-slider"),e.$slideTrack=0===e.slideCount?i('<div class="slick-track"/>').appendTo(e.$slider):e.$slides.wrapAll('<div class="slick-track"/>').parent(),e.$list=e.$slideTrack.wrap('<div class="slick-list"/>').parent(),e.$slideTrack.css("opacity",0),!0!==e.options.centerMode&&!0!==e.options.swipeToSlide||(e.options.slidesToScroll=1),i("img[data-lazy]",e.$slider).not("[src]").addClass("slick-loading"),e.setupInfinite(),e.buildArrows(),e.buildDots(),e.updateDots(),e.setSlideClasses("number"==typeof e.currentSlide?e.currentSlide:0),!0===e.options.draggable&&e.$list.addClass("draggable")},e.prototype.buildRows=function(){var i,e,t,o,s,n,r,l=this;if(o=document.createDocumentFragment(),n=l.$slider.children(),l.options.rows>1){for(r=l.options.slidesPerRow*l.options.rows,s=Math.ceil(n.length/r),i=0;i<s;i++){var d=document.createElement("div");for(e=0;e<l.options.rows;e++){var a=document.createElement("div");for(t=0;t<l.options.slidesPerRow;t++){var c=i*r+(e*l.options.slidesPerRow+t);n.get(c)&&a.appendChild(n.get(c))}d.appendChild(a)}o.appendChild(d)}l.$slider.empty().append(o),l.$slider.children().children().children().css({width:100/l.options.slidesPerRow+"%",display:"inline-block"})}},e.prototype.checkResponsive=function(e,t){var o,s,n,r=this,l=!1,d=r.$slider.width(),a=window.innerWidth||i(window).width();if("window"===r.respondTo?n=a:"slider"===r.respondTo?n=d:"min"===r.respondTo&&(n=Math.min(a,d)),r.options.responsive&&r.options.responsive.length&&null!==r.options.responsive){s=null;for(o in r.breakpoints)r.breakpoints.hasOwnProperty(o)&&(!1===r.originalSettings.mobileFirst?n<r.breakpoints[o]&&(s=r.breakpoints[o]):n>r.breakpoints[o]&&(s=r.breakpoints[o]));null!==s?null!==r.activeBreakpoint?(s!==r.activeBreakpoint||t)&&(r.activeBreakpoint=s,"unslick"===r.breakpointSettings[s]?r.unslick(s):(r.options=i.extend({},r.originalSettings,r.breakpointSettings[s]),!0===e&&(r.currentSlide=r.options.initialSlide),r.refresh(e)),l=s):(r.activeBreakpoint=s,"unslick"===r.breakpointSettings[s]?r.unslick(s):(r.options=i.extend({},r.originalSettings,r.breakpointSettings[s]),!0===e&&(r.currentSlide=r.options.initialSlide),r.refresh(e)),l=s):null!==r.activeBreakpoint&&(r.activeBreakpoint=null,r.options=r.originalSettings,!0===e&&(r.currentSlide=r.options.initialSlide),r.refresh(e),l=s),e||!1===l||r.$slider.trigger("breakpoint",[r,l])}},e.prototype.changeSlide=function(e,t){var o,s,n,r=this,l=i(e.currentTarget);switch(l.is("a")&&e.preventDefault(),l.is("li")||(l=l.closest("li")),n=r.slideCount%r.options.slidesToScroll!=0,o=n?0:(r.slideCount-r.currentSlide)%r.options.slidesToScroll,e.data.message){case"previous":s=0===o?r.options.slidesToScroll:r.options.slidesToShow-o,r.slideCount>r.options.slidesToShow&&r.slideHandler(r.currentSlide-s,!1,t);break;case"next":s=0===o?r.options.slidesToScroll:o,r.slideCount>r.options.slidesToShow&&r.slideHandler(r.currentSlide+s,!1,t);break;case"index":var d=0===e.data.index?0:e.data.index||l.index()*r.options.slidesToScroll;r.slideHandler(r.checkNavigable(d),!1,t),l.children().trigger("focus");break;default:return}},e.prototype.checkNavigable=function(i){var e,t;if(e=this.getNavigableIndexes(),t=0,i>e[e.length-1])i=e[e.length-1];else for(var o in e){if(i<e[o]){i=t;break}t=e[o]}return i},e.prototype.cleanUpEvents=function(){var e=this;e.options.dots&&null!==e.$dots&&(i("li",e.$dots).off("click.slick",e.changeSlide).off("mouseenter.slick",i.proxy(e.interrupt,e,!0)).off("mouseleave.slick",i.proxy(e.interrupt,e,!1)),!0===e.options.accessibility&&e.$dots.off("keydown.slick",e.keyHandler)),e.$slider.off("focus.slick blur.slick"),!0===e.options.arrows&&e.slideCount>e.options.slidesToShow&&(e.$prevArrow&&e.$prevArrow.off("click.slick",e.changeSlide),e.$nextArrow&&e.$nextArrow.off("click.slick",e.changeSlide),!0===e.options.accessibility&&(e.$prevArrow&&e.$prevArrow.off("keydown.slick",e.keyHandler),e.$nextArrow&&e.$nextArrow.off("keydown.slick",e.keyHandler))),e.$list.off("touchstart.slick mousedown.slick",e.swipeHandler),e.$list.off("touchmove.slick mousemove.slick",e.swipeHandler),e.$list.off("touchend.slick mouseup.slick",e.swipeHandler),e.$list.off("touchcancel.slick mouseleave.slick",e.swipeHandler),e.$list.off("click.slick",e.clickHandler),i(document).off(e.visibilityChange,e.visibility),e.cleanUpSlideEvents(),!0===e.options.accessibility&&e.$list.off("keydown.slick",e.keyHandler),!0===e.options.focusOnSelect&&i(e.$slideTrack).children().off("click.slick",e.selectHandler),i(window).off("orientationchange.slick.slick-"+e.instanceUid,e.orientationChange),i(window).off("resize.slick.slick-"+e.instanceUid,e.resize),i("[draggable!=true]",e.$slideTrack).off("dragstart",e.preventDefault),i(window).off("load.slick.slick-"+e.instanceUid,e.setPosition)},e.prototype.cleanUpSlideEvents=function(){var e=this;e.$list.off("mouseenter.slick",i.proxy(e.interrupt,e,!0)),e.$list.off("mouseleave.slick",i.proxy(e.interrupt,e,!1))},e.prototype.cleanUpRows=function(){var i,e=this;e.options.rows>1&&((i=e.$slides.children().children()).removeAttr("style"),e.$slider.empty().append(i))},e.prototype.clickHandler=function(i){!1===this.shouldClick&&(i.stopImmediatePropagation(),i.stopPropagation(),i.preventDefault())},e.prototype.destroy=function(e){var t=this;t.autoPlayClear(),t.touchObject={},t.cleanUpEvents(),i(".slick-cloned",t.$slider).detach(),t.$dots&&t.$dots.remove(),t.$prevArrow&&t.$prevArrow.length&&(t.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display",""),t.htmlExpr.test(t.options.prevArrow)&&t.$prevArrow.remove()),t.$nextArrow&&t.$nextArrow.length&&(t.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display",""),t.htmlExpr.test(t.options.nextArrow)&&t.$nextArrow.remove()),t.$slides&&(t.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function(){i(this).attr("style",i(this).data("originalStyling"))}),t.$slideTrack.children(this.options.slide).detach(),t.$slideTrack.detach(),t.$list.detach(),t.$slider.append(t.$slides)),t.cleanUpRows(),t.$slider.removeClass("slick-slider"),t.$slider.removeClass("slick-initialized"),t.$slider.removeClass("slick-dotted"),t.unslicked=!0,e||t.$slider.trigger("destroy",[t])},e.prototype.disableTransition=function(i){var e=this,t={};t[e.transitionType]="",!1===e.options.fade?e.$slideTrack.css(t):e.$slides.eq(i).css(t)},e.prototype.fadeSlide=function(i,e){var t=this;!1===t.cssTransitions?(t.$slides.eq(i).css({zIndex:t.options.zIndex}),t.$slides.eq(i).animate({opacity:1},t.options.speed,t.options.easing,e)):(t.applyTransition(i),t.$slides.eq(i).css({opacity:1,zIndex:t.options.zIndex}),e&&setTimeout(function(){t.disableTransition(i),e.call()},t.options.speed))},e.prototype.fadeSlideOut=function(i){var e=this;!1===e.cssTransitions?e.$slides.eq(i).animate({opacity:0,zIndex:e.options.zIndex-2},e.options.speed,e.options.easing):(e.applyTransition(i),e.$slides.eq(i).css({opacity:0,zIndex:e.options.zIndex-2}))},e.prototype.filterSlides=e.prototype.slickFilter=function(i){var e=this;null!==i&&(e.$slidesCache=e.$slides,e.unload(),e.$slideTrack.children(this.options.slide).detach(),e.$slidesCache.filter(i).appendTo(e.$slideTrack),e.reinit())},e.prototype.focusHandler=function(){var e=this;e.$slider.off("focus.slick blur.slick").on("focus.slick blur.slick","*",function(t){t.stopImmediatePropagation();var o=i(this);setTimeout(function(){e.options.pauseOnFocus&&(e.focussed=o.is(":focus"),e.autoPlay())},0)})},e.prototype.getCurrent=e.prototype.slickCurrentSlide=function(){return this.currentSlide},e.prototype.getDotCount=function(){var i=this,e=0,t=0,o=0;if(!0===i.options.infinite)if(i.slideCount<=i.options.slidesToShow)++o;else for(;e<i.slideCount;)++o,e=t+i.options.slidesToScroll,t+=i.options.slidesToScroll<=i.options.slidesToShow?i.options.slidesToScroll:i.options.slidesToShow;else if(!0===i.options.centerMode)o=i.slideCount;else if(i.options.asNavFor)for(;e<i.slideCount;)++o,e=t+i.options.slidesToScroll,t+=i.options.slidesToScroll<=i.options.slidesToShow?i.options.slidesToScroll:i.options.slidesToShow;else o=1+Math.ceil((i.slideCount-i.options.slidesToShow)/i.options.slidesToScroll);return o-1},e.prototype.getLeft=function(i){var e,t,o,s,n=this,r=0;return n.slideOffset=0,t=n.$slides.first().outerHeight(!0),!0===n.options.infinite?(n.slideCount>n.options.slidesToShow&&(n.slideOffset=n.slideWidth*n.options.slidesToShow*-1,s=-1,!0===n.options.vertical&&!0===n.options.centerMode&&(2===n.options.slidesToShow?s=-1.5:1===n.options.slidesToShow&&(s=-2)),r=t*n.options.slidesToShow*s),n.slideCount%n.options.slidesToScroll!=0&&i+n.options.slidesToScroll>n.slideCount&&n.slideCount>n.options.slidesToShow&&(i>n.slideCount?(n.slideOffset=(n.options.slidesToShow-(i-n.slideCount))*n.slideWidth*-1,r=(n.options.slidesToShow-(i-n.slideCount))*t*-1):(n.slideOffset=n.slideCount%n.options.slidesToScroll*n.slideWidth*-1,r=n.slideCount%n.options.slidesToScroll*t*-1))):i+n.options.slidesToShow>n.slideCount&&(n.slideOffset=(i+n.options.slidesToShow-n.slideCount)*n.slideWidth,r=(i+n.options.slidesToShow-n.slideCount)*t),n.slideCount<=n.options.slidesToShow&&(n.slideOffset=0,r=0),!0===n.options.centerMode&&n.slideCount<=n.options.slidesToShow?n.slideOffset=n.slideWidth*Math.floor(n.options.slidesToShow)/2-n.slideWidth*n.slideCount/2:!0===n.options.centerMode&&!0===n.options.infinite?n.slideOffset+=n.slideWidth*Math.floor(n.options.slidesToShow/2)-n.slideWidth:!0===n.options.centerMode&&(n.slideOffset=0,n.slideOffset+=n.slideWidth*Math.floor(n.options.slidesToShow/2)),e=!1===n.options.vertical?i*n.slideWidth*-1+n.slideOffset:i*t*-1+r,!0===n.options.variableWidth&&(o=n.slideCount<=n.options.slidesToShow||!1===n.options.infinite?n.$slideTrack.children(".slick-slide").eq(i):n.$slideTrack.children(".slick-slide").eq(i+n.options.slidesToShow),e=!0===n.options.rtl?o[0]?-1*(n.$slideTrack.width()-o[0].offsetLeft-o.width()):0:o[0]?-1*o[0].offsetLeft:0,!0===n.options.centerMode&&(o=n.slideCount<=n.options.slidesToShow||!1===n.options.infinite?n.$slideTrack.children(".slick-slide").eq(i):n.$slideTrack.children(".slick-slide").eq(i+n.options.slidesToShow+1),e=!0===n.options.rtl?o[0]?-1*(n.$slideTrack.width()-o[0].offsetLeft-o.width()):0:o[0]?-1*o[0].offsetLeft:0,e+=(n.$list.width()-o.outerWidth())/2)),e},e.prototype.getOption=e.prototype.slickGetOption=function(i){return this.options[i]},e.prototype.getNavigableIndexes=function(){var i,e=this,t=0,o=0,s=[];for(!1===e.options.infinite?i=e.slideCount:(t=-1*e.options.slidesToScroll,o=-1*e.options.slidesToScroll,i=2*e.slideCount);t<i;)s.push(t),t=o+e.options.slidesToScroll,o+=e.options.slidesToScroll<=e.options.slidesToShow?e.options.slidesToScroll:e.options.slidesToShow;return s},e.prototype.getSlick=function(){return this},e.prototype.getSlideCount=function(){var e,t,o=this;return t=!0===o.options.centerMode?o.slideWidth*Math.floor(o.options.slidesToShow/2):0,!0===o.options.swipeToSlide?(o.$slideTrack.find(".slick-slide").each(function(s,n){if(n.offsetLeft-t+i(n).outerWidth()/2>-1*o.swipeLeft)return e=n,!1}),Math.abs(i(e).attr("data-slick-index")-o.currentSlide)||1):o.options.slidesToScroll},e.prototype.goTo=e.prototype.slickGoTo=function(i,e){this.changeSlide({data:{message:"index",index:parseInt(i)}},e)},e.prototype.init=function(e){var t=this;i(t.$slider).hasClass("slick-initialized")||(i(t.$slider).addClass("slick-initialized"),t.buildRows(),t.buildOut(),t.setProps(),t.startLoad(),t.loadSlider(),t.initializeEvents(),t.updateArrows(),t.updateDots(),t.checkResponsive(!0),t.focusHandler()),e&&t.$slider.trigger("init",[t]),!0===t.options.accessibility&&t.initADA(),t.options.autoplay&&(t.paused=!1,t.autoPlay())},e.prototype.initADA=function(){var e=this,t=Math.ceil(e.slideCount/e.options.slidesToShow),o=e.getNavigableIndexes().filter(function(i){return i>=0&&i<e.slideCount});e.$slides.add(e.$slideTrack.find(".slick-cloned")).attr({"aria-hidden":"true",tabindex:"-1"}).find("a, input, button, select").attr({tabindex:"-1"}),null!==e.$dots&&(e.$slides.not(e.$slideTrack.find(".slick-cloned")).each(function(t){var s=o.indexOf(t);i(this).attr({role:"tabpanel",id:"slick-slide"+e.instanceUid+t,tabindex:-1}),-1!==s&&i(this).attr({"aria-describedby":"slick-slide-control"+e.instanceUid+s})}),e.$dots.attr("role","tablist").find("li").each(function(s){var n=o[s];i(this).attr({role:"presentation"}),i(this).find("button").first().attr({role:"tab",id:"slick-slide-control"+e.instanceUid+s,"aria-controls":"slick-slide"+e.instanceUid+n,"aria-label":s+1+" of "+t,"aria-selected":null,tabindex:"-1"})}).eq(e.currentSlide).find("button").attr({"aria-selected":"true",tabindex:"0"}).end());for(var s=e.currentSlide,n=s+e.options.slidesToShow;s<n;s++)e.$slides.eq(s).attr("tabindex",0);e.activateADA()},e.prototype.initArrowEvents=function(){var i=this;!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.off("click.slick").on("click.slick",{message:"previous"},i.changeSlide),i.$nextArrow.off("click.slick").on("click.slick",{message:"next"},i.changeSlide),!0===i.options.accessibility&&(i.$prevArrow.on("keydown.slick",i.keyHandler),i.$nextArrow.on("keydown.slick",i.keyHandler)))},e.prototype.initDotEvents=function(){var e=this;!0===e.options.dots&&(i("li",e.$dots).on("click.slick",{message:"index"},e.changeSlide),!0===e.options.accessibility&&e.$dots.on("keydown.slick",e.keyHandler)),!0===e.options.dots&&!0===e.options.pauseOnDotsHover&&i("li",e.$dots).on("mouseenter.slick",i.proxy(e.interrupt,e,!0)).on("mouseleave.slick",i.proxy(e.interrupt,e,!1))},e.prototype.initSlideEvents=function(){var e=this;e.options.pauseOnHover&&(e.$list.on("mouseenter.slick",i.proxy(e.interrupt,e,!0)),e.$list.on("mouseleave.slick",i.proxy(e.interrupt,e,!1)))},e.prototype.initializeEvents=function(){var e=this;e.initArrowEvents(),e.initDotEvents(),e.initSlideEvents(),e.$list.on("touchstart.slick mousedown.slick",{action:"start"},e.swipeHandler),e.$list.on("touchmove.slick mousemove.slick",{action:"move"},e.swipeHandler),e.$list.on("touchend.slick mouseup.slick",{action:"end"},e.swipeHandler),e.$list.on("touchcancel.slick mouseleave.slick",{action:"end"},e.swipeHandler),e.$list.on("click.slick",e.clickHandler),i(document).on(e.visibilityChange,i.proxy(e.visibility,e)),!0===e.options.accessibility&&e.$list.on("keydown.slick",e.keyHandler),!0===e.options.focusOnSelect&&i(e.$slideTrack).children().on("click.slick",e.selectHandler),i(window).on("orientationchange.slick.slick-"+e.instanceUid,i.proxy(e.orientationChange,e)),i(window).on("resize.slick.slick-"+e.instanceUid,i.proxy(e.resize,e)),i("[draggable!=true]",e.$slideTrack).on("dragstart",e.preventDefault),i(window).on("load.slick.slick-"+e.instanceUid,e.setPosition),i(e.setPosition)},e.prototype.initUI=function(){var i=this;!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.show(),i.$nextArrow.show()),!0===i.options.dots&&i.slideCount>i.options.slidesToShow&&i.$dots.show()},e.prototype.keyHandler=function(i){var e=this;i.target.tagName.match("TEXTAREA|INPUT|SELECT")||(37===i.keyCode&&!0===e.options.accessibility?e.changeSlide({data:{message:!0===e.options.rtl?"next":"previous"}}):39===i.keyCode&&!0===e.options.accessibility&&e.changeSlide({data:{message:!0===e.options.rtl?"previous":"next"}}))},e.prototype.lazyLoad=function(){function e(e){i("img[data-lazy]",e).each(function(){var e=i(this),t=i(this).attr("data-lazy"),o=i(this).attr("data-srcset"),s=i(this).attr("data-sizes")||n.$slider.attr("data-sizes"),r=document.createElement("img");r.onload=function(){e.animate({opacity:0},100,function(){o&&(e.attr("srcset",o),s&&e.attr("sizes",s)),e.attr("src",t).animate({opacity:1},200,function(){e.removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading")}),n.$slider.trigger("lazyLoaded",[n,e,t])})},r.onerror=function(){e.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),n.$slider.trigger("lazyLoadError",[n,e,t])},r.src=t})}var t,o,s,n=this;if(!0===n.options.centerMode?!0===n.options.infinite?s=(o=n.currentSlide+(n.options.slidesToShow/2+1))+n.options.slidesToShow+2:(o=Math.max(0,n.currentSlide-(n.options.slidesToShow/2+1)),s=n.options.slidesToShow/2+1+2+n.currentSlide):(o=n.options.infinite?n.options.slidesToShow+n.currentSlide:n.currentSlide,s=Math.ceil(o+n.options.slidesToShow),!0===n.options.fade&&(o>0&&o--,s<=n.slideCount&&s++)),t=n.$slider.find(".slick-slide").slice(o,s),"anticipated"===n.options.lazyLoad)for(var r=o-1,l=s,d=n.$slider.find(".slick-slide"),a=0;a<n.options.slidesToScroll;a++)r<0&&(r=n.slideCount-1),t=(t=t.add(d.eq(r))).add(d.eq(l)),r--,l++;e(t),n.slideCount<=n.options.slidesToShow?e(n.$slider.find(".slick-slide")):n.currentSlide>=n.slideCount-n.options.slidesToShow?e(n.$slider.find(".slick-cloned").slice(0,n.options.slidesToShow)):0===n.currentSlide&&e(n.$slider.find(".slick-cloned").slice(-1*n.options.slidesToShow))},e.prototype.loadSlider=function(){var i=this;i.setPosition(),i.$slideTrack.css({opacity:1}),i.$slider.removeClass("slick-loading"),i.initUI(),"progressive"===i.options.lazyLoad&&i.progressiveLazyLoad()},e.prototype.next=e.prototype.slickNext=function(){this.changeSlide({data:{message:"next"}})},e.prototype.orientationChange=function(){var i=this;i.checkResponsive(),i.setPosition()},e.prototype.pause=e.prototype.slickPause=function(){var i=this;i.autoPlayClear(),i.paused=!0},e.prototype.play=e.prototype.slickPlay=function(){var i=this;i.autoPlay(),i.options.autoplay=!0,i.paused=!1,i.focussed=!1,i.interrupted=!1},e.prototype.postSlide=function(e){var t=this;t.unslicked||(t.$slider.trigger("afterChange",[t,e]),t.animating=!1,t.slideCount>t.options.slidesToShow&&t.setPosition(),t.swipeLeft=null,t.options.autoplay&&t.autoPlay(),!0===t.options.accessibility&&(t.initADA(),t.options.focusOnChange&&i(t.$slides.get(t.currentSlide)).attr("tabindex",0).focus()))},e.prototype.prev=e.prototype.slickPrev=function(){this.changeSlide({data:{message:"previous"}})},e.prototype.preventDefault=function(i){i.preventDefault()},e.prototype.progressiveLazyLoad=function(e){e=e||1;var t,o,s,n,r,l=this,d=i("img[data-lazy]",l.$slider);d.length?(t=d.first(),o=t.attr("data-lazy"),s=t.attr("data-srcset"),n=t.attr("data-sizes")||l.$slider.attr("data-sizes"),(r=document.createElement("img")).onload=function(){s&&(t.attr("srcset",s),n&&t.attr("sizes",n)),t.attr("src",o).removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading"),!0===l.options.adaptiveHeight&&l.setPosition(),l.$slider.trigger("lazyLoaded",[l,t,o]),l.progressiveLazyLoad()},r.onerror=function(){e<3?setTimeout(function(){l.progressiveLazyLoad(e+1)},500):(t.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),l.$slider.trigger("lazyLoadError",[l,t,o]),l.progressiveLazyLoad())},r.src=o):l.$slider.trigger("allImagesLoaded",[l])},e.prototype.refresh=function(e){var t,o,s=this;o=s.slideCount-s.options.slidesToShow,!s.options.infinite&&s.currentSlide>o&&(s.currentSlide=o),s.slideCount<=s.options.slidesToShow&&(s.currentSlide=0),t=s.currentSlide,s.destroy(!0),i.extend(s,s.initials,{currentSlide:t}),s.init(),e||s.changeSlide({data:{message:"index",index:t}},!1)},e.prototype.registerBreakpoints=function(){var e,t,o,s=this,n=s.options.responsive||null;if("array"===i.type(n)&&n.length){s.respondTo=s.options.respondTo||"window";for(e in n)if(o=s.breakpoints.length-1,n.hasOwnProperty(e)){for(t=n[e].breakpoint;o>=0;)s.breakpoints[o]&&s.breakpoints[o]===t&&s.breakpoints.splice(o,1),o--;s.breakpoints.push(t),s.breakpointSettings[t]=n[e].settings}s.breakpoints.sort(function(i,e){return s.options.mobileFirst?i-e:e-i})}},e.prototype.reinit=function(){var e=this;e.$slides=e.$slideTrack.children(e.options.slide).addClass("slick-slide"),e.slideCount=e.$slides.length,e.currentSlide>=e.slideCount&&0!==e.currentSlide&&(e.currentSlide=e.currentSlide-e.options.slidesToScroll),e.slideCount<=e.options.slidesToShow&&(e.currentSlide=0),e.registerBreakpoints(),e.setProps(),e.setupInfinite(),e.buildArrows(),e.updateArrows(),e.initArrowEvents(),e.buildDots(),e.updateDots(),e.initDotEvents(),e.cleanUpSlideEvents(),e.initSlideEvents(),e.checkResponsive(!1,!0),!0===e.options.focusOnSelect&&i(e.$slideTrack).children().on("click.slick",e.selectHandler),e.setSlideClasses("number"==typeof e.currentSlide?e.currentSlide:0),e.setPosition(),e.focusHandler(),e.paused=!e.options.autoplay,e.autoPlay(),e.$slider.trigger("reInit",[e])},e.prototype.resize=function(){var e=this;i(window).width()!==e.windowWidth&&(clearTimeout(e.windowDelay),e.windowDelay=window.setTimeout(function(){e.windowWidth=i(window).width(),e.checkResponsive(),e.unslicked||e.setPosition()},50))},e.prototype.removeSlide=e.prototype.slickRemove=function(i,e,t){var o=this;if(i="boolean"==typeof i?!0===(e=i)?0:o.slideCount-1:!0===e?--i:i,o.slideCount<1||i<0||i>o.slideCount-1)return!1;o.unload(),!0===t?o.$slideTrack.children().remove():o.$slideTrack.children(this.options.slide).eq(i).remove(),o.$slides=o.$slideTrack.children(this.options.slide),o.$slideTrack.children(this.options.slide).detach(),o.$slideTrack.append(o.$slides),o.$slidesCache=o.$slides,o.reinit()},e.prototype.setCSS=function(i){var e,t,o=this,s={};!0===o.options.rtl&&(i=-i),e="left"==o.positionProp?Math.ceil(i)+"px":"0px",t="top"==o.positionProp?Math.ceil(i)+"px":"0px",s[o.positionProp]=i,!1===o.transformsEnabled?o.$slideTrack.css(s):(s={},!1===o.cssTransitions?(s[o.animType]="translate("+e+", "+t+")",o.$slideTrack.css(s)):(s[o.animType]="translate3d("+e+", "+t+", 0px)",o.$slideTrack.css(s)))},e.prototype.setDimensions=function(){var i=this;!1===i.options.vertical?!0===i.options.centerMode&&i.$list.css({padding:"0px "+i.options.centerPadding}):(i.$list.height(i.$slides.first().outerHeight(!0)*i.options.slidesToShow),!0===i.options.centerMode&&i.$list.css({padding:i.options.centerPadding+" 0px"})),i.listWidth=i.$list.width(),i.listHeight=i.$list.height(),!1===i.options.vertical&&!1===i.options.variableWidth?(i.slideWidth=Math.ceil(i.listWidth/i.options.slidesToShow),i.$slideTrack.width(Math.ceil(i.slideWidth*i.$slideTrack.children(".slick-slide").length))):!0===i.options.variableWidth?i.$slideTrack.width(5e3*i.slideCount):(i.slideWidth=Math.ceil(i.listWidth),i.$slideTrack.height(Math.ceil(i.$slides.first().outerHeight(!0)*i.$slideTrack.children(".slick-slide").length)));var e=i.$slides.first().outerWidth(!0)-i.$slides.first().width();!1===i.options.variableWidth&&i.$slideTrack.children(".slick-slide").width(i.slideWidth-e)},e.prototype.setFade=function(){var e,t=this;t.$slides.each(function(o,s){e=t.slideWidth*o*-1,!0===t.options.rtl?i(s).css({position:"relative",right:e,top:0,zIndex:t.options.zIndex-2,opacity:0}):i(s).css({position:"relative",left:e,top:0,zIndex:t.options.zIndex-2,opacity:0})}),t.$slides.eq(t.currentSlide).css({zIndex:t.options.zIndex-1,opacity:1})},e.prototype.setHeight=function(){var i=this;if(1===i.options.slidesToShow&&!0===i.options.adaptiveHeight&&!1===i.options.vertical){var e=i.$slides.eq(i.currentSlide).outerHeight(!0);i.$list.css("height",e)}},e.prototype.setOption=e.prototype.slickSetOption=function(){var e,t,o,s,n,r=this,l=!1;if("object"===i.type(arguments[0])?(o=arguments[0],l=arguments[1],n="multiple"):"string"===i.type(arguments[0])&&(o=arguments[0],s=arguments[1],l=arguments[2],"responsive"===arguments[0]&&"array"===i.type(arguments[1])?n="responsive":void 0!==arguments[1]&&(n="single")),"single"===n)r.options[o]=s;else if("multiple"===n)i.each(o,function(i,e){r.options[i]=e});else if("responsive"===n)for(t in s)if("array"!==i.type(r.options.responsive))r.options.responsive=[s[t]];else{for(e=r.options.responsive.length-1;e>=0;)r.options.responsive[e].breakpoint===s[t].breakpoint&&r.options.responsive.splice(e,1),e--;r.options.responsive.push(s[t])}l&&(r.unload(),r.reinit())},e.prototype.setPosition=function(){var i=this;i.setDimensions(),i.setHeight(),!1===i.options.fade?i.setCSS(i.getLeft(i.currentSlide)):i.setFade(),i.$slider.trigger("setPosition",[i])},e.prototype.setProps=function(){var i=this,e=document.body.style;i.positionProp=!0===i.options.vertical?"top":"left","top"===i.positionProp?i.$slider.addClass("slick-vertical"):i.$slider.removeClass("slick-vertical"),void 0===e.WebkitTransition&&void 0===e.MozTransition&&void 0===e.msTransition||!0===i.options.useCSS&&(i.cssTransitions=!0),i.options.fade&&("number"==typeof i.options.zIndex?i.options.zIndex<3&&(i.options.zIndex=3):i.options.zIndex=i.defaults.zIndex),void 0!==e.OTransform&&(i.animType="OTransform",i.transformType="-o-transform",i.transitionType="OTransition",void 0===e.perspectiveProperty&&void 0===e.webkitPerspective&&(i.animType=!1)),void 0!==e.MozTransform&&(i.animType="MozTransform",i.transformType="-moz-transform",i.transitionType="MozTransition",void 0===e.perspectiveProperty&&void 0===e.MozPerspective&&(i.animType=!1)),void 0!==e.webkitTransform&&(i.animType="webkitTransform",i.transformType="-webkit-transform",i.transitionType="webkitTransition",void 0===e.perspectiveProperty&&void 0===e.webkitPerspective&&(i.animType=!1)),void 0!==e.msTransform&&(i.animType="msTransform",i.transformType="-ms-transform",i.transitionType="msTransition",void 0===e.msTransform&&(i.animType=!1)),void 0!==e.transform&&!1!==i.animType&&(i.animType="transform",i.transformType="transform",i.transitionType="transition"),i.transformsEnabled=i.options.useTransform&&null!==i.animType&&!1!==i.animType},e.prototype.setSlideClasses=function(i){var e,t,o,s,n=this;if(t=n.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden","true"),n.$slides.eq(i).addClass("slick-current"),!0===n.options.centerMode){var r=n.options.slidesToShow%2==0?1:0;e=Math.floor(n.options.slidesToShow/2),!0===n.options.infinite&&(i>=e&&i<=n.slideCount-1-e?n.$slides.slice(i-e+r,i+e+1).addClass("slick-active").attr("aria-hidden","false"):(o=n.options.slidesToShow+i,t.slice(o-e+1+r,o+e+2).addClass("slick-active").attr("aria-hidden","false")),0===i?t.eq(t.length-1-n.options.slidesToShow).addClass("slick-center"):i===n.slideCount-1&&t.eq(n.options.slidesToShow).addClass("slick-center")),n.$slides.eq(i).addClass("slick-center")}else i>=0&&i<=n.slideCount-n.options.slidesToShow?n.$slides.slice(i,i+n.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false"):t.length<=n.options.slidesToShow?t.addClass("slick-active").attr("aria-hidden","false"):(s=n.slideCount%n.options.slidesToShow,o=!0===n.options.infinite?n.options.slidesToShow+i:i,n.options.slidesToShow==n.options.slidesToScroll&&n.slideCount-i<n.options.slidesToShow?t.slice(o-(n.options.slidesToShow-s),o+s).addClass("slick-active").attr("aria-hidden","false"):t.slice(o,o+n.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false"));"ondemand"!==n.options.lazyLoad&&"anticipated"!==n.options.lazyLoad||n.lazyLoad()},e.prototype.setupInfinite=function(){var e,t,o,s=this;if(!0===s.options.fade&&(s.options.centerMode=!1),!0===s.options.infinite&&!1===s.options.fade&&(t=null,s.slideCount>s.options.slidesToShow)){for(o=!0===s.options.centerMode?s.options.slidesToShow+1:s.options.slidesToShow,e=s.slideCount;e>s.slideCount-o;e-=1)t=e-1,i(s.$slides[t]).clone(!0).attr("id","").attr("data-slick-index",t-s.slideCount).prependTo(s.$slideTrack).addClass("slick-cloned");for(e=0;e<o+s.slideCount;e+=1)t=e,i(s.$slides[t]).clone(!0).attr("id","").attr("data-slick-index",t+s.slideCount).appendTo(s.$slideTrack).addClass("slick-cloned");s.$slideTrack.find(".slick-cloned").find("[id]").each(function(){i(this).attr("id","")})}},e.prototype.interrupt=function(i){var e=this;i||e.autoPlay(),e.interrupted=i},e.prototype.selectHandler=function(e){var t=this,o=i(e.target).is(".slick-slide")?i(e.target):i(e.target).parents(".slick-slide"),s=parseInt(o.attr("data-slick-index"));s||(s=0),t.slideCount<=t.options.slidesToShow?t.slideHandler(s,!1,!0):t.slideHandler(s)},e.prototype.slideHandler=function(i,e,t){var o,s,n,r,l,d=null,a=this;if(e=e||!1,!(!0===a.animating&&!0===a.options.waitForAnimate||!0===a.options.fade&&a.currentSlide===i))if(!1===e&&a.asNavFor(i),o=i,d=a.getLeft(o),r=a.getLeft(a.currentSlide),a.currentLeft=null===a.swipeLeft?r:a.swipeLeft,!1===a.options.infinite&&!1===a.options.centerMode&&(i<0||i>a.getDotCount()*a.options.slidesToScroll))!1===a.options.fade&&(o=a.currentSlide,!0!==t?a.animateSlide(r,function(){a.postSlide(o)}):a.postSlide(o));else if(!1===a.options.infinite&&!0===a.options.centerMode&&(i<0||i>a.slideCount-a.options.slidesToScroll))!1===a.options.fade&&(o=a.currentSlide,!0!==t?a.animateSlide(r,function(){a.postSlide(o)}):a.postSlide(o));else{if(a.options.autoplay&&clearInterval(a.autoPlayTimer),s=o<0?a.slideCount%a.options.slidesToScroll!=0?a.slideCount-a.slideCount%a.options.slidesToScroll:a.slideCount+o:o>=a.slideCount?a.slideCount%a.options.slidesToScroll!=0?0:o-a.slideCount:o,a.animating=!0,a.$slider.trigger("beforeChange",[a,a.currentSlide,s]),n=a.currentSlide,a.currentSlide=s,a.setSlideClasses(a.currentSlide),a.options.asNavFor&&(l=(l=a.getNavTarget()).slick("getSlick")).slideCount<=l.options.slidesToShow&&l.setSlideClasses(a.currentSlide),a.updateDots(),a.updateArrows(),!0===a.options.fade)return!0!==t?(a.fadeSlideOut(n),a.fadeSlide(s,function(){a.postSlide(s)})):a.postSlide(s),void a.animateHeight();!0!==t?a.animateSlide(d,function(){a.postSlide(s)}):a.postSlide(s)}},e.prototype.startLoad=function(){var i=this;!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.hide(),i.$nextArrow.hide()),!0===i.options.dots&&i.slideCount>i.options.slidesToShow&&i.$dots.hide(),i.$slider.addClass("slick-loading")},e.prototype.swipeDirection=function(){var i,e,t,o,s=this;return i=s.touchObject.startX-s.touchObject.curX,e=s.touchObject.startY-s.touchObject.curY,t=Math.atan2(e,i),(o=Math.round(180*t/Math.PI))<0&&(o=360-Math.abs(o)),o<=45&&o>=0?!1===s.options.rtl?"left":"right":o<=360&&o>=315?!1===s.options.rtl?"left":"right":o>=135&&o<=225?!1===s.options.rtl?"right":"left":!0===s.options.verticalSwiping?o>=35&&o<=135?"down":"up":"vertical"},e.prototype.swipeEnd=function(i){var e,t,o=this;if(o.dragging=!1,o.swiping=!1,o.scrolling)return o.scrolling=!1,!1;if(o.interrupted=!1,o.shouldClick=!(o.touchObject.swipeLength>10),void 0===o.touchObject.curX)return!1;if(!0===o.touchObject.edgeHit&&o.$slider.trigger("edge",[o,o.swipeDirection()]),o.touchObject.swipeLength>=o.touchObject.minSwipe){switch(t=o.swipeDirection()){case"left":case"down":e=o.options.swipeToSlide?o.checkNavigable(o.currentSlide+o.getSlideCount()):o.currentSlide+o.getSlideCount(),o.currentDirection=0;break;case"right":case"up":e=o.options.swipeToSlide?o.checkNavigable(o.currentSlide-o.getSlideCount()):o.currentSlide-o.getSlideCount(),o.currentDirection=1}"vertical"!=t&&(o.slideHandler(e),o.touchObject={},o.$slider.trigger("swipe",[o,t]))}else o.touchObject.startX!==o.touchObject.curX&&(o.slideHandler(o.currentSlide),o.touchObject={})},e.prototype.swipeHandler=function(i){var e=this;if(!(!1===e.options.swipe||"ontouchend"in document&&!1===e.options.swipe||!1===e.options.draggable&&-1!==i.type.indexOf("mouse")))switch(e.touchObject.fingerCount=i.originalEvent&&void 0!==i.originalEvent.touches?i.originalEvent.touches.length:1,e.touchObject.minSwipe=e.listWidth/e.options.touchThreshold,!0===e.options.verticalSwiping&&(e.touchObject.minSwipe=e.listHeight/e.options.touchThreshold),i.data.action){case"start":e.swipeStart(i);break;case"move":e.swipeMove(i);break;case"end":e.swipeEnd(i)}},e.prototype.swipeMove=function(i){var e,t,o,s,n,r,l=this;return n=void 0!==i.originalEvent?i.originalEvent.touches:null,!(!l.dragging||l.scrolling||n&&1!==n.length)&&(e=l.getLeft(l.currentSlide),l.touchObject.curX=void 0!==n?n[0].pageX:i.clientX,l.touchObject.curY=void 0!==n?n[0].pageY:i.clientY,l.touchObject.swipeLength=Math.round(Math.sqrt(Math.pow(l.touchObject.curX-l.touchObject.startX,2))),r=Math.round(Math.sqrt(Math.pow(l.touchObject.curY-l.touchObject.startY,2))),!l.options.verticalSwiping&&!l.swiping&&r>4?(l.scrolling=!0,!1):(!0===l.options.verticalSwiping&&(l.touchObject.swipeLength=r),t=l.swipeDirection(),void 0!==i.originalEvent&&l.touchObject.swipeLength>4&&(l.swiping=!0,i.preventDefault()),s=(!1===l.options.rtl?1:-1)*(l.touchObject.curX>l.touchObject.startX?1:-1),!0===l.options.verticalSwiping&&(s=l.touchObject.curY>l.touchObject.startY?1:-1),o=l.touchObject.swipeLength,l.touchObject.edgeHit=!1,!1===l.options.infinite&&(0===l.currentSlide&&"right"===t||l.currentSlide>=l.getDotCount()&&"left"===t)&&(o=l.touchObject.swipeLength*l.options.edgeFriction,l.touchObject.edgeHit=!0),!1===l.options.vertical?l.swipeLeft=e+o*s:l.swipeLeft=e+o*(l.$list.height()/l.listWidth)*s,!0===l.options.verticalSwiping&&(l.swipeLeft=e+o*s),!0!==l.options.fade&&!1!==l.options.touchMove&&(!0===l.animating?(l.swipeLeft=null,!1):void l.setCSS(l.swipeLeft))))},e.prototype.swipeStart=function(i){var e,t=this;if(t.interrupted=!0,1!==t.touchObject.fingerCount||t.slideCount<=t.options.slidesToShow)return t.touchObject={},!1;void 0!==i.originalEvent&&void 0!==i.originalEvent.touches&&(e=i.originalEvent.touches[0]),t.touchObject.startX=t.touchObject.curX=void 0!==e?e.pageX:i.clientX,t.touchObject.startY=t.touchObject.curY=void 0!==e?e.pageY:i.clientY,t.dragging=!0},e.prototype.unfilterSlides=e.prototype.slickUnfilter=function(){var i=this;null!==i.$slidesCache&&(i.unload(),i.$slideTrack.children(this.options.slide).detach(),i.$slidesCache.appendTo(i.$slideTrack),i.reinit())},e.prototype.unload=function(){var e=this;i(".slick-cloned",e.$slider).remove(),e.$dots&&e.$dots.remove(),e.$prevArrow&&e.htmlExpr.test(e.options.prevArrow)&&e.$prevArrow.remove(),e.$nextArrow&&e.htmlExpr.test(e.options.nextArrow)&&e.$nextArrow.remove(),e.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden","true").css("width","")},e.prototype.unslick=function(i){var e=this;e.$slider.trigger("unslick",[e,i]),e.destroy()},e.prototype.updateArrows=function(){var i=this;Math.floor(i.options.slidesToShow/2),!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&!i.options.infinite&&(i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false"),i.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false"),0===i.currentSlide?(i.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true"),i.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false")):i.currentSlide>=i.slideCount-i.options.slidesToShow&&!1===i.options.centerMode?(i.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true"),i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")):i.currentSlide>=i.slideCount-1&&!0===i.options.centerMode&&(i.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true"),i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")))},e.prototype.updateDots=function(){var i=this;null!==i.$dots&&(i.$dots.find("li").removeClass("slick-active").end(),i.$dots.find("li").eq(Math.floor(i.currentSlide/i.options.slidesToScroll)).addClass("slick-active"))},e.prototype.visibility=function(){var i=this;i.options.autoplay&&(document[i.hidden]?i.interrupted=!0:i.interrupted=!1)},i.fn.slick=function(){var i,t,o=this,s=arguments[0],n=Array.prototype.slice.call(arguments,1),r=o.length;for(i=0;i<r;i++)if("object"==typeof s||void 0===s?o[i].slick=new e(o[i],s):t=o[i].slick[s].apply(o[i].slick,n),void 0!==t)return t;return o}});
;
var getWindowState = (function() {
    var breakpoints = [480,768,1024,1280],
        range = ['sp','xs','sm','md','lg'];
    return function () {
        var windowWidth = window.innerWidth || document.documentElement.clientWidth;

        for(var i=0; i<breakpoints.length; i++){
            if(windowWidth < breakpoints[i]){
                return range[i];
            }
        }
        return range[i];
    }
})();
var getNbColumns = (function() {
    var nbCol = {
        sp: 2,
        xs: 2,
        sm: 4,
        md: 5,
        lg: 5
    };
    return function() {
        return nbCol[getWindowState()];
    };
})();
var normalizeHeight;
var mediaSlider;
var calendarSlider;
var initCountdownBlock;

// Prevent the iPad from zooming a lot when switching orientation.
// http://stackoverflow.com/questions/5434656/ipad-layout-scales-up-when-rotating-from-portrait-to-landcape#6379407
if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) {
    var viewportmeta = document.querySelector('meta[name="viewport"]');
    if (viewportmeta) {
        viewportmeta.content = 'width=device-width, minimum-scale=1.0, maximum-scale=1.0, initial-scale=1.0';
        window.onload = function() {
            document.body.addEventListener('gesturestart', function () {
                viewportmeta.content = 'width=device-width, minimum-scale=0.25, maximum-scale=1.6';
            }, false);
        }
    }
}

(function($){
    var isPageLoaded = false;
    $(window).load(function(){
        isPageLoaded = true;
    });



    // Listen to the resize event and fire a custom event when the orientation of the device has changed.
    $(window).resize((function(){
        var ratio = $(window).width()/$(window).height();

        return function(){
            var newRatio = $(window).width()/$(window).height();
            if((1 - ratio)*(1 - newRatio) <= 0) {
                $(window).trigger('orientationchange', [(1 - newRatio > 0)?"portrait":"landscape"]);
            }
            ratio = newRatio;
        };
    })());




    $(window).load(function(){
        // Force every elements to the highest height.
        if(getNbColumns() == 2) {
            $('.products-navigation').each(function () {
                var lis = $(this).find('li'), maxHeight = 0;
                lis.each(function () {
                    if ($(this).height() > maxHeight) {
                        maxHeight = $(this).height();
                    }
                });
                lis.height(maxHeight);
            })
        }
    });

    domReady(function(){
        var checkboxes = $('input:checkbox, input:radio');
        if(window.respond && checkboxes.length > 0) {
            checkboxes.checkedPolyfill();
        }


        // Handle the display/collapse of the menu in mobile mode
        $('.navbar button.navbar-toggle').click((function () {
            function closeMenu() {
                $('.navbar.navbar-safran').removeClass('open');
                $(this).off('click touch', closeMenu);
            }


            return function () {
                $(this).parents('.navbar.navbar-safran').toggleClass('open');
                $('#pusher').on('click touch', closeMenu);
            }
        })());

        // Search box management
        $('.search-open').click(function(event) {
            event.preventDefault();
            $('#search-layer').fadeIn();
            $('#search-layer .form-item-search-block-form input').focus();
        });
        $('#search-layer .search-close').click(function(event){
            event.preventDefault();
            $('#search-layer').fadeOut();
        });
        $(document).keyup(function(e){
            if (e.keyCode == 27) {
                if($('#search-layer').css('display') != 'none') {
                    $('#search-layer').fadeOut();
                }
            }
        });

        // Handle the click on an element of the toolkit.
        var pusher = $('#pusher');
        $('.left-menu .menu-button').each(function (index, element) {
            var submenu = $(element).siblings('.submenu').first();
            $(this).click(function (event) {
                event.preventDefault();

                if (pusher.hasClass('open') && $(this).parent().hasClass('visible')) {
                    event.preventDefault();

                    if(window.respond) { // Check if respond is defined, if so, then the browser is IE8
                        pusher.animate({
                            left: 0
                        });
                    } else {
                        pusher.removeAttr('style');
                    }
                    pusher.removeClass('open');

                    $('.left-menu li').removeClass('visible');

                    pusher.unbind('click');

                } else {
                    submenu.parents('li').siblings().removeClass('visible');
                    submenu.parents('li').addClass('visible');

                    if(window.respond) { // Check if respond is defined, if so, then the browser is IE8
                        pusher.animate({
                            left: submenu.width()
                        });
                    } else {
                        pusher.css({
                            '-webkit-transform': 'translate3d(' + submenu.width() + 'px,0,0)',
                            '-ms-transform': 'translate(' + submenu.width() + 'px,0)',
                            'transform': 'translate3d(' + submenu.width() + 'px,0,0)'
                        });
                    }
                    pusher.addClass('open');
                    pusher.click(function (event) {
                        event.preventDefault();

                        if(window.respond) { // Check if respond is defined, if so, then the browser is IE8
                            $(this).animate({left: 0});
                        } else {
                            $(this).css({
                                '-webkit-transform': '',
                                '-ms-transform': '',
                                'transform': ''
                            });
                        }
                        $(this).removeClass('open');
                        $('.left-menu li').removeClass('visible');

                        $(this).unbind('click');
                    });
                }
            });

        });

        $('.main-navbar .dropdown-menu .lvl3 a').hover(function () {
            $(this).parents('.lvl2').addClass('hover');
        }, function () {
            $(this).parents('.lvl2').removeClass('hover');
        });

        var prepareHTML = function() {
                $('.main-navbar .dropdown-menu').show();
            },
            restoreHTML = function() {
                $('.main-navbar .dropdown-menu').removeAttr('style');
            };
        normalizeHeight = function(blocks) {
            prepareHTML();
            var nbCols = getNbColumns();
            blocks.each(function(){
                var nbColsBlock = nbCols;
                if(($(this).parents('.content-body').hasClass('four-columns') && nbColsBlock == 5) || $(this).parents('.layer-blocks').length > 0) {
                    nbColsBlock = 4;
                }

                if($(this).parents('.main-navbar').length != 0) {
                    $(this).height($(this).width()/2);//Set 1/2 blocks in the header dropdowns
                } else {
                    var height = Math.floor($(this).parents('.container-fluid').width()/nbColsBlock - 8) ;

                    if($(this).hasClass('long') && $(this).hasClass('high')) {
                        //$(this).height( 8 + 2 * height);
                        $(this).css({height: 8 + 2 * height});
                    } else if($(this).hasClass('half-height')){
                        $(this).height($(this).width()/2);//Set 1/2 blocks
                    } else {
                        //$(this).height(height);
                        $(this).css({height: height});
                    }
                }
            });
            restoreHTML();
        };
        var calcTime = function (date) {
            var secondDiviser = 1000,
                minuteDiviser = secondDiviser * 60,
                hourDiviser = minuteDiviser * 60,
                dayDiviser = hourDiviser * 24;

            /**
             * @param date A proper Date object or directly the timestamp
             * @returns {{days: number, hours: number, minutes: number, seconds: number}}
             */
            var diff = date - new Date();

            if(diff <= 0) {
                return null;
            }

            var result = {
                days: Math.floor(diff / dayDiviser).toString(),
                hours: Math.floor(diff % dayDiviser / hourDiviser).toString(),
                minutes: Math.floor(diff % hourDiviser / minuteDiviser).toString(),
                seconds: Math.floor(diff % minuteDiviser / secondDiviser).toString()
            };

            // pad the results to have always at least 2 digits
            for(var key in result) {
                while(result[key].length < 2) {
                    result[key] = '0' + result[key];
                }
            }

            return result;
        }
        initCountdownBlock = function (blocks) {
            blocks.each(function () {
                function updateTime() {
                    var time = calcTime(targetTime);

                    if(time === null) {
                        clearInterval(ref);
                        time = {
                            days: '00',
                            hours: '00',
                            minutes: '00',
                            seconds: '00'
                        };
                    }

                    for(var key in time) {
                        container.find('.' + key).text(time[key]);
                    }
                }

                var container = $(this).find('.countdown-container'),
                    targetTime = container.data('target-time');

                updateTime();
                var ref = setInterval(updateTime, 1000);
            });
        };

        if($.fn.marquee) {
            var mq = $('.marquee').marquee({
                allowCss3Support: false,
                direction: 'left',
                duration: 30000,
                pauseOnHover: false
            });
            $('.block-fil-info').hover(
                function () {
                    mq.marquee('pause');
                }, function () {
                    mq.marquee('resume');
                }
            );
        }

        var content = $('#content'),
            system = content.find('.system:not(.textless)'),
            solutionHeader = content.find('.solution-header'),
            systemLayout = function(parent){
                var text = parent.find('.text-block'),
                    blocks = text.siblings('.block'),
                    textColumns = 2;
                if(parent.hasClass('solution-header')) {
                    textColumns = 3;
                }

                //Get number of squares to place on the grid. Long block's width is 2 -> count it again once as it was already counted once before
                var nbElems = blocks.length + blocks.filter('.long').length + 2*blocks.filter('.long.high').length,
                //Description block's width is 2 or 3. That leaves this many less columns for the blocks to be placed on the grid.
                    nbLines = Math.ceil(nbElems/(getNbColumns() - textColumns)),
                    lineHeight = Math.floor(parent.parents('.container-fluid').width()/getNbColumns());

                if(nbLines == 0) return;

                // We have to wait for the page contents to be loaded here. We need the fonts to be applied so the text blocks have the proper heights
                function applyHeight(nbLines, lineHeight){
                    text.css({
                        'min-height': text.height(),
                        height: nbLines * lineHeight + 1 // + 1px to compensate for potential 1 line errors due to layout concerns
                    });
                }
                if(isPageLoaded) {
                    applyHeight(nbLines, lineHeight);
                } else {
                    $(window).load(function(){
                        applyHeight(nbLines, lineHeight);
                    });
                }
            };

        if( system.length > 0 ) {
            systemLayout(system);
        } else if( solutionHeader.length > 0 ) {
            systemLayout(solutionHeader);
        }

        blockSlider = function(context){
            var slidersList = [];
            $(context).find('.bxSlider').each(function(){
                var options = {
                        slideWidth: $(this).outerWidth(),
                        pager: false,
                        hideControlOnEnd: true,
                    },
                    nbCols = getNbColumns();
                if ($(this).parent().hasClass('long')) {
                    $.extend(options, {slideWidth: 2 * $(this).parents('.container-fluid').width() / (($(this).parents('.four-columns').length > 0 && nbCols == 5) ? 4 : nbCols) - 8});
                } else {
                    $.extend(options, {slideWidth: $(this).parents('.container-fluid').width() / (($(this).parents('.four-columns').length > 0 && nbCols == 5) ? 4 : nbCols)});
                }
                if ($(this).parent().hasClass('pager-buttons')) {
                    $.extend(options, {pager: true});
                }
                if ($(this).parent().hasClass('no-buttons')) {
                    $.extend(options, {controls: false});
                }
                if ($(this).parent().hasClass('autoplay')) {
                    $.extend(options, {auto: true});
                }
                if ($(this).parent().hasClass('infinite-loop')) {
                    $.extend(options, {infiniteLoop: true});
                }
                else {
                    $.extend(options, {infiniteLoop: false});
                }
                slidersList.push({
                    slider: $(this).bxSlider(options),
                    options: options
                });
            });
            // Reload every sliders when the orientationchange event is fired.
            $(window).on('orientationchange', function(){
                setTimeout(function () {
                    slidersList.forEach(function(element) {
                        // Retrieve stored options and change the slideWidth property
                        element.slider.reloadSlider($.extend(element.options, {
                            slideWidth: $(element.slider).parents('.block').outerWidth()
                        }));
                    });
                }, 100);
            });
        };

        //Handle the media subsystem slider
        (mediaSlider = function(context){
            $(context).find('.media-slider .bxSlider, .video-slider .bxSlider').each(function(){
                var self = $(this);
                self.bxSlider({
                    startSlide: 0,
                    pager: true,
                    controls: !self.parent().hasClass('no-buttons'),
                    auto: true,
                    infiniteLoop: true,
                    autoHover: true,
                    minSlides: 1,
                    maxSlides: 1
                })
            });
        })(this);

        //Handle the media subsystem slider
        /*(*/calendarSlider = function(context){
            //Handle sliders in the mini calendar
            $(context).find('.calendar-event.slider ul').each(function(){
                if($(this).parents('.atomic-container.hidden').length == 0){
                    $(this).bxSlider({
                        slideWidth: $(this).width(),
                        pager: false,
                        infiniteLoop: false,
                        hideControlOnEnd: true
                    });
                }
            });
        }/*)(this)*/;


        //Handle the button allowing to select/unselect every document in a document downloader
        $('.documents-download .toggle-select').click((function(){
            var isSelectAll = true;

            return function(event) {
                event.preventDefault();
                var currentText = $(this).text(),
                    toggleText = $(this).data().text;
                $(this).parents('.documents-download').find('input[type="checkbox"]').prop("checked", isSelectAll);
                $(this).text(toggleText);
                $(this).data().text = currentText;
                $(this).prop("data-text", currentText);

                isSelectAll = !isSelectAll;
                return false;
            }
        })());

        //Handle the scroll to top button;
        $('.scroll-top').each(function(){
            if( $(this).hasClass('floating-button')) {
                var isVisible = false,
                    threshold = 200,
                    button = $(this);
                $(window).scroll(function(){
                    if(isVisible && this.scrollY < threshold) {
                        button.fadeOut();
                        isVisible = false;
                    } else if(!isVisible && this.scrollY >= threshold) {
                        button.fadeIn();
                        isVisible = true;
                    }
                });
            }

            $(this).click(function(e){
                e.preventDefault();
                $('html,body').animate({scrollTop: 0});
                return false;
            });
        });

        //Handle the media-video-page slider
        $('.media-video-playlists .slider').each(function () {
            if(getNbColumns()>=4) {

                $(this).bxSlider({
                    minSlides: 4,
                    maxSlides: 4,
                    slideWidth: $(this).width() / 4,
                    slideMargin: 5,
                    infiniteLoop: false,
                    hideControlOnEnd: true,
                    pager: false
                });
            }
        });

        /*if($.browser.msie && $.browser.version == '8.0') {
         jQuery('.rte-circle').corner();
         }*/

    });

    function hideKeyboard(element) {
        element.attr('readonly', 'readonly'); // Force keyboard to hide on input field.
        element.attr('disabled', 'true'); // Force keyboard to hide on textarea field.
        setTimeout(function() {
            element.blur();  //actually close the keyboard
            // Remove readonly attribute after keyboard is hidden.
            element.removeAttr('readonly');
            element.removeAttr('disabled');
        }, 100);
    }

    // Activate bootstrap tooltip on readtime elements
    $(function () {
        $('.readtime').tooltip()
    })
})(jQuery);

/* !! Warning !! - Ugly fix-workaround : Hide specific option element from Thema Select */
(function($){
    $(function() {
        $('#edit-field-thema-terms-tid > option:contains("Security")').remove();
        $('#edit-field-thema-terms-tid > option:contains("Sécurité")').remove();
    });
})(jQuery);
;
(function ($) {
    Drupal.behaviors.safran_normalizeHeight = {
        attach: function (context, settings) {
            domReady(function () {
                var blocks = $('.block')
                    .filter(function () {
                        return $(this).parents('.block-wrapper').length <= 0;
                    })
                    .filter(function () {
                        return $(this).parents('.block.slider').length <= 0;
                    })
                    .filter(function () {
                        return $(this).parents('.content-head').length <= 0;
                    })
                    .filter(":not(.sommaire)");

                if (context === document && blocks) {
                    normalizeHeight(blocks);

                    $(window).on('orientationchange', function () {
                        setTimeout(function () {
                            normalizeHeight(blocks);
                        }, 100);
                    });
                }

                $(context).once('safran_normalizeHeight', function () {
                    normalizeHeight(blocks);
                });
            });

        }
    };
    Drupal.behaviors.safran_mediaSlider = {
        attach: function (context, settings) {
            domReady(function () {
                $(context).once('safran_mediaSlider', function () {
                    mediaSlider(context);
                });
            });

        }
    };
    Drupal.behaviors.safran_calendarSlider = {
        attach: function (context, settings) {
            domReady(function () {
                $('.calendar-wrapper').once('safran_calendarSlider', function () {
                    calendarSlider(context);
                });
            });
        }
    };
    Drupal.behaviors.safran_blockSlider = {
        attach: function (context, settings) {
            domReady(function () {
                var sliders = $('.block.slider, .block.slider-playlist')
                    .filter(function (){
                        return $(this).parents('.atomic-container.hidden').length <= 0;
                    })
                    .filter(function () {
                        return $(this).find('div.bx-wrapper div.bx-viewport').length <= 0;
                    });
                blockSlider(sliders);
            });
        }
    };
    Drupal.behaviors.safran_countdownBlock = {
        attach: function (context, settings) {
            domReady(function () {
                var blocks = $('.block')
                    .filter(function () {
                        return $(this).parents('.block.slider').length <= 0;
                    })
                    .filter(function () {
                        return $(this).parents('.content-head').length <= 0;
                    });

                if (context === document && blocks) {
                    initCountdownBlock(blocks);

                    $(window).on('orientationchange', function () {
                        setTimeout(function () {
                            initCountdownBlock(blocks);
                        }, 100);
                    });
                }

                $(context).once('safran_countdownBlock', function () {
                    initCountdownBlock(blocks);
                });
            });

        }
    };
    Drupal.behaviors.safran_quicksearch = {
        attach: function (context, settings) {
            domReady(function () {
                $('.job-offers-list ul.quick-search-links a').tooltip();
            });
        }
    };
})(jQuery);
;
//Handle grid/mosaic display
(function ($) {
    domReady(function () {
        var container = $('.content-body.layout .container-fluid.layout-container'),
            toggleContainer = $('.content-body.layout .toggle-layout'),
            margin = 5,
            padding = 0,
            isMosaic,
            constructMosaic = function (animation, rebuild) {
                container.removeClass('wall').addClass('mosaic');
                var currentButton = toggleContainer.find('.mosaic');
                currentButton.addClass('active').siblings().removeClass('active');

                if (isMosaic && !rebuild) return;


                if (!/(sp|xs)/.test(getWindowState())) {//animate the content-head only if we're not on mobile devices
                    $('.content-head').fadeIn(1000);
                    $('.social-hub-highlight').fadeIn(1000);
                    $('.content-body').removeAttr('style');
                }
                $('.atomic-container').each(function (index, atomicContainer) {
                    if ($(this).hasClass('4-columns') && getNbColumns() > 4) {
                        atomicContainer.nbColumns = 4;
                    } else {
                        atomicContainer.nbColumns = getNbColumns();
                    }
                    var atomicWidthWithMargin = container.width() / atomicContainer.nbColumns,
                        atomicWidth = atomicWidthWithMargin - 2 * margin;

                    var maxRow = 0;
                    $(this).find('.block-wrapper').each(function () {
                        if ($(this).children('.block').hasClass('selected') && atomicContainer.nbColumns > 2) {
                            if (animation) {
                                $(this).fadeOut();
                            } else {
                                $(this).hide();
                            }
                        } else {
                            var windowWidth = getWindowState();
                            var row = $(this).data()[windowWidth + 'Row'],
                                col = $(this).data()[windowWidth + 'Col'],
                                newHeight, newWidth;

                            if(row >= maxRow) { // Store the maximum row displayed. If this particular block is 2:2, then add 1 to maxRow.
                                maxRow = row + $(this).children('.block').hasClass('high');
                            }

                            //Default 1:1 format
                            newHeight = newWidth = atomicWidth - padding;
                            //if 2:1 or 2:2 format. Only for desktop and phablets
                            if (($(this).children('.block').hasClass('high') && $(this).children('.block').hasClass('long'))
                                || $(this).children('.block').hasClass('long') ) {
                                newWidth += atomicWidth + 2 * margin;
                            }
                            //if 2:2 format
                            if ($(this).children('.block').hasClass('high')) {
                                newHeight += atomicWidth + 2 * margin;
                            }

                            if($(this).hasClass('wall-hidden') && !$(this).hasClass('mosaic-unplaced')) {
                                $(this).show();
                            }

                            if (animation) {
                                $(this).animate({
                                    position: 'absolute',
                                    margin: margin,
                                    top: row * atomicWidthWithMargin,
                                    left: col * atomicWidthWithMargin,
                                    width: newWidth,
                                    height: newHeight
                                }, 500);
                            } else {
                                $(this).css({
                                    position: 'absolute',
                                    margin: margin,
                                    top: row * atomicWidthWithMargin,
                                    left: col * atomicWidthWithMargin,
                                    width: newWidth,
                                    height: newHeight
                                });
                            }
                        }
                    });

                    var nbLines = maxRow + 1;
                    $(this).height(nbLines * atomicWidthWithMargin);
                    if (nbLines * atomicWidthWithMargin > $(window).height()) {
                        atomicWidthWithMargin = container.width() / atomicContainer.nbColumns;
                        atomicWidth = atomicWidthWithMargin - 2 * margin;
                        $(this).height(nbLines * atomicWidthWithMargin);
                    }
                });

                isMosaic = true;
            },
            constructWall = function (animation, rebuild) {
                container.removeClass('mosaic').addClass('wall');
                var currentButton = toggleContainer.find('.wall');
                currentButton.addClass('active').siblings().removeClass('active');

                if (isMosaic == false && !rebuild) return;

                var columnNames = ["focus", "news", "social-media", "figures"],
                    maxElements = 0,
                    maxTitleHeight = 0,
                    atomicWidthWithMargin = container.width() / 4,
                    atomicWidth = atomicWidthWithMargin - 2 * margin,
                    columnTitleOffset = 0;

                for (var nthColumn = 0; nthColumn < columnNames.length; nthColumn++) {
                    var column = $('.atomic-container:not(.hidden) .column.' + columnNames[nthColumn]),
                        columnChildren = column.children('.block-wrapper:not(.wall-hidden)');
                    if (columnChildren.length > maxElements) {
                        maxElements = columnChildren.length;
                    }

                    var columnTitle = column.children('.column-title');
                    if( columnTitle.height() > maxTitleHeight) {
                        maxTitleHeight = columnTitle.height();
                    }
                }
                container.children().first().height(maxElements * atomicWidthWithMargin);
                container.children().first().siblings().height(0);
                if (maxElements * atomicWidthWithMargin > $(window).height()) {
                    atomicWidthWithMargin = container.width() / 4;
                    atomicWidth = atomicWidthWithMargin - 2 * margin;
                    $('.atomic-container:first-child').height(maxElements * Math.ceil(atomicWidthWithMargin) + maxTitleHeight);
                }
                for (nthColumn = 0; nthColumn < columnNames.length; nthColumn++) {
                    var nthElement = 0;

                    // Position column titles.
                    $('.atomic-container:first-child .column').each(function (index, column) {
                        var columnTitle = $(column).children('h2, .column-title');
                        if (columnTitle.length == 1) {
                            columnTitle.css('max-width', atomicWidth - padding);
                            columnTitle.css({
                                left: index * (atomicWidth - padding + 10) + (atomicWidth - columnTitle.width()) / 2
                            });
                            if (columnTitle.height() + 10 > columnTitleOffset) {
                                columnTitleOffset = columnTitle.height() + 10;
                            }
                        }
                    });


                    $('.atomic-container .column.' + columnNames[nthColumn] + ' .block-wrapper').each(function () {
                        if ($(this).children('.block').hasClass('selected')) {
                            $(this).css({
                                position: 'absolute',
                                margin: margin,
                                top: nthElement * atomicWidthWithMargin + columnTitleOffset,
                                left: nthColumn * atomicWidthWithMargin,
                                width: atomicWidth - padding,
                                height: atomicWidth - padding
                            });
                            if (animation) {
                                $(this).fadeIn(1000);
                                /*
                                 $('.content-head .selected-element').fadeOut(400, function(){
                                 $(this).parent().css({margin: 0});
                                 });
                                 */
                            } else {
                                $(this).show();
                                /*
                                 $('.content-head .selected-element').hide()
                                 .parent().css({margin: 0});
                                 */
                            }
                        } else if($(this).hasClass('wall-hidden')) {
                            if(animation) {
                                $(this).fadeOut(1000);
                            } else {
                                $(this).hide();
                            }
                        }
                        if (animation) {
                            $(this).animate({
                                top: nthElement * atomicWidthWithMargin + columnTitleOffset,
                                left: nthColumn * atomicWidthWithMargin,
                                width: atomicWidth - padding,
                                height: atomicWidth - padding
                            }, 500);
                        } else {
                            $(this).css({
                                top: nthElement * atomicWidthWithMargin + columnTitleOffset,
                                left: nthColumn * atomicWidthWithMargin,
                                width: atomicWidth - padding,
                                height: atomicWidth - padding
                            });
                        }
                        if(!$(this).hasClass('wall-hidden')){
                            nthElement++;
                        }
                    });
                }
                if (!/(sp|xs)/.test(getWindowState())) {//animate the content-head only if we're not on mobile devices
                    $('.content-head').fadeOut(1000, function () {
                        $('.content-body').css({'padding-top': '50px'});
                    });
                    $('.social-hub-highlight').fadeOut(1000);
                }

                isMosaic = false;
            };

        //Initiate layout build & the toggle switch
        var search = window.location.search;//Get GET query string
        //Retrieve (if existing) 'layout' variable in search with its value
        var layout = "";
        search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
            if (key == 'layout') {
                layout = value;
            }
        });
        switch (layout) {
            case 'wall':
                constructWall();
                break;
            default:
                constructMosaic();
                break;
        }

        toggleContainer.find('.layout.wall').click(function (event) {
            event.preventDefault()
            constructWall(true);
            return false;
        });
        toggleContainer.find('.layout.mosaic').click(function (event) {
            event.preventDefault()
            constructMosaic(true);
            return false;
        });
        $(window).on('orientationchange', function () {
            setTimeout(function () {
                if (isMosaic) {
                    constructMosaic(false, true);
                } else {
                    constructWall(false, true);
                }
            }, 100);
        });


        $('.load-more-blocks').click(function () {
            $(this).addClass('hidden');

            var hiddenContainer = $(this).next('.atomic-container.hidden');
            hiddenContainer.removeClass('hidden');
            if ($('.content-body.layout .container-fluid').hasClass('wall')) {
                constructWall(true, true);
            }

            calendarSlider(hiddenContainer);
            var blocks = $(hiddenContainer).find('.block.slider, .block.slider-playlist');
            blockSlider(blocks);

            return false;
        });
    });
}(jQuery));
;
/* ----------------
ResponsiveTabs.js
Author: Pete Love | www.petelove.com
Version: 1.10
------------------- */

(function($) {
    $(document).ready(function () {
		var $tabSets = $('.responsive-tabs');

		if (!$tabSets.hasClass('responsive-tabs--enabled')) {	// if we haven't already called this function and enabled tabs
			$tabSets.addClass('responsive-tabs--enabled'); 

			//loop through all sets of tabs on the page
			var tablistcount = 1;

			$tabSets.each(function() {

				var $tabs = $(this);

				// add tab heading and tab panel classes
				// $tabs.children(':header').addClass('responsive-tabs__heading').append('<i class="icon-caret-right pull-right"></i>');
				$tabs.children('.responsive-tab-title').addClass('responsive-tabs__heading').append('<i class="icon-caret-right pull-right"></i>');
				$tabs.children('div:not(.responsive-tab-title)').addClass('responsive-tabs__panel');

				// determine if markup already identifies the active tab panel for this set of tabs
				// if not then set first heading and tab to be the active one
				var $activePanel = $tabs.find('.responsive-tabs__panel--active');
				if(!$activePanel.length) {
					$activePanel = $tabs.find('.responsive-tabs__panel').first().addClass('responsive-tabs__panel--active');
				}

				$tabs.find('.responsive-tabs__panel').not('.responsive-tabs__panel--active').hide().attr('aria-hidden','true'); //hide all except active panel
				$activePanel.attr('aria-hidden', 'false');
				/* make active tab panel hidden for mobile */
				$activePanel.addClass('responsive-tabs__panel--closed-accordion-only');

				// wrap tabs in container - to be dynamically resized to help prevent page jump
				var $tabsWrapper = $('<div/>', {'class': 'responsive-tabs-wrapper' });
				$tabs.wrap($tabsWrapper);

				var highestHeight = 0;

				// determine height of tallest tab panel. Used later to prevent page jump when tabs are clicked
				$tabs.find('.responsive-tabs__panel').each(function() {
					var tabHeight = $(this).height();
					if (tabHeight > highestHeight) {
						highestHeight = tabHeight;
					}
				});

				//create the tab list
				var $tabList = $('<ul/>', { 'class': 'responsive-tabs__list nav nav-tabs', 'role': 'tablist' });

				//loop through each heading in set
				var tabcount = 1;
				$tabs.find('.responsive-tabs__heading').each(function() {

					var $tabHeading = $(this);
					var $tabPanel = $(this).next();

					$tabHeading.attr('tabindex', 0);

					// CREATE TAB ITEMS (VISIBLE ON DESKTOP)
					//create tab list item from heading
					//associate tab list item with tab panel
					var $tabListItem = $('<li/>', { 
						'class': 'responsive-tabs__list__item',
						id: 'tablist' + tablistcount + '-tab' + tabcount,
						'aria-controls': 'tablist' + tablistcount +'-panel' + tabcount,
						'role': 'tab',
						tabindex: 0,
						keydown: function (objEvent) {
							if (objEvent.keyCode === 13) { // if user presses 'enter'
								$tabListItem.mousedown();
							}
						},
						mousedown: function(e) {
							e.preventDefault();
							//Show associated panel

							//set height of tab container to highest panel height to avoid page jump
							$tabsWrapper.css('height', highestHeight);

							// remove hidden mobile class from any other panel as we'll want that panel to be open at mobile size
							$tabs.find('.responsive-tabs__panel--closed-accordion-only').removeClass('responsive-tabs__panel--closed-accordion-only');
							
							// close current panel and remove active state from its (hidden on desktop) heading
							$tabs.find('.responsive-tabs__panel--active').toggle().removeClass('responsive-tabs__panel--active').attr('aria-hidden','true').prev().removeClass('responsive-tabs__heading--active');
							
							//make this tab panel active
							$tabPanel.toggle().addClass('responsive-tabs__panel--active').attr('aria-hidden','false');

							//make the hidden heading active
							$tabHeading.addClass('responsive-tabs__heading--active');

							//remove active state from currently active tab list item
							$tabList.find('.responsive-tabs__list__item--active').removeClass('responsive-tabs__list__item--active active');

							//make this tab active
							$tabListItem.addClass('responsive-tabs__list__item--active active');

							//reset height of tab panels to auto
							$tabsWrapper.css('height', 'auto');
						}
					});
					$('<a>').text( $tabHeading.text() ).appendTo( $tabListItem );
					
					//associate tab panel with tab list item
					$tabPanel.attr({
						'role': 'tabpanel',
						'aria-labelledby': $tabListItem.attr('id'),
						id: 'tablist' + tablistcount + '-panel' + tabcount
					});

					// if this is the active panel then make it the active tab item
					if($tabPanel.hasClass('responsive-tabs__panel--active')) {
						$tabListItem.addClass('responsive-tabs__list__item--active active');
					}

					// add tab item
					$tabList.append($tabListItem);

					
					// TAB HEADINGS (VISIBLE ON MOBILE)
					// if user presses 'enter' on tab heading trigger the click event
					$tabHeading.keydown(function(objEvent) {
						if (objEvent.keyCode === 13) {
							$tabHeading.mousedown();
						}
					});

					//toggle tab panel if click heading (on mobile)
					$tabHeading.mousedown(function(e) {
						e.preventDefault();
						// remove any hidden mobile class
						$tabs.find('.responsive-tabs__panel--closed-accordion-only').removeClass('responsive-tabs__panel--closed-accordion-only');

						// if this isn't currently active
						if (!$tabHeading.hasClass('responsive-tabs__heading--active')){

							var oldActivePos,
								$activeHeading = $tabs.find('.responsive-tabs__heading--active');
								
							// if there is an active heading, get its position
							if($activeHeading.length) {
								oldActivePos = $activeHeading.offset().top;
							}
							
							// close currently active panel and remove active state from any hidden heading
							$tabs.find('.responsive-tabs__panel--active').slideToggle().removeClass('responsive-tabs__panel--active').prev().removeClass('responsive-tabs__heading--active');
							
							//close all tabs
							$tabs.find('.responsive-tabs__panel').hide().attr('aria-hidden','true');

							//open this panel
							$tabPanel.slideToggle().addClass('responsive-tabs__panel--active').attr('aria-hidden','false');

							// make this heading active
							$tabHeading.addClass('responsive-tabs__heading--active');

							var $currentActive = $tabs.find('.responsive-tabs__list__item--active');

							//set the active tab list item (for desktop)
							$currentActive.removeClass('responsive-tabs__list__item--active');
							var panelId = $tabPanel.attr('id');
							var tabId = panelId.replace('panel','tab');
							$('#' + tabId).addClass('responsive-tabs__list__item--active');

							//scroll to active heading only if it is below previous one
							var tabsPos = $tabs.offset().top;
							var newActivePos = ($tabHeading.offset().top) - 15;
							if(oldActivePos < newActivePos) {
								$('html, body').animate({ scrollTop: tabsPos }, 0).animate({ scrollTop: newActivePos }, 400);
							}
							
						}

						// if this tab panel is already active
						else {

							// hide panel but give it special responsive-tabs__panel--closed-accordion-only class so that it can be visible at desktop size
							$tabPanel.removeClass('responsive-tabs__panel--active').slideToggle(function () { $(this).addClass('responsive-tabs__panel--closed-accordion-only'); });

							//remove active heading class
							$tabHeading.removeClass('responsive-tabs__heading--active');

							//don't alter classes on tabs as we want it active if put back to desktop size
						}
						
					});

					tabcount ++;

				});

				// add finished tab list to its container
				$tabs.prepend($tabList);

				// next set of tabs on page
				tablistcount ++;
			});
		}
	});
})(jQuery);
;
/* Placeholders.js v3.0.2 */
(function(t){"use strict";function e(t,e,r){return t.addEventListener?t.addEventListener(e,r,!1):t.attachEvent?t.attachEvent("on"+e,r):void 0}function r(t,e){var r,n;for(r=0,n=t.length;n>r;r++)if(t[r]===e)return!0;return!1}function n(t,e){var r;t.createTextRange?(r=t.createTextRange(),r.move("character",e),r.select()):t.selectionStart&&(t.focus(),t.setSelectionRange(e,e))}function a(t,e){try{return t.type=e,!0}catch(r){return!1}}t.Placeholders={Utils:{addEventListener:e,inArray:r,moveCaret:n,changeType:a}}})(this),function(t){"use strict";function e(){}function r(){try{return document.activeElement}catch(t){}}function n(t,e){var r,n,a=!!e&&t.value!==e,u=t.value===t.getAttribute(V);return(a||u)&&"true"===t.getAttribute(P)?(t.removeAttribute(P),t.value=t.value.replace(t.getAttribute(V),""),t.className=t.className.replace(R,""),n=t.getAttribute(z),parseInt(n,10)>=0&&(t.setAttribute("maxLength",n),t.removeAttribute(z)),r=t.getAttribute(D),r&&(t.type=r),!0):!1}function a(t){var e,r,n=t.getAttribute(V);return""===t.value&&n?(t.setAttribute(P,"true"),t.value=n,t.className+=" "+I,r=t.getAttribute(z),r||(t.setAttribute(z,t.maxLength),t.removeAttribute("maxLength")),e=t.getAttribute(D),e?t.type="text":"password"===t.type&&K.changeType(t,"text")&&t.setAttribute(D,"password"),!0):!1}function u(t,e){var r,n,a,u,i,l,o;if(t&&t.getAttribute(V))e(t);else for(a=t?t.getElementsByTagName("input"):f,u=t?t.getElementsByTagName("textarea"):h,r=a?a.length:0,n=u?u.length:0,o=0,l=r+n;l>o;o++)i=r>o?a[o]:u[o-r],e(i)}function i(t){u(t,n)}function l(t){u(t,a)}function o(t){return function(){b&&t.value===t.getAttribute(V)&&"true"===t.getAttribute(P)?K.moveCaret(t,0):n(t)}}function c(t){return function(){a(t)}}function s(t){return function(e){return A=t.value,"true"===t.getAttribute(P)&&A===t.getAttribute(V)&&K.inArray(C,e.keyCode)?(e.preventDefault&&e.preventDefault(),!1):void 0}}function d(t){return function(){n(t,A),""===t.value&&(t.blur(),K.moveCaret(t,0))}}function v(t){return function(){t===r()&&t.value===t.getAttribute(V)&&"true"===t.getAttribute(P)&&K.moveCaret(t,0)}}function g(t){return function(){i(t)}}function p(t){t.form&&(T=t.form,"string"==typeof T&&(T=document.getElementById(T)),T.getAttribute(U)||(K.addEventListener(T,"submit",g(T)),T.setAttribute(U,"true"))),K.addEventListener(t,"focus",o(t)),K.addEventListener(t,"blur",c(t)),b&&(K.addEventListener(t,"keydown",s(t)),K.addEventListener(t,"keyup",d(t)),K.addEventListener(t,"click",v(t))),t.setAttribute(j,"true"),t.setAttribute(V,x),(b||t!==r())&&a(t)}var f,h,b,m,A,y,E,x,L,T,S,N,w,B=["text","search","url","tel","email","password","number","textarea"],C=[27,33,34,35,36,37,38,39,40,8,46],k="#ccc",I="placeholdersjs",R=RegExp("(?:^|\\s)"+I+"(?!\\S)"),V="data-placeholder-value",P="data-placeholder-active",D="data-placeholder-type",U="data-placeholder-submit",j="data-placeholder-bound",q="data-placeholder-focus",Q="data-placeholder-live",z="data-placeholder-maxlength",F=document.createElement("input"),G=document.getElementsByTagName("head")[0],H=document.documentElement,J=t.Placeholders,K=J.Utils;if(J.nativeSupport=void 0!==F.placeholder,!J.nativeSupport){for(f=document.getElementsByTagName("input"),h=document.getElementsByTagName("textarea"),b="false"===H.getAttribute(q),m="false"!==H.getAttribute(Q),y=document.createElement("style"),y.type="text/css",E=document.createTextNode("."+I+" { color:"+k+"; }"),y.styleSheet?y.styleSheet.cssText=E.nodeValue:y.appendChild(E),G.insertBefore(y,G.firstChild),w=0,N=f.length+h.length;N>w;w++)S=f.length>w?f[w]:h[w-f.length],x=S.attributes.placeholder,x&&(x=x.nodeValue,x&&K.inArray(B,S.type)&&p(S));L=setInterval(function(){for(w=0,N=f.length+h.length;N>w;w++)S=f.length>w?f[w]:h[w-f.length],x=S.attributes.placeholder,x?(x=x.nodeValue,x&&K.inArray(B,S.type)&&(S.getAttribute(j)||p(S),(x!==S.getAttribute(V)||"password"===S.type&&!S.getAttribute(D))&&("password"===S.type&&!S.getAttribute(D)&&K.changeType(S,"text")&&S.setAttribute(D,"password"),S.value===S.getAttribute(V)&&(S.value=x),S.setAttribute(V,x)))):S.getAttribute(P)&&(n(S),S.removeAttribute(V));m||clearInterval(L)},100)}K.addEventListener(t,"beforeunload",function(){J.disable()}),J.disable=J.nativeSupport?e:i,J.enable=J.nativeSupport?e:l}(this),function(t){"use strict";var e=t.fn.val,r=t.fn.prop;Placeholders.nativeSupport||(t.fn.val=function(t){var r=e.apply(this,arguments),n=this.eq(0).data("placeholder-value");return void 0===t&&this.eq(0).data("placeholder-active")&&r===n?"":r},t.fn.prop=function(t,e){return void 0===e&&this.eq(0).data("placeholder-active")&&"value"===t?"":r.apply(this,arguments)})}(jQuery);;
/*!
 * jQuery corner plugin: simple corner rounding
 * Examples and documentation at: http://jquery.malsup.com/corner/
 * version 2.13 (19-FEB-2013)
 * Requires jQuery v1.3.2 or later
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 * Authors: Dave Methvin and Mike Alsup
 */

/**
 *  corner() takes a single string argument:  $('#myDiv').corner("effect corners width")
 *
 *  effect:  name of the effect to apply, such as round, bevel, notch, bite, etc (default is round). 
 *  corners: one or more of: top, bottom, tr, tl, br, or bl.  (default is all corners)
 *  width:   width of the effect; in the case of rounded corners this is the radius. 
 *           specify this value using the px suffix such as 10px (yes, it must be pixels).
 */
;(function($) { 

var msie = /MSIE/.test(navigator.userAgent);

var style = document.createElement('div').style,
    moz = style['MozBorderRadius'] !== undefined,
    webkit = style['WebkitBorderRadius'] !== undefined,
    radius = style['borderRadius'] !== undefined || style['BorderRadius'] !== undefined,
    mode = document.documentMode || 0,
    noBottomFold = msie && (!mode || mode < 8),

    expr = msie && (function() {
        var div = document.createElement('div');
        try { div.style.setExpression('width','0+0'); div.style.removeExpression('width'); }
        catch(e) { return false; }
        return true;
    })();

$.support = $.support || {};
$.support.borderRadius = moz || webkit || radius; // so you can do:  if (!$.support.borderRadius) $('#myDiv').corner();

function sz(el, p) { 
    return parseInt($.css(el,p),10)||0; 
}
function hex2(s) {
    s = parseInt(s,10).toString(16);
    return ( s.length < 2 ) ? '0'+s : s;
}
function gpc(node) {
    while(node) {
        var v = $.css(node,'backgroundColor'), rgb;
        if (v && v != 'transparent' && v != 'rgba(0, 0, 0, 0)') {
            if (v.indexOf('rgb') >= 0) { 
                rgb = v.match(/\d+/g); 
                return '#'+ hex2(rgb[0]) + hex2(rgb[1]) + hex2(rgb[2]);
            }
            return v;
        }
        if (node.nodeName.toLowerCase() == 'html')
            break;
        node = node.parentNode; // keep walking if transparent
    }
    return '#ffffff';
}

function getWidth(fx, i, width) {
    switch(fx) {
    case 'round':  return Math.round(width*(1-Math.cos(Math.asin(i/width))));
    case 'cool':   return Math.round(width*(1+Math.cos(Math.asin(i/width))));
    case 'sharp':  return width-i;
    case 'bite':   return Math.round(width*(Math.cos(Math.asin((width-i-1)/width))));
    case 'slide':  return Math.round(width*(Math.atan2(i,width/i)));
    case 'jut':    return Math.round(width*(Math.atan2(width,(width-i-1))));
    case 'curl':   return Math.round(width*(Math.atan(i)));
    case 'tear':   return Math.round(width*(Math.cos(i)));
    case 'wicked': return Math.round(width*(Math.tan(i)));
    case 'long':   return Math.round(width*(Math.sqrt(i)));
    case 'sculpt': return Math.round(width*(Math.log((width-i-1),width)));
    case 'dogfold':
    case 'dog':    return (i&1) ? (i+1) : width;
    case 'dog2':   return (i&2) ? (i+1) : width;
    case 'dog3':   return (i&3) ? (i+1) : width;
    case 'fray':   return (i%2)*width;
    case 'notch':  return width; 
    case 'bevelfold':
    case 'bevel':  return i+1;
    case 'steep':  return i/2 + 1;
    case 'invsteep':return (width-i)/2+1;
    }
}

$.fn.corner = function(options) {
    // in 1.3+ we can fix mistakes with the ready state
    if (this.length === 0) {
        if (!$.isReady && this.selector) {
            var s = this.selector, c = this.context;
            $(function() {
                $(s,c).corner(options);
            });
        }
        return this;
    }

    return this.each(function(index){
        var $this = $(this),
            // meta values override options
            o = [$this.attr($.fn.corner.defaults.metaAttr) || '', options || ''].join(' ').toLowerCase(),
            keep = /keep/.test(o),                       // keep borders?
            cc = ((o.match(/cc:(#[0-9a-f]+)/)||[])[1]),  // corner color
            sc = ((o.match(/sc:(#[0-9a-f]+)/)||[])[1]),  // strip color
            width = parseInt((o.match(/(\d+)px/)||[])[1],10) || 10, // corner width
            re = /round|bevelfold|bevel|notch|bite|cool|sharp|slide|jut|curl|tear|fray|wicked|sculpt|long|dog3|dog2|dogfold|dog|invsteep|steep/,
            fx = ((o.match(re)||['round'])[0]),
            fold = /dogfold|bevelfold/.test(o),
            edges = { T:0, B:1 },
            opts = {
                TL:  /top|tl|left/.test(o),       TR:  /top|tr|right/.test(o),
                BL:  /bottom|bl|left/.test(o),    BR:  /bottom|br|right/.test(o)
            },
            // vars used in func later
            strip, pad, cssHeight, j, bot, d, ds, bw, i, w, e, c, common, $horz;
        
        if ( !opts.TL && !opts.TR && !opts.BL && !opts.BR )
            opts = { TL:1, TR:1, BL:1, BR:1 };
            
        // support native rounding
        if ($.fn.corner.defaults.useNative && fx == 'round' && (radius || moz || webkit) && !cc && !sc) {
            if (opts.TL)
                $this.css(radius ? 'border-top-left-radius' : moz ? '-moz-border-radius-topleft' : '-webkit-border-top-left-radius', width + 'px');
            if (opts.TR)
                $this.css(radius ? 'border-top-right-radius' : moz ? '-moz-border-radius-topright' : '-webkit-border-top-right-radius', width + 'px');
            if (opts.BL)
                $this.css(radius ? 'border-bottom-left-radius' : moz ? '-moz-border-radius-bottomleft' : '-webkit-border-bottom-left-radius', width + 'px');
            if (opts.BR)
                $this.css(radius ? 'border-bottom-right-radius' : moz ? '-moz-border-radius-bottomright' : '-webkit-border-bottom-right-radius', width + 'px');
            return;
        }
            
        strip = document.createElement('div');
        $(strip).css({
            overflow: 'hidden',
            height: '1px',
            minHeight: '1px',
            fontSize: '1px',
            backgroundColor: sc || 'transparent',
            borderStyle: 'solid'
        });
    
        pad = {
            T: parseInt($.css(this,'paddingTop'),10)||0,     R: parseInt($.css(this,'paddingRight'),10)||0,
            B: parseInt($.css(this,'paddingBottom'),10)||0,  L: parseInt($.css(this,'paddingLeft'),10)||0
        };

        if (typeof this.style.zoom !== undefined) this.style.zoom = 1; // force 'hasLayout' in IE
        if (!keep) this.style.border = 'none';
        strip.style.borderColor = cc || gpc(this.parentNode);
        cssHeight = $(this).outerHeight();

        for (j in edges) {
            bot = edges[j];
            // only add stips if needed
            if ((bot && (opts.BL || opts.BR)) || (!bot && (opts.TL || opts.TR))) {
                strip.style.borderStyle = 'none '+(opts[j+'R']?'solid':'none')+' none '+(opts[j+'L']?'solid':'none');
                d = document.createElement('div');
                $(d).addClass('jquery-corner');
                ds = d.style;

                bot ? this.appendChild(d) : this.insertBefore(d, this.firstChild);

                if (bot && cssHeight != 'auto') {
                    if ($.css(this,'position') == 'static')
                        this.style.position = 'relative';
                    ds.position = 'absolute';
                    ds.bottom = ds.left = ds.padding = ds.margin = '0';
                    if (expr)
                        ds.setExpression('width', 'this.parentNode.offsetWidth');
                    else
                        ds.width = '100%';
                }
                else if (!bot && msie) {
                    if ($.css(this,'position') == 'static')
                        this.style.position = 'relative';
                    ds.position = 'absolute';
                    ds.top = ds.left = ds.right = ds.padding = ds.margin = '0';
                    
                    // fix ie6 problem when blocked element has a border width
                    if (expr) {
                        bw = sz(this,'borderLeftWidth') + sz(this,'borderRightWidth');
                        ds.setExpression('width', 'this.parentNode.offsetWidth - '+bw+'+ "px"');
                    }
                    else
                        ds.width = '100%';
                }
                else {
                    ds.position = 'relative';
                    ds.margin = !bot ? '-'+pad.T+'px -'+pad.R+'px '+(pad.T-width)+'px -'+pad.L+'px' : 
                                        (pad.B-width)+'px -'+pad.R+'px -'+pad.B+'px -'+pad.L+'px';                
                }

                for (i=0; i < width; i++) {
                    w = Math.max(0,getWidth(fx,i, width));
                    e = strip.cloneNode(false);
                    e.style.borderWidth = '0 '+(opts[j+'R']?w:0)+'px 0 '+(opts[j+'L']?w:0)+'px';
                    bot ? d.appendChild(e) : d.insertBefore(e, d.firstChild);
                }
                
                if (fold && $.support.boxModel) {
                    if (bot && noBottomFold) continue;
                    for (c in opts) {
                        if (!opts[c]) continue;
                        if (bot && (c == 'TL' || c == 'TR')) continue;
                        if (!bot && (c == 'BL' || c == 'BR')) continue;
                        
                        common = { position: 'absolute', border: 'none', margin: 0, padding: 0, overflow: 'hidden', backgroundColor: strip.style.borderColor };
                        $horz = $('<div/>').css(common).css({ width: width + 'px', height: '1px' });
                        switch(c) {
                        case 'TL': $horz.css({ bottom: 0, left: 0 }); break;
                        case 'TR': $horz.css({ bottom: 0, right: 0 }); break;
                        case 'BL': $horz.css({ top: 0, left: 0 }); break;
                        case 'BR': $horz.css({ top: 0, right: 0 }); break;
                        }
                        d.appendChild($horz[0]);
                        
                        var $vert = $('<div/>').css(common).css({ top: 0, bottom: 0, width: '1px', height: width + 'px' });
                        switch(c) {
                        case 'TL': $vert.css({ left: width }); break;
                        case 'TR': $vert.css({ right: width }); break;
                        case 'BL': $vert.css({ left: width }); break;
                        case 'BR': $vert.css({ right: width }); break;
                        }
                        d.appendChild($vert[0]);
                    }
                }
            }
        }
    });
};

$.fn.uncorner = function() { 
    if (radius || moz || webkit)
        this.css(radius ? 'border-radius' : moz ? '-moz-border-radius' : '-webkit-border-radius', 0);
    $('div.jquery-corner', this).remove();
    return this;
};

// expose options
$.fn.corner.defaults = {
    useNative: true, // true if plugin should attempt to use native browser support for border radius rounding
    metaAttr:  'data-corner' // name of meta attribute to use for options
};
    
})(jQuery);
;
/*
 * Pause jQuery plugin v0.1
 *
 * Copyright 2010 by Tobia Conforto <tobia.conforto@gmail.com>
 *
 * Based on Pause-resume-animation jQuery plugin by Joe Weitzel
 *
 * This program is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by the Free
 * Software Foundation; either version 2 of the License, or(at your option)
 * any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
 * more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * this program; if not, write to the Free Software Foundation, Inc., 51
 * Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
 */
(function(){var e=jQuery,f="jQuery.pause",d=1,b=e.fn.animate,a={};function c(){return new Date().getTime()}e.fn.animate=function(k,h,j,i){var g=e.speed(h,j,i);g.complete=g.old;return this.each(function(){if(!this[f]){this[f]=d++}var l=e.extend({},g);b.apply(e(this),[k,e.extend({},l)]);a[this[f]]={run:true,prop:k,opt:l,start:c(),done:0}})};e.fn.pause=function(){return this.each(function(){if(!this[f]){this[f]=d++}var g=a[this[f]];if(g&&g.run){g.done+=c()-g.start;if(g.done>g.opt.duration){delete a[this[f]]}else{e(this).stop();g.run=false}}})};e.fn.resume=function(){return this.each(function(){if(!this[f]){this[f]=d++}var g=a[this[f]];if(g&&!g.run){g.opt.duration-=g.done;g.done=0;g.run=true;g.start=c();b.apply(e(this),[g.prop,e.extend({},g.opt)])}})}})();
;
/**
 * jQuery.marquee - scrolling text like old marquee element
 * @author Aamir Afridi - aamirafridi(at)gmail(dot)com / http://aamirafridi.com/jquery/jquery-marquee-plugin
 */
;(function(e){e.fn.marquee=function(t){return this.each(function(){var n=e.extend({},e.fn.marquee.defaults,t),r=e(this),i,s,o,u,a,f=3,l="animation-play-state",c=false,h=function(e,t,n){var r=["webkit","moz","MS","o",""];for(var i=0;i<r.length;i++){if(!r[i])t=t.toLowerCase();e.addEventListener(r[i]+t,n,false)}},p=function(e){var t=[];for(var n in e){if(e.hasOwnProperty(n)){t.push(n+":"+e[n])}}t.push();return"{"+t.join(",")+"}"},d=function(){r.timer=setTimeout(M,n.delayBeforeStart)},v={pause:function(){if(c&&n.allowCss3Support){i.css(l,"paused")}else{if(e.fn.pause){i.pause()}}r.data("runningStatus","paused");r.trigger("paused")},resume:function(){if(c&&n.allowCss3Support){i.css(l,"running")}else{if(e.fn.resume){i.resume()}}r.data("runningStatus","resumed");r.trigger("resumed")},toggle:function(){v[r.data("runningStatus")=="resumed"?"pause":"resume"]()},destroy:function(){clearTimeout(r.timer);r.find("*").andSelf().unbind();r.html(r.find(".js-marquee:first").html())}};if(typeof t==="string"){if(e.isFunction(v[t])){if(!i){i=r.find(".js-marquee-wrapper")}if(r.data("css3AnimationIsSupported")===true){c=true}v[t]()}return}var m={},g;e.each(n,function(e,t){g=r.attr("data-"+e);if(typeof g!=="undefined"){switch(g){case"true":g=true;break;case"false":g=false;break}n[e]=g}});n.duration=n.speed||n.duration;u=n.direction=="up"||n.direction=="down";n.gap=n.duplicated?parseInt(n.gap):0;r.wrapInner('<div class="js-marquee"></div>');var y=r.find(".js-marquee").css({"margin-right":n.gap,"float":"left"});if(n.duplicated){y.clone(true).appendTo(r)}r.wrapInner('<div style="width:100000px" class="js-marquee-wrapper"></div>');i=r.find(".js-marquee-wrapper");if(u){var b=r.height();i.removeAttr("style");r.height(b);r.find(".js-marquee").css({"float":"none","margin-bottom":n.gap,"margin-right":0});if(n.duplicated)r.find(".js-marquee:last").css({"margin-bottom":0});var w=r.find(".js-marquee:first").height()+n.gap;n.duration=(parseInt(w,10)+parseInt(b,10))/parseInt(b,10)*n.duration}else{a=r.find(".js-marquee:first").width()+n.gap;s=r.width();n.duration=(parseInt(a,10)+parseInt(s,10))/parseInt(s,10)*n.duration}if(n.duplicated){n.duration=n.duration/2}if(n.allowCss3Support){var E=document.body||document.createElement("div"),S="marqueeAnimation-"+Math.floor(Math.random()*1e7),x="Webkit Moz O ms Khtml".split(" "),T="animation",N="",C="";if(E.style.animation){C="@keyframes "+S+" ";c=true}if(c===false){for(var k=0;k<x.length;k++){if(E.style[x[k]+"AnimationName"]!==undefined){var L="-"+x[k].toLowerCase()+"-";T=L+T;l=L+l;C="@"+L+"keyframes "+S+" ";c=true;break}}}if(c){N=S+" "+n.duration/1e3+"s "+n.delayBeforeStart/1e3+"s infinite "+n.css3easing;r.data("css3AnimationIsSupported",true)}}var A=function(){i.css("margin-top",n.direction=="up"?b+"px":"-"+w+"px")},O=function(){i.css("margin-left",n.direction=="left"?s+"px":"-"+a+"px")};if(n.duplicated){if(u){i.css("margin-top",n.direction=="up"?b:"-"+(w*2-n.gap)+"px")}else{i.css("margin-left",n.direction=="left"?s+"px":"-"+(a*2-n.gap)+"px")}f=1}else{if(u){A()}else{O()}}var M=function(){if(n.duplicated){if(f===1){n._originalDuration=n.duration;if(u){n.duration=n.direction=="up"?n.duration+b/(w/n.duration):n.duration*2}else{n.duration=n.direction=="left"?n.duration+s/(a/n.duration):n.duration*2}if(N){N=S+" "+n.duration/1e3+"s "+n.delayBeforeStart/1e3+"s "+n.css3easing}f++}else if(f===2){n.duration=n._originalDuration;if(N){S=S+"0";C=e.trim(C)+"0 ";N=S+" "+n.duration/1e3+"s 0s infinite "+n.css3easing}f++}}if(u){if(n.duplicated){if(f>2){i.css("margin-top",n.direction=="up"?0:"-"+w+"px")}o={"margin-top":n.direction=="up"?"-"+w+"px":0}}else{A();o={"margin-top":n.direction=="up"?"-"+i.height()+"px":b+"px"}}}else{if(n.duplicated){if(f>2){i.css("margin-left",n.direction=="left"?0:"-"+a+"px")}o={"margin-left":n.direction=="left"?"-"+a+"px":0}}else{O();o={"margin-left":n.direction=="left"?"-"+a+"px":s+"px"}}}r.trigger("beforeStarting");if(c){i.css(T,N);var t=C+" { 100%  "+p(o)+"}",l=e("style");if(l.length!==0){l.filter(":last").append(t)}else{e("head").append("<style>"+t+"</style>")}h(i[0],"AnimationIteration",function(){r.trigger("finished")});h(i[0],"AnimationEnd",function(){M();r.trigger("finished")})}else{i.animate(o,n.duration,n.easing,function(){r.trigger("finished");if(n.pauseOnCycle){d()}else{M()}})}r.data("runningStatus","resumed")};r.bind("pause",v.pause);r.bind("resume",v.resume);if(n.pauseOnHover){r.bind("mouseenter mouseleave",v.toggle)}if(c&&n.allowCss3Support){M()}else{d()}})};e.fn.marquee.defaults={allowCss3Support:true,css3easing:"linear",easing:"linear",delayBeforeStart:1e3,direction:"left",duplicated:false,duration:5e3,gap:20,pauseOnCycle:false,pauseOnHover:false}})(jQuery);
;
(function($){

	Drupal.SafranSH = {};

	Drupal.SafranSH.recalcGrid = function(){
		var container = $('#socialhub_list'),
			posts = container.find('.socialhub-grid--item'),
			gutter = 8,
			containerWidth = $(container).width(),
			columns = getNbColumns(), // Safran function
			postWidth = (containerWidth-((columns-1)*gutter))/columns;

		// Adjust posts width according to number of columns and gutter
		posts.css({width: parseInt(postWidth), height: parseInt(postWidth), margin: gutter/2+'px 0', border: '0 none'});
		if(columns > 2){
			posts.filter('.promoted:nth-child(1), .promoted:nth-child(15)').css({width: parseInt((postWidth*2)+gutter), height: parseInt((postWidth*2)+gutter), margin: gutter/2+'px 0'});
		 }

		// Build Masonry grid
		if(typeof Masonry !== 'undefined'){
			var msnry = new Masonry('#socialhub_list', {
				columnWidth: posts[5], // Set width reference from a post that is not promoted
				itemSelector: '.socialhub-grid--item',
				gutter: gutter
			});
		}
	}

	// Adjust Shadowbox iframe and content for better responsive design aspect
	Drupal.SafranSH.adjustPostLayer = function(){
		var shadowboxWrapper = $('#sb-wrapper', window.parent.document),
			shadowboxWrapperInner = $('#sb-wrapper-inner', window.parent.document);

		// If image is taller than iframe, constrict image
		if($('.field-name-field-socialhub-image img').height() > $('html').height()){
   			$('.field-name-field-socialhub-image img').height($('html').height());
   		}
   		// If post's main content contains body field and it is smaller than iframe, adjust it to iframe's height
   		if($('.socialhub-post--main-content .field-name-body').length > 0 && $('.socialhub-post--main-content').height() < $('html').height()){
   			$('.socialhub-post--main-content').height($('html').height() + $('.socialhub-post--follow').outerHeight());
   		}
   		// If shadowbox wrapper is taller than post, decrease his height to avoid white gap
   		if(shadowboxWrapperInner.height() > $('html').height()){
   			shadowboxWrapperInner.height($('html').height());
   		}
   		// If infos column is overlayed by follow link, decrease height of body (scroll will appear on overflow-y)
   		if($('.socialhub-post--follow').length > 0 && $('.socialhub-post--infos').outerHeight()-20 > $('.socialhub-post--follow').offset().top){
       		var gap = $('.socialhub-post--infos').outerHeight() - $('.socialhub-post--infos .field-name-body').outerHeight();
       		var follow = $('.socialhub-post--follow').outerHeight();

       		$('.socialhub-post--infos .field-name-body').css('max-height', $(window).height() - parseInt(gap) - parseInt(follow) + 60);
       	}
       	if($('.socialhub-post--infos').outerHeight()-20 > $('.socialhub-post--main-content').height()){
       		var gap = $('.socialhub-post--infos').outerHeight() - $('.socialhub-post--infos .field-name-body').outerHeight();

       		$('.socialhub-post--infos .field-name-body').css('max-height', $('.socialhub-post--main-content').height() - parseInt(gap));
       		shadowboxWrapperInner.height($('html').height());
       	}

       shadowboxWrapper.css('top', ($(window.parent).height() - shadowboxWrapper.height())/2);
	}

	// Manage social hub grid
	Drupal.behaviors.SocialhubGrid = {
		attach: function(context, settings){
			// Set grid dimensions
			if($('#socialhub_list', context).length > 0 || $(context).attr('id') == 'socialhub_list'){
				$(window).bind('resize', Drupal.SafranSH.recalcGrid);
				Drupal.SafranSH.recalcGrid();
			}

			// Open post link when grid size is set to 2 columns
			$('.socialhub-grid--item .item--link').bind('click', function(e){
				e.preventDefault();

				if(getNbColumns() <= 2){
					window.open($(this).attr('data-post-url'), '_blank');
					Shadowbox.close();
				}

			});

			// Open specific post at load
			window.onload = function(){
				var postWanted = $('#node-'+window.location.hash.substr(1));
				if($('#socialhub_list', context).length > 0 && postWanted.length > 0){
					Shadowbox.open({content: postWanted.find('.item--link').attr('href'), player: 'iframe', width: 960});
				}
			};
		}
	}

	// Manage social hub post in shadowbox
	Drupal.behaviors.ShadowboxPost = {
		attach: function(context, settings){
			var query = window.location.search.substring(1),
				vars = query.split("&");
			for(var i=0;i<vars.length;i++){
		       var pair = vars[i].split("=");
		       // Control that we are in a shadowbox with a socialhub_post node
		       if(pair[0] == 'shadowbox' && $('.node-type-socialhub-post').length > 0){

		       		$(window).load(function(){
		       			// Set class to html, will associate "max-height: 100%" css rule
			       		$('html').addClass('socialhub-post-layer');

			       		// Adjust layout of node and shadowbox
		       			Drupal.SafranSH.adjustPostLayer();
		       			$(window).bind('resize', Drupal.SafranSH.adjustPostLayer);

		       			// Make sure all links opening in a new tab
		       			$('.field-name-body a').attr('target', '_blank');
		       		});
		        }
			}

		}
	}

}(jQuery));
;
(function(factory) {
  /* global define */
  /* istanbul ignore next */
  if ( typeof define === 'function' && define.amd ) {
    define(['jquery'], factory);
  } else if ( typeof module === 'object' && module.exports ) {
    // Node/CommonJS
    module.exports = function( root, jQuery ) {
      if ( jQuery === undefined ) {
        if ( typeof window !== 'undefined' ) {
          jQuery = require('jquery');
        } else {
          jQuery = require('jquery')(root);
        }
      }
      factory(jQuery);
      return jQuery;
    };
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function($) {
  'use strict';

  var $doc = $(document);
  var $win = $(window);

  var pluginName = 'selectric';
  var classList = 'Input Items Open Disabled TempShow HideSelect Wrapper Focus Hover Responsive Above Scroll Group GroupLabel';
  var eventNamespaceSuffix = '.sl';

  var chars = ['a', 'e', 'i', 'o', 'u', 'n', 'c', 'y'];
  var diacritics = [
    /[\xE0-\xE5]/g, // a
    /[\xE8-\xEB]/g, // e
    /[\xEC-\xEF]/g, // i
    /[\xF2-\xF6]/g, // o
    /[\xF9-\xFC]/g, // u
    /[\xF1]/g,      // n
    /[\xE7]/g,      // c
    /[\xFD-\xFF]/g  // y
  ];

  /**
   * Create an instance of Selectric
   *
   * @constructor
   * @param {Node} element - The &lt;select&gt; element
   * @param {object}  opts - Options
   */
  var Selectric = function(element, opts) {
    var _this = this;

    _this.element = element;
    _this.$element = $(element);

    _this.state = {
      multiple       : !!_this.$element.attr('multiple'),
      enabled        : false,
      opened         : false,
      currValue      : -1,
      selectedIdx    : -1,
      highlightedIdx : -1
    };

    _this.eventTriggers = {
      open    : _this.open,
      close   : _this.close,
      destroy : _this.destroy,
      refresh : _this.refresh,
      init    : _this.init
    };

    _this.init(opts);
  };

  Selectric.prototype = {
    utils: {
      /**
       * Detect mobile browser
       *
       * @return {boolean}
       */
      isMobile: function() {
        return /android|ip(hone|od|ad)/i.test(navigator.userAgent);
      },

      /**
       * Escape especial characters in string (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)
       *
       * @param  {string} str - The string to be escaped
       * @return {string}       The string with the special characters escaped
       */
      escapeRegExp: function(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
      },

      /**
       * Replace diacritics
       *
       * @param  {string} str - The string to replace the diacritics
       * @return {string}       The string with diacritics replaced with ascii characters
       */
      replaceDiacritics: function(str) {
        var k = diacritics.length;

        while (k--) {
          str = str.toLowerCase().replace(diacritics[k], chars[k]);
        }

        return str;
      },

      /**
       * Format string
       * https://gist.github.com/atesgoral/984375
       *
       * @param  {string} f - String to be formated
       * @return {string}     String formated
       */
      format: function(f) {
        var a = arguments; // store outer arguments
        return ('' + f) // force format specifier to String
          .replace( // replace tokens in format specifier
            /\{(?:(\d+)|(\w+))\}/g, // match {token} references
            function(
              s, // the matched string (ignored)
              i, // an argument index
              p // a property name
            ) {
              return p && a[1] // if property name and first argument exist
                ? a[1][p] // return property from first argument
                : a[i]; // assume argument index and return i-th argument
            });
      },

      /**
       * Get the next enabled item in the options list.
       *
       * @param  {object} selectItems - The options object.
       * @param  {number}    selected - Index of the currently selected option.
       * @return {object}               The next enabled item.
       */
      nextEnabledItem: function(selectItems, selected) {
        while ( selectItems[ selected = (selected + 1) % selectItems.length ].disabled ) {
          // empty
        }
        return selected;
      },

      /**
       * Get the previous enabled item in the options list.
       *
       * @param  {object} selectItems - The options object.
       * @param  {number}    selected - Index of the currently selected option.
       * @return {object}               The previous enabled item.
       */
      previousEnabledItem: function(selectItems, selected) {
        while ( selectItems[ selected = (selected > 0 ? selected : selectItems.length) - 1 ].disabled ) {
          // empty
        }
        return selected;
      },

      /**
       * Transform camelCase string to dash-case.
       *
       * @param  {string} str - The camelCased string.
       * @return {string}       The string transformed to dash-case.
       */
      toDash: function(str) {
        return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
      },

      /**
       * Calls the events registered with function name.
       *
       * @param {string}    fn - The name of the function.
       * @param {number} scope - Scope that should be set on the function.
       */
      triggerCallback: function(fn, scope) {
        var elm = scope.element;
        var func = scope.options['on' + fn];
        var args = [elm].concat([].slice.call(arguments).slice(1));

        if ( $.isFunction(func) ) {
          func.apply(elm, args);
        }

        $(elm).trigger(pluginName + '-' + this.toDash(fn), args);
      },

      /**
       * Transform array list to concatenated string and remove empty values
       * @param  {array} arr - Class list
       * @return {string}      Concatenated string
       */
      arrayToClassname: function(arr) {
        var newArr = $.grep(arr, function(item) {
          return !!item;
        });

        return $.trim(newArr.join(' '));
      }
    },

    /** Initializes */
    init: function(opts) {
      var _this = this;

      // Set options
      _this.options = $.extend(true, {}, $.fn[pluginName].defaults, _this.options, opts);

      _this.utils.triggerCallback('BeforeInit', _this);

      // Preserve data
      _this.destroy(true);

      // Disable on mobile browsers
      if ( _this.options.disableOnMobile && _this.utils.isMobile() ) {
        _this.disableOnMobile = true;
        return;
      }

      // Get classes
      _this.classes = _this.getClassNames();

      // Create elements
      var input              = $('<input/>', { 'class': _this.classes.input, 'readonly': _this.utils.isMobile() });
      var items              = $('<div/>',   { 'class': _this.classes.items, 'tabindex': -1 });
      var itemsScroll        = $('<div/>',   { 'class': _this.classes.scroll });
      var wrapper            = $('<div/>',   { 'class': _this.classes.prefix, 'html': _this.options.arrowButtonMarkup });
      var label              = $('<span/>',  { 'class': 'label' });
      var outerWrapper       = _this.$element.wrap('<div/>').parent().append(wrapper.prepend(label), items, input);
      var hideSelectWrapper  = $('<div/>',   { 'class': _this.classes.hideselect });

      _this.elements = {
        input        : input,
        items        : items,
        itemsScroll  : itemsScroll,
        wrapper      : wrapper,
        label        : label,
        outerWrapper : outerWrapper
      };

      if ( _this.options.nativeOnMobile && _this.utils.isMobile() ) {
        _this.elements.input = undefined;
        hideSelectWrapper.addClass(_this.classes.prefix + '-is-native');

        _this.$element.on('change', function() {
          _this.refresh();
        });
      }

      _this.$element
        .on(_this.eventTriggers)
        .wrap(hideSelectWrapper);

      _this.originalTabindex = _this.$element.prop('tabindex');
      _this.$element.prop('tabindex', -1);

      _this.populate();
      _this.activate();

      _this.utils.triggerCallback('Init', _this);
    },

    /** Activates the plugin */
    activate: function() {
      var _this = this;
      var hiddenChildren = _this.elements.items.closest(':visible').children(':hidden').addClass(_this.classes.tempshow);
      var originalWidth = _this.$element.width();

      hiddenChildren.removeClass(_this.classes.tempshow);

      _this.utils.triggerCallback('BeforeActivate', _this);

      _this.elements.outerWrapper.prop('class',
        _this.utils.arrayToClassname([
          _this.classes.wrapper,
          _this.$element.prop('class').replace(/\S+/g, _this.classes.prefix + '-$&'),
          _this.options.responsive ? _this.classes.responsive : ''
        ])
      );

      if ( _this.options.inheritOriginalWidth && originalWidth > 0 ) {
        _this.elements.outerWrapper.width(originalWidth);
      }

      _this.unbindEvents();

      if ( !_this.$element.prop('disabled') ) {
        _this.state.enabled = true;

        // Not disabled, so... Removing disabled class
        _this.elements.outerWrapper.removeClass(_this.classes.disabled);

        // Remove styles from items box
        // Fix incorrect height when refreshed is triggered with fewer options
        _this.$li = _this.elements.items.removeAttr('style').find('li');

        _this.bindEvents();
      } else {
        _this.elements.outerWrapper.addClass(_this.classes.disabled);

        if ( _this.elements.input ) {
          _this.elements.input.prop('disabled', true);
        }
      }

      _this.utils.triggerCallback('Activate', _this);
    },

    /**
     * Generate classNames for elements
     *
     * @return {object} Classes object
     */
    getClassNames: function() {
      var _this = this;
      var customClass = _this.options.customClass;
      var classesObj = {};

      $.each(classList.split(' '), function(i, currClass) {
        var c = customClass.prefix + currClass;
        classesObj[currClass.toLowerCase()] = customClass.camelCase ? c : _this.utils.toDash(c);
      });

      classesObj.prefix = customClass.prefix;

      return classesObj;
    },

    /** Set the label text */
    setLabel: function() {
      var _this = this;
      var labelBuilder = _this.options.labelBuilder;

      if ( _this.state.multiple ) {
        // Make sure currentValues is an array
        var currentValues = $.isArray(_this.state.currValue) ? _this.state.currValue : [_this.state.currValue];
        // I'm not happy with this, but currentValues can be an empty
        // array and we need to fallback to the default option.
        currentValues = currentValues.length === 0 ? [0] : currentValues;

        var labelMarkup = $.map(currentValues, function(value) {
          return $.grep(_this.lookupItems, function(item) {
            return item.index === value;
          })[0]; // we don't want nested arrays here
        });

        labelMarkup = $.grep(labelMarkup, function(item) {
          // Hide default (please choose) if more then one element were selected.
          // If no option value were given value is set to option text by default
          if ( labelMarkup.length > 1 || labelMarkup.length === 0 ) {
            return $.trim(item.value) !== '';
          }
          return item;
        });

        labelMarkup = $.map(labelMarkup, function(item) {
          return $.isFunction(labelBuilder)
            ? labelBuilder(item)
            : _this.utils.format(labelBuilder, item);
        });

        // Limit the amount of selected values shown in label
        if ( _this.options.multiple.maxLabelEntries ) {
          if ( labelMarkup.length >= _this.options.multiple.maxLabelEntries + 1 ) {
            labelMarkup = labelMarkup.slice(0, _this.options.multiple.maxLabelEntries);
            labelMarkup.push(
              $.isFunction(labelBuilder)
                ? labelBuilder({ text: '...' })
                : _this.utils.format(labelBuilder, { text: '...' }));
          } else {
            labelMarkup.slice(labelMarkup.length - 1);
          }
        }
        _this.elements.label.html(labelMarkup.join(_this.options.multiple.separator));

      } else {
        var currItem = _this.lookupItems[_this.state.currValue];

        _this.elements.label.html(
          $.isFunction(labelBuilder)
            ? labelBuilder(currItem)
            : _this.utils.format(labelBuilder, currItem)
        );
      }
    },

    /** Get and save the available options */
    populate: function() {
      var _this = this;
      var $options = _this.$element.children();
      var $justOptions = _this.$element.find('option');
      var $selected = $justOptions.filter(':selected');
      var selectedIndex = $justOptions.index($selected);
      var currIndex = 0;
      var emptyValue = (_this.state.multiple ? [] : 0);

      if ( $selected.length > 1 && _this.state.multiple ) {
        selectedIndex = [];
        $selected.each(function() {
          selectedIndex.push($(this).index());
        });
      }

      _this.state.currValue = (~selectedIndex ? selectedIndex : emptyValue);
      _this.state.selectedIdx = _this.state.currValue;
      _this.state.highlightedIdx = _this.state.currValue;
      _this.items = [];
      _this.lookupItems = [];

      if ( $options.length ) {
        // Build options markup
        $options.each(function(i) {
          var $elm = $(this);

          if ( $elm.is('optgroup') ) {

            var optionsGroup = {
              element       : $elm,
              label         : $elm.prop('label'),
              groupDisabled : $elm.prop('disabled'),
              items         : []
            };

            $elm.children().each(function(i) {
              var $elm = $(this);

              optionsGroup.items[i] = _this.getItemData(currIndex, $elm, optionsGroup.groupDisabled || $elm.prop('disabled'));

              _this.lookupItems[currIndex] = optionsGroup.items[i];

              currIndex++;
            });

            _this.items[i] = optionsGroup;

          } else {

            _this.items[i] = _this.getItemData(currIndex, $elm, $elm.prop('disabled'));

            _this.lookupItems[currIndex] = _this.items[i];

            currIndex++;

          }
        });

        _this.setLabel();
        _this.elements.items.append( _this.elements.itemsScroll.html( _this.getItemsMarkup(_this.items) ) );
      }
    },

    /**
     * Generate items object data
     * @param  {integer} index      - Current item index
     * @param  {node}    $elm       - Current element node
     * @param  {boolean} isDisabled - Current element disabled state
     * @return {object}               Item object
     */
    getItemData: function(index, $elm, isDisabled) {
      var _this = this;

      return {
        index     : index,
        element   : $elm,
        value     : $elm.val(),
        className : $elm.prop('class'),
        text      : $elm.html(),
        slug      : $.trim(_this.utils.replaceDiacritics($elm.html())),
        selected  : $elm.prop('selected'),
        disabled  : isDisabled
      };
    },

    /**
     * Generate options markup
     *
     * @param  {object} items - Object containing all available options
     * @return {string}         HTML for the options box
     */
    getItemsMarkup: function(items) {
      var _this = this;
      var markup = '<ul>';

      if ( $.isFunction(_this.options.listBuilder) && _this.options.listBuilder ) {
        items = _this.options.listBuilder(items);
      }

      $.each(items, function(i, elm) {
        if ( elm.label !== undefined ) {

          markup += _this.utils.format('<ul class="{1}"><li class="{2}">{3}</li>',
            _this.utils.arrayToClassname([
              _this.classes.group,
              elm.groupDisabled ? 'disabled' : '',
              elm.element.prop('class')
            ]),
            _this.classes.grouplabel,
            elm.element.prop('label')
          );

          $.each(elm.items, function(i, elm) {
            markup += _this.getItemMarkup(elm.index, elm);
          });

          markup += '</ul>';

        } else {

          markup += _this.getItemMarkup(elm.index, elm);

        }
      });

      return markup + '</ul>';
    },

    /**
     * Generate every option markup
     *
     * @param  {number} index    - Index of current item
     * @param  {object} itemData - Current item
     * @return {string}            HTML for the option
     */
    getItemMarkup: function(index, itemData) {
      var _this = this;
      var itemBuilder = _this.options.optionsItemBuilder;
      // limit access to item data to provide a simple interface
      // to most relevant options.
      var filteredItemData = {
        value: itemData.value,
        text : itemData.text,
        slug : itemData.slug,
        index: itemData.index
      };

      return _this.utils.format('<li data-index="{1}" class="{2}">{3}</li>',
        index,
        _this.utils.arrayToClassname([
          itemData.className,
          index === _this.items.length - 1  ? 'last'     : '',
          itemData.disabled                 ? 'disabled' : '',
          itemData.selected                 ? 'selected' : ''
        ]),
        $.isFunction(itemBuilder)
          ? _this.utils.format(itemBuilder(itemData, this.$element, index), itemData)
          : _this.utils.format(itemBuilder, filteredItemData)
      );
    },

    /** Remove events on the elements */
    unbindEvents: function() {
      var _this = this;

      _this.elements.wrapper
        .add(_this.$element)
        .add(_this.elements.outerWrapper)
        .add(_this.elements.input)
        .off(eventNamespaceSuffix);
    },

    /** Bind events on the elements */
    bindEvents: function() {
      var _this = this;

      _this.elements.outerWrapper.on('mouseenter' + eventNamespaceSuffix + ' mouseleave' + eventNamespaceSuffix, function(e) {
        $(this).toggleClass(_this.classes.hover, e.type === 'mouseenter');

        // Delay close effect when openOnHover is true
        if ( _this.options.openOnHover ) {
          clearTimeout(_this.closeTimer);

          if ( e.type === 'mouseleave' ) {
            _this.closeTimer = setTimeout($.proxy(_this.close, _this), _this.options.hoverIntentTimeout);
          } else {
            _this.open();
          }
        }
      });

      // Toggle open/close
      _this.elements.wrapper.on('click' + eventNamespaceSuffix, function(e) {
        _this.state.opened ? _this.close() : _this.open(e);
      });

      // Translate original element focus event to dummy input.
      // Disabled on mobile devices because the default option list isn't
      // shown due the fact that hidden input gets focused
      if ( !(_this.options.nativeOnMobile && _this.utils.isMobile()) ) {
        _this.$element.on('focus' + eventNamespaceSuffix, function() {
          _this.elements.input.focus();
        });

        _this.elements.input
          .prop({ tabindex: _this.originalTabindex, disabled: false })
          .on('keydown' + eventNamespaceSuffix, $.proxy(_this.handleKeys, _this))
          .on('focusin' + eventNamespaceSuffix, function(e) {
            _this.elements.outerWrapper.addClass(_this.classes.focus);

            // Prevent the flicker when focusing out and back again in the browser window
            _this.elements.input.one('blur', function() {
              _this.elements.input.blur();
            });

            if ( _this.options.openOnFocus && !_this.state.opened ) {
              _this.open(e);
            }
          })
          .on('focusout' + eventNamespaceSuffix, function() {
            _this.elements.outerWrapper.removeClass(_this.classes.focus);
          })
          .on('input propertychange', function() {
            var val = _this.elements.input.val();
            var searchRegExp = new RegExp('^' + _this.utils.escapeRegExp(val), 'i');

            // Clear search
            clearTimeout(_this.resetStr);
            _this.resetStr = setTimeout(function() {
              _this.elements.input.val('');
            }, _this.options.keySearchTimeout);

            if ( val.length ) {
              // Search in select options
              $.each(_this.items, function(i, elm) {
                if ( !elm.disabled && searchRegExp.test(elm.text) || searchRegExp.test(elm.slug) ) {
                  _this.highlight(i);
                  return;
                }
              });
            }
          });
      }

      _this.$li.on({
        // Prevent <input> blur on Chrome
        mousedown: function(e) {
          e.preventDefault();
          e.stopPropagation();
        },
        click: function() {
          _this.select($(this).data('index'));

          // Chrome doesn't close options box if select is wrapped with a label
          // We need to 'return false' to avoid that
          return false;
        }
      });
    },

    /**
     * Behavior when keyboard keys is pressed
     *
     * @param {object} e - Event object
     */
    handleKeys: function(e) {
      var _this = this;
      var key = e.which;
      var keys = _this.options.keys;

      var isPrevKey = $.inArray(key, keys.previous) > -1;
      var isNextKey = $.inArray(key, keys.next) > -1;
      var isSelectKey = $.inArray(key, keys.select) > -1;
      var isOpenKey = $.inArray(key, keys.open) > -1;
      var idx = _this.state.highlightedIdx;
      var isFirstOrLastItem = (isPrevKey && idx === 0) || (isNextKey && (idx + 1) === _this.items.length);
      var goToItem = 0;

      // Enter / Space
      if ( key === 13 || key === 32 ) {
        e.preventDefault();
      }

      // If it's a directional key
      if ( isPrevKey || isNextKey ) {
        if ( !_this.options.allowWrap && isFirstOrLastItem ) {
          return;
        }

        if ( isPrevKey ) {
          goToItem = _this.utils.previousEnabledItem(_this.lookupItems, idx);
        }

        if ( isNextKey ) {
          goToItem = _this.utils.nextEnabledItem(_this.lookupItems, idx);
        }

        _this.highlight(goToItem);
      }

      // Tab / Enter / ESC
      if ( isSelectKey && _this.state.opened ) {
        _this.select(idx);

        if ( !_this.state.multiple || !_this.options.multiple.keepMenuOpen ) {
          _this.close();
        }

        return;
      }

      // Space / Enter / Left / Up / Right / Down
      if ( isOpenKey && !_this.state.opened ) {
        _this.open();
      }
    },

    /** Update the items object */
    refresh: function() {
      var _this = this;

      _this.populate();
      _this.activate();
      _this.utils.triggerCallback('Refresh', _this);
    },

    /** Set options box width/height */
    setOptionsDimensions: function() {
      var _this = this;

      // Calculate options box height
      // Set a temporary class on the hidden parent of the element
      var hiddenChildren = _this.elements.items.closest(':visible').children(':hidden').addClass(_this.classes.tempshow);
      var maxHeight = _this.options.maxHeight;
      var itemsWidth = _this.elements.items.outerWidth();
      var wrapperWidth = _this.elements.wrapper.outerWidth() - (itemsWidth - _this.elements.items.width());

      // Set the dimensions, minimum is wrapper width, expand for long items if option is true
      if ( !_this.options.expandToItemText || wrapperWidth > itemsWidth ) {
        _this.finalWidth = wrapperWidth;
      } else {
        // Make sure the scrollbar width is included
        _this.elements.items.css('overflow', 'scroll');

        // Set a really long width for _this.elements.outerWrapper
        _this.elements.outerWrapper.width(9e4);
        _this.finalWidth = _this.elements.items.width();
        // Set scroll bar to auto
        _this.elements.items.css('overflow', '');
        _this.elements.outerWrapper.width('');
      }

      _this.elements.items.width(_this.finalWidth).height() > maxHeight && _this.elements.items.height(maxHeight);

      // Remove the temporary class
      hiddenChildren.removeClass(_this.classes.tempshow);
    },

    /** Detect if the options box is inside the window */
    isInViewport: function() {
      var _this = this;
      var scrollTop = $win.scrollTop();
      var winHeight = $win.height();
      var uiPosX = _this.elements.outerWrapper.offset().top;
      var uiHeight = _this.elements.outerWrapper.outerHeight();

      var fitsDown = (uiPosX + uiHeight + _this.itemsHeight) <= (scrollTop + winHeight);
      var fitsAbove = (uiPosX - _this.itemsHeight) > scrollTop;

      // If it does not fit below, only render it
      // above it fit's there.
      // It's acceptable that the user needs to
      // scroll the viewport to see the cut off UI
      var renderAbove = !fitsDown && fitsAbove;

      _this.elements.outerWrapper.toggleClass(_this.classes.above, renderAbove);
    },

    /**
     * Detect if currently selected option is visible and scroll the options box to show it
     *
     * @param {Number|Array} index - Index of the selected items
     */
    detectItemVisibility: function(index) {
      var _this = this;
      var $filteredLi = _this.$li.filter('[data-index]');

      if ( _this.state.multiple ) {
        // If index is an array, we can assume a multiple select and we
        // want to scroll to the uppermost selected item!
        // Math.min.apply(Math, index) returns the lowest entry in an Array.
        index = ($.isArray(index) && index.length === 0) ? 0 : index;
        index = $.isArray(index) ? Math.min.apply(Math, index) : index;
      }

      var liHeight = $filteredLi.eq(index).outerHeight();
      var liTop = $filteredLi[index].offsetTop;
      var itemsScrollTop = _this.elements.itemsScroll.scrollTop();
      var scrollT = liTop + liHeight * 2;

      _this.elements.itemsScroll.scrollTop(
        scrollT > itemsScrollTop + _this.itemsHeight ? scrollT - _this.itemsHeight :
          liTop - liHeight < itemsScrollTop ? liTop - liHeight :
            itemsScrollTop
      );
    },

    /**
     * Open the select options box
     *
     * @param {Event} e - Event
     */
    open: function(e) {
      var _this = this;

      if ( _this.options.nativeOnMobile && _this.utils.isMobile()) {
        return false;
      }

      _this.utils.triggerCallback('BeforeOpen', _this);

      if ( e ) {
        e.preventDefault();
        if (_this.options.stopPropagation) {
          e.stopPropagation();
        }
      }

      if ( _this.state.enabled ) {
        _this.setOptionsDimensions();

        // Find any other opened instances of select and close it
        $('.' + _this.classes.hideselect, '.' + _this.classes.open).children()[pluginName]('close');

        _this.state.opened = true;
        _this.itemsHeight = _this.elements.items.outerHeight();
        _this.itemsInnerHeight = _this.elements.items.height();

        // Toggle options box visibility
        _this.elements.outerWrapper.addClass(_this.classes.open);

        // Give dummy input focus
        _this.elements.input.val('');
        if ( e && e.type !== 'focusin' ) {
          _this.elements.input.focus();
        }

        // Delayed binds events on Document to make label clicks work
        setTimeout(function() {
          $doc
            .on('click' + eventNamespaceSuffix, $.proxy(_this.close, _this))
            .on('scroll' + eventNamespaceSuffix, $.proxy(_this.isInViewport, _this));
        }, 1);

        _this.isInViewport();

        // Prevent window scroll when using mouse wheel inside items box
        if ( _this.options.preventWindowScroll ) {
          /* istanbul ignore next */
          $doc.on('mousewheel' + eventNamespaceSuffix + ' DOMMouseScroll' + eventNamespaceSuffix, '.' + _this.classes.scroll, function(e) {
            var orgEvent = e.originalEvent;
            var scrollTop = $(this).scrollTop();
            var deltaY = 0;

            if ( 'detail'      in orgEvent ) { deltaY = orgEvent.detail * -1; }
            if ( 'wheelDelta'  in orgEvent ) { deltaY = orgEvent.wheelDelta;  }
            if ( 'wheelDeltaY' in orgEvent ) { deltaY = orgEvent.wheelDeltaY; }
            if ( 'deltaY'      in orgEvent ) { deltaY = orgEvent.deltaY * -1; }

            if ( scrollTop === (this.scrollHeight - _this.itemsInnerHeight) && deltaY < 0 || scrollTop === 0 && deltaY > 0 ) {
              e.preventDefault();
            }
          });
        }

        _this.detectItemVisibility(_this.state.selectedIdx);

        _this.highlight(_this.state.multiple ? -1 : _this.state.selectedIdx);

        _this.utils.triggerCallback('Open', _this);
      }
    },

    /** Close the select options box */
    close: function() {
      var _this = this;

      _this.utils.triggerCallback('BeforeClose', _this);

      // Remove custom events on document
      $doc.off(eventNamespaceSuffix);

      // Remove visible class to hide options box
      _this.elements.outerWrapper.removeClass(_this.classes.open);

      _this.state.opened = false;

      _this.utils.triggerCallback('Close', _this);
    },

    /** Select current option and change the label */
    change: function() {
      var _this = this;

      _this.utils.triggerCallback('BeforeChange', _this);

      if ( _this.state.multiple ) {
        // Reset old selected
        $.each(_this.lookupItems, function(idx) {
          _this.lookupItems[idx].selected = false;
          _this.$element.find('option').prop('selected', false);
        });

        // Set new selected
        $.each(_this.state.selectedIdx, function(idx, value) {
          _this.lookupItems[value].selected = true;
          _this.$element.find('option').eq(value).prop('selected', true);
        });

        _this.state.currValue = _this.state.selectedIdx;

        _this.setLabel();

        _this.utils.triggerCallback('Change', _this);
      } else if ( _this.state.currValue !== _this.state.selectedIdx ) {
        // Apply changed value to original select
        _this.$element
          .prop('selectedIndex', _this.state.currValue = _this.state.selectedIdx)
          .data('value', _this.lookupItems[_this.state.selectedIdx].text);

        // Change label text
        _this.setLabel();

        _this.utils.triggerCallback('Change', _this);
      }
    },

    /**
     * Highlight option
     * @param {number} index - Index of the options that will be highlighted
     */
    highlight: function(index) {
      var _this = this;
      var $filteredLi = _this.$li.filter('[data-index]').removeClass('highlighted');

      _this.utils.triggerCallback('BeforeHighlight', _this);

      // Parameter index is required and should not be a disabled item
      if ( index === undefined || index === -1 || _this.lookupItems[index].disabled ) {
        return;
      }

      $filteredLi
        .eq(_this.state.highlightedIdx = index)
        .addClass('highlighted');

      _this.detectItemVisibility(index);

      _this.utils.triggerCallback('Highlight', _this);
    },

    /**
     * Select option
     *
     * @param {number} index - Index of the option that will be selected
     */
    select: function(index) {
      var _this = this;
      var $filteredLi = _this.$li.filter('[data-index]');

      _this.utils.triggerCallback('BeforeSelect', _this, index);

      // Parameter index is required and should not be a disabled item
      if ( index === undefined || index === -1 || _this.lookupItems[index].disabled ) {
        return;
      }

      if ( _this.state.multiple ) {
        // Make sure selectedIdx is an array
        _this.state.selectedIdx = $.isArray(_this.state.selectedIdx) ? _this.state.selectedIdx : [_this.state.selectedIdx];

        var hasSelectedIndex = $.inArray(index, _this.state.selectedIdx);
        if ( hasSelectedIndex !== -1 ) {
          _this.state.selectedIdx.splice(hasSelectedIndex, 1);
        } else {
          _this.state.selectedIdx.push(index);
        }

        $filteredLi
          .removeClass('selected')
          .filter(function(index) {
            return $.inArray(index, _this.state.selectedIdx) !== -1;
          })
          .addClass('selected');
      } else {
        $filteredLi
          .removeClass('selected')
          .eq(_this.state.selectedIdx = index)
          .addClass('selected');
      }

      if ( !_this.state.multiple || !_this.options.multiple.keepMenuOpen ) {
        _this.close();
      }

      _this.change();

      _this.utils.triggerCallback('Select', _this, index);
    },

    /**
     * Unbind and remove
     *
     * @param {boolean} preserveData - Check if the data on the element should be removed too
     */
    destroy: function(preserveData) {
      var _this = this;

      if ( _this.state && _this.state.enabled ) {
        _this.elements.items.add(_this.elements.wrapper).add(_this.elements.input).remove();

        if ( !preserveData ) {
          _this.$element.removeData(pluginName).removeData('value');
        }

        _this.$element.prop('tabindex', _this.originalTabindex).off(eventNamespaceSuffix).off(_this.eventTriggers).unwrap().unwrap();

        _this.state.enabled = false;
      }
    }
  };

  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[pluginName] = function(args) {
    return this.each(function() {
      var data = $.data(this, pluginName);

      if ( data && !data.disableOnMobile ) {
        (typeof args === 'string' && data[args]) ? data[args]() : data.init(args);
      } else {
        $.data(this, pluginName, new Selectric(this, args));
      }
    });
  };

  /**
   * Default plugin options
   *
   * @type {object}
   */
  $.fn[pluginName].defaults = {
    onChange             : function(elm) { $(elm).change(); },
    maxHeight            : 300,
    keySearchTimeout     : 500,
    arrowButtonMarkup    : '<b class="button">&#x25be;</b>',
    disableOnMobile      : false,
    nativeOnMobile       : true,
    openOnFocus          : true,
    openOnHover          : false,
    hoverIntentTimeout   : 500,
    expandToItemText     : false,
    responsive           : false,
    preventWindowScroll  : true,
    inheritOriginalWidth : false,
    allowWrap            : true,
    stopPropagation      : true,
    optionsItemBuilder   : '{text}', // function(itemData, element, index)
    labelBuilder         : '{text}', // function(currItem)
    listBuilder          : false,    // function(items)
    keys                 : {
      previous : [37, 38],                 // Left / Up
      next     : [39, 40],                 // Right / Down
      select   : [9, 13, 27],              // Tab / Enter / Escape
      open     : [13, 32, 37, 38, 39, 40], // Enter / Space / Left / Up / Right / Down
      close    : [9, 27]                   // Tab / Escape
    },
    customClass          : {
      prefix: pluginName,
      camelCase: false
    },
    multiple              : {
      separator: ', ',
      keepMenuOpen: true,
      maxLabelEntries: false
    }
  };
}));
;
