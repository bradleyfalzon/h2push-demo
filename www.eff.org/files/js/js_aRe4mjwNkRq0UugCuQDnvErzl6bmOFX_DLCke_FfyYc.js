(function ($) {
   Drupal.behaviors.no_has_js = {
    attach: function (context, settings) {
      // remove 'js enabled' cookie
      document.cookie = 'has_js=1; expires=Fri, 19 Nov 1978 05:00:00 GMT; path=/';
     }
   }
})(jQuery);
;
/*1.0.3*/(function(b){b.fn.mailcheck=function(a,b){var d="yahoo.com,google.com,hotmail.com,gmail.com,me.com,aol.com,mac.com,live.com,comcast.net,googlemail.com,msn.com,hotmail.co.uk,yahoo.co.uk,facebook.com,verizon.net,sbcglobal.net,att.net,gmx.com,mail.com".split(","),e="co.uk,com,net,org,info,edu,gov,mil".split(",");if("object"===typeof a&&void 0===b)a.domains=a.domains||d;else{var g=a,a=b;a.domains=g||d}a.topLevelDomains=a.topLevelDomains||e;a.distanceFunction=Kicksend.sift3Distance;(d=Kicksend.mailcheck.suggest(encodeURI(this.val()),
a.domains,a.topLevelDomains,a.distanceFunction))?a.suggested&&a.suggested(this,d):a.empty&&a.empty(this)}})(jQuery);
var Kicksend={mailcheck:{threshold:3,suggest:function(b,a,c,d){b=b.toLowerCase();b=this.splitEmail(b);if(a=this.findClosestDomain(b.domain,a,d)){if(a!=b.domain)return{address:b.address,domain:a,full:b.address+"@"+a}}else if(c=this.findClosestDomain(b.topLevelDomain,c),b.domain&&c&&c!=b.topLevelDomain)return a=b.domain,a=a.substring(0,a.lastIndexOf(b.topLevelDomain))+c,{address:b.address,domain:a,full:b.address+"@"+a};return!1},findClosestDomain:function(b,a,c){var d,e=99,g=null;if(!b||!a)return!1;
c||(c=this.sift3Distance);for(var f=0;f<a.length;f++){if(b===a[f])return b;d=c(b,a[f]);d<e&&(e=d,g=a[f])}return e<=this.threshold&&null!==g?g:!1},sift3Distance:function(b,a){if(null==b||0===b.length)return null==a||0===a.length?0:a.length;if(null==a||0===a.length)return b.length;for(var c=0,d=0,e=0,g=0;c+d<b.length&&c+e<a.length;){if(b.charAt(c+d)==a.charAt(c+e))g++;else for(var f=e=d=0;5>f;f++){if(c+f<b.length&&b.charAt(c+f)==a.charAt(c)){d=f;break}if(c+f<a.length&&b.charAt(c)==a.charAt(c+f)){e=
f;break}}c++}return(b.length+a.length)/2-g},splitEmail:function(b){b=b.split("@");if(2>b.length)return!1;for(var a=0;a<b.length;a++)if(""===b[a])return!1;var c=b.pop(),d=c.split("."),e="";if(0==d.length)return!1;if(1==d.length)e=d[0];else{for(a=1;a<d.length;a++)e+=d[a]+".";2<=d.length&&(e=e.substring(0,e.length-1))}return{topLevelDomain:e,domain:c,address:b.join("@")}}}};
;
jQuery(function(){
    jQuery("input[name='email-Primary']").blur(function(){
        jQuery(this).mailcheck({
            domains: ['yahoo.com', 'google.com', 'hotmail.com', 'gmail.com', 'me.com', 'aol.com', 'mac.com', 'live.com', 'comcast.net', 'googlemail.com', 'msn.com', 'hotmail.co.uk', 'yahoo.co.uk', 'facebook.com', 'verizon.net', 'sbcglobal.net', 'att.net', 'gmx.com', 'mail.com', 'cox.net'],
            suggested: function(element, suggestion) {
                if(jQuery('div.mailcheck-suggestion', jQuery(element).parent()).length == 0) {
                    jQuery(element).parent().append('<div class="mailcheck-suggestion" style="text-align:center;margin-top:5px;"></div>');
                }
                
                var $suggestion = jQuery('<em>'+suggestion.address+'@<strong>'+suggestion.domain+'</strong></em>')
                    .click(function(){
                        jQuery(element).val(suggestion.full);
                        jQuery('div.mailcheck-suggestion', jQuery(element).parent()).remove();
                    })
                    .css('cursor', 'pointer')
                    .css('text-decoration', 'underline')
                    .css('color', '#396A91');
                jQuery('div.mailcheck-suggestion', jQuery(element).parent())
                    .append('Do you mean ')
                    .append($suggestion)
                    .append('?');
            },
            empty: function(element) {
                if(jQuery('div.mailcheck-suggestion', jQuery(element).parent()).length) {
                    jQuery('div.mailcheck-suggestion', jQuery(element).parent()).remove();
                }
            }
        });
    });
});
;
(function ($) {
  $(function(){

    function placeholder_support() {
      var i = document.createElement('input');
      return 'placeholder' in i;
    }
    
    if(!placeholder_support()) {
      $('input, textarea').each(function(){
        var placeholder = $(this).attr('placeholder');

        $(this).focus(function(){
          if($(this).val() == placeholder) {
            $(this).val('').css('color', '#000000');
          }
        }).blur(function(){
          if($(this).val() == '') {
            $(this).val(placeholder).css('color', '#666666');
          }
        });

        if($(this).val() == '') {
          $(this).val(placeholder).css('color', '#666666');
        }
      });

      $('form').each(function(){
        $(this).submit(function(){
          $('input, textarea', this).each(function(){
            if($(this).val() == $(this).attr('placeholder')) {
              $(this).val('');
            }
          });
          return true;
        });
      });
    }

  });
}(jQuery));
;
