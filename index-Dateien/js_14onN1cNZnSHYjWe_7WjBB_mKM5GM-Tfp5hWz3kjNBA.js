/**
 * Created by hafat on 03/11/16.
 */

(function ($){
    Drupal.behaviors.safran_blocks_statistics = {
        attach: function (context, settings) {
            $('.block').not('.no-stats, .slider').click(function () {
                $.ajax({
                    url: '/safran_blocks_statistics/ajax/' + $(this).attr('data-id'),
                    type: 'GET',
                    data: 'data-id=' + $(this).attr('data-id'),
                    dataType: 'html'
                });
            })
                .on('click', '.bx-prev, .bx-next', function (ev) {
                    ev.stopPropagation();
                });
        }
    };
}(jQuery));
;
(function ($) {
  Drupal.safran_toolkit = Drupal.safran_toolkit || {};

  Drupal.behaviors.safran_toolkit = {
    attach: function (context, settings) {
      if($('body').hasClass("page-offers") || $('body').hasClass("page-offers2")){
        $('.left-menu-container').once('AjaxOffers', function () {
          Drupal.safran_toolkit.ajaxUpdateStockChartInfo();
          Drupal.safran_toolkit.ajaxUpdateCartCount();
        });
      }
      else{
        $(document).ready(function () {
          Drupal.safran_toolkit.ajaxUpdateStockChartInfo();
          Drupal.safran_toolkit.ajaxUpdateCartCount();
        });
      }
    }
  };

  Drupal.safran_toolkit.ajaxUpdateStockChartInfo = function () {
    $.getJSON('/'+ Drupal.settings.pathPrefix+'ajax/stock_chart/info/json', function (stockChartInfo) {
      if (stockChartInfo != undefined && stockChartInfo['value'] != undefined && stockChartInfo['variation'] != undefined) {
        Drupal.safran_toolkit.updateStockChartInfo(stockChartInfo['value'], stockChartInfo['variation'], stockChartInfo['FullDate'], stockChartInfo['ClosePrice']);
      }
    }).fail(function (jqxhr, textStatus, error) {
      var err = textStatus + ", " + error;
      console.log("Request Failed: " + err);
      Drupal.safran_toolkit.updateStockChartInfo("\xA0-\xA0", ' '); //For info "\xA0" is equivalent to "&nbsp;"

    });
  };
    Drupal.safran_toolkit.updateStockChartInfo = function (stockChartValue, stockChartVariation, stockChartDate, stockChartClosePrice, stockChartTitle) {
    stockChartTitle = stockChartTitle || 'SAF';

    // If stockChartValue is a number, format it with 2 decimals
    if (!isNaN(stockChartValue)) {
      stockChartValue = Number(stockChartValue).toFixed(2);
    }

    var variationSymbol = ((stockChartValue > stockChartClosePrice) ? '+' : '-');

    // update stock chart icon
    $('.menu-button.finance .menu-subtitle').text(stockChartValue + '€');

        // update stock chart div
        $('.submenu-entry.picto-stock .entry-content').html('<table>' +
        '<tbody>' +
        '<tr>' +
        '<td class="stock-title">' + stockChartTitle + '</td>' +
        '<td class="stock-value">' + stockChartValue + '€</td>' +
        '<td class="variation ' + (variationSymbol == '+' ? 'positive' : 'negative') + '">' + stockChartVariation + '</td>' +
        '</tr>' +
        '<tr>'+
        '<td class="stock-date" colspan="3">' + stockChartDate + '</td>'+
        '</tr>' +
        '</tbody>' +
        '</table>');
    };

  Drupal.safran_toolkit.ajaxUpdateCartCount = function () {
    $.getJSON('/ajax/cart/count/json', function (cartInfo) {
      Drupal.safran_toolkit.updateCartCount(cartInfo['count']);
    }).fail(function (jqxhr, textStatus, error) {
      var err = textStatus + ", " + error;
      console.log("Request Failed: " + err);
    });
  };

  Drupal.safran_toolkit.updateCartCount = function (cartCount) {
    if (!isNaN(cartCount) && cartCount > 0) {
      Drupal.safran_toolkit.updateNotif('.menu-button.cart', cartCount);
    } else {
      Drupal.safran_toolkit.updateNotif('.menu-button.cart',null);
    }
  };

  Drupal.safran_toolkit.updateNotif = function (selector, $value) {
    if ($value !== null) {
      $(selector).not(":has(.menu-notif)").append('<span class="menu-notif"></span>');
      $(selector).find('.menu-notif').text($value);
    } else {
      Drupal.safran_toolkit.removeNotif(selector)
    }
  };

  Drupal.safran_toolkit.removeNotif = function (selector) {
    $(selector).find('.menu-notif').remove();
  };

  $(document).ready(function() {
    $('.left-menu-container li:not(.visible) > a').tooltip('hide');
  });

})(jQuery);
;
