(function($) {

/**
 * jQuery debugging helper.
 *
 * Invented for Dreditor.
 *
 * @usage
 *   $.debug(var [, name]);
 *   $variable.debug( [name] );
 */
jQuery.extend({
  debug: function () {
    // Setup debug storage in global window. We want to look into it.
    window.debug = window.debug || [];

    args = jQuery.makeArray(arguments);
    // Determine data source; this is an object for $variable.debug().
    // Also determine the identifier to store data with.
    if (typeof this == 'object') {
      var name = (args.length ? args[0] : window.debug.length);
      var data = this;
    }
    else {
      var name = (args.length > 1 ? args.pop() : window.debug.length);
      var data = args[0];
    }
    // Store data.
    window.debug[name] = data;
    // Dump data into Firebug console.
    if (typeof console != 'undefined') {
      console.log(name, data);
    }
    return this;
  }
});
// @todo Is this the right way?
jQuery.fn.debug = jQuery.debug;

})(jQuery);
;
(function($) {
  $(function(){

    function get_query_string() {
      var result = {}, 
        query_string = location.search.substring(1), 
        re = /([^&=]+)=([^&]*)/g, 
        m;  
      while(m = re.exec(query_string)) {
        result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
      }
      return result;
    }

    var support_whyb = get_query_string()['support_whyb'] ? true : false;
    var social = get_query_string()['social'] ? true : false;

    if(support_whyb || (Drupal.settings.eff_whyb && Drupal.settings.eff_whyb.html)) {
      var link;
      if (social) {
        link = 'https://supporters.eff.org/donate/who-has-your-back-s';
      }
      else if (support_whyb) {
        link = 'https://supporters.eff.org/donate/who-has-your-back';
      }
      else {
        link = Drupal.settings.eff_whyb.link;
      }
      var $bar = $('<a id="support-whyb"></a>')
        .attr('href', link)
        .html(Drupal.settings.eff_whyb.html);
      var $css = $('<style>a:link#support-whyb, a:visited#support-whyb { font-size: 12px; position: fixed; text-align: center; top: 0; z-index: 10; display: block; background-color: #333333; color: #aaaaaa; width: 90%; padding: 10px 5%; line-height: 150%; text-decoration: none; } a:hover#support-whyb { background-color: #666666; color: #ffffff; text-decoration: none; } @media screen and (max-device-width: 40em), screen and (max-width: 40em) { a:link#support-whyb, a:visited#support-whyb { display: none; } }</style>');
      $('body').append($bar).append($css);
      if ($('#support-whyb').is(':visible')) {
        $('body').css('padding-top', $('#support-whyb').height()+'px');
      }
    }

  });
})(jQuery);
;
/**
 * @file
 * JavaScript integrations between the Caption Filter module and particular
 * WYSIWYG editors. This file also implements Insert module hooks to respond
 * to the insertion of content into a WYSIWYG or textarea.
 */
(function ($) {

$(document).bind('insertIntoActiveEditor', function(event, options) {
  if (options['fields']['title'] && Drupal.settings.captionFilter.widgets[options['widgetType']]) {
    options['content'] = '[caption]' + options['content'] + options['fields']['title'] + '[/caption]';
  }
});

Drupal.captionFilter = Drupal.captionFilter || {};

Drupal.captionFilter.toHTML = function(co, editor) {
  return co.replace(/(?:<p>)?\[caption([^\]]*)\]([\s\S]+?)\[\/caption\](?:<\/p>)?[\s\u00a0]*/g, function(a,b,c){
    var id, cls, w, tempClass;

    b = b.replace(/\\'|\\&#39;|\\&#039;/g, '&#39;').replace(/\\"|\\&quot;/g, '&quot;');
    c = c.replace(/\\&#39;|\\&#039;/g, '&#39;').replace(/\\&quot;/g, '&quot;');
    id = b.match(/id=['"]([^'"]+)/i);
    cls = b.match(/align=['"]([^'"]+)/i);
    w = c.match(/width=['"]([0-9]+)/);

    id = ( id && id[1] ) ? id[1] : '';
    cls = ( cls && cls[1] ) ? 'caption-' + cls[1] : '';
    w = ( w && w[1] ) ? w[1] : '';

    if (editor == 'tinymce')
      tempClass = (cls == 'caption-center') ? 'mceTemp mceIEcenter' : 'mceTemp';
    else if (editor == 'ckeditor')
      tempClass = (cls == 'caption-center') ? 'mceTemp mceIEcenter' : 'mceTemp';
    else
      tempClass = '';

    return '<div class="caption ' + cls + ' ' + tempClass + ' draggable"><div class="caption-inner" style="width: '+(parseInt(w))+'px">' + c + '</div></div>';
  });
};

Drupal.captionFilter.toTag = function(co) {
  return co.replace(/(<div class="caption [^"]*">)\s*<div[^>]+>(.+?)<\/div>\s*<\/div>\s*/gi, function(match, captionWrapper, contents) {
    var align;
    align = captionWrapper.match(/class=.*?caption-(left|center|right)/i);
    align = (align && align[1]) ? align[1] : '';

    return '[caption' + (align ? (' align="' + align + '"') : '') + ']' + contents + '[/caption]';
  });
};

})(jQuery);
;
(function ($) {

Drupal.behaviors.mytube = {
  attach: function (context, settings) {
    $('.mytubetrigger').click(function(){
      id = $(this).attr('id');
      index = id.substring(6);
      $(this).hide();
      $(this).after(unescape(mytubes[index]));
      var textid = '#mytubetext'+index;
      var caption = $(textid).html();
    });
  }
};

})(jQuery);

;
(function ($) {

Drupal.behaviors.piwikNoscript = {
  attach: function (context, settings) {
    $('#piwik-noscript', context).once('piwik-noscript', function() {
      $(this).html(Drupal.theme('piwikNoscriptImage', settings.piwikNoscript.image));
    });
  }
};

Drupal.theme.prototype.piwikNoscriptImage = function(image) {
  // Define some parameters in the image src attribute.
  return image
    .replace('urlref=', 'urlref=' + encodeURIComponent(document.referrer))
    .replace('action_name=', 'action_name=' + encodeURIComponent(document.title));
}

}(jQuery));
;
