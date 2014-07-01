angular.module('starfallxApp')
    .controller('HomeCtrl', function($scope) {
        var urlPartials = window.location.href.split('/');
        var base = urlPartials[0] + urlPartials[2];
        $scope.bookmarklet = 'javascript:(function(z){(function(l,r,n,m,k,h,p,q){if(!(k=l.jQuery)||n>k.fn.jquery||m(k))h=r.createElement("script"),h.type="text/javascript",h.src="//ajax.googleapis.com/ajax/libs/jquery/"+n+"/jquery.min.js",h.onload?h.onload=function(){p||(q=this.readyState)&&"loaded"!=q&&"complete"!=q||(m((k=l.jQuery).noConflict(1),p=1),k(h).remove())}:h.onreadystatechange=function(){p||(q=this.readyState)&&"loaded"!=q&&"complete"!=q||(m((k=l.jQuery).noConflict(1),p=1),k(h).remove())},r.documentElement.childNodes[0].appendChild(h)})(window,document,"1.4",function(l){function r(a,g){var b=(a&65535)+(g&65535);return(a>>16)+(g>>16)+(b>>16)<<16|b&65535}function n(a,g,b,A,h,k){a=r(r(g,a),r(A,k));return r(a<<h|a>>>32-h,b)}function m(a,g,b,h,k,m,l){return n(g&b|~g&h,a,g,k,m,l)}function k(a,g,b,h,k,m,l){return n(g&h|b&~h,a,g,k,m,l)}function h(a,g,b,h,k,m,l){return n(b^(g|~h),a,g,k,m,l)}function p(a,g){a[g>>5]|=128<<g% 32;a[(g+64>>>9<<4)+14]=g;var b,l,p,q,s,c=1732584193,d=-271733879,e=-1732584194,f=271733878;for(b=0;b<a.length;b+=16)l=c,p=d,q=e,s=f,c=m(c,d,e,f,a[b],7,-680876936),f=m(f,c,d,e,a[b+1],12,-389564586),e=m(e,f,c,d,a[b+2],17,606105819),d=m(d,e,f,c,a[b+3],22,-1044525330),c=m(c,d,e,f,a[b+4],7,-176418897),f=m(f,c,d,e,a[b+5],12,1200080426),e=m(e,f,c,d,a[b+6],17,-1473231341),d=m(d,e,f,c,a[b+7],22,-45705983),c=m(c,d,e,f,a[b+8],7,1770035416),f=m(f,c,d,e,a[b+9],12,-1958414417),e=m(e,f,c,d,a[b+10],17,-42063),d=m(d,e,f,c,a[b+11],22,-1990404162),c=m(c,d,e,f,a[b+12],7,1804603682),f=m(f,c,d,e,a[b+13],12,-40341101),e=m(e,f,c,d,a[b+14],17,-1502002290),d=m(d,e,f,c,a[b+15],22,1236535329),c=k(c,d,e,f,a[b+1],5,-165796510),f=k(f,c,d,e,a[b+6],9,-1069501632),e=k(e,f,c,d,a[b+11],14,643717713),d=k(d,e,f,c,a[b],20,-373897302),c=k(c,d,e,f,a[b+5],5,-701558691),f=k(f,c,d,e,a[b+10],9,38016083),e=k(e,f,c,d,a[b+15],14,-660478335),d=k(d,e,f,c,a[b+4],20,-405537848),c=k(c,d,e,f,a[b+9],5,568446438),f=k(f,c,d,e,a[b+14],9,-1019803690),e=k(e,f,c,d,a[b+3],14,-187363961),d=k(d,e,f,c,a[b+8],20,1163531501),c=k(c,d,e,f,a[b+13],5,-1444681467),f=k(f,c,d,e,a[b+2],9,-51403784),e=k(e,f,c,d,a[b+7],14,1735328473),d=k(d,e,f,c,a[b+12],20,-1926607734),c=n(d^e^f,c,d,a[b+5],4,-378558),f=n(c^d^e,f,c,a[b+8],11,-2022574463),e=n(f^c^d,e,f,a[b+11],16,1839030562),d=n(e^f^c,d,e,a[b+14],23,-35309556),c=n(d^e^f,c,d,a[b+1],4,-1530992060),f=n(c^d^e,f,c,a[b+4],11,1272893353),e=n(f^c^d,e,f,a[b+7],16,-155497632),d=n(e^f^c,d,e,a[b+10],23,-1094730640),c=n(d^e^f,c,d,a[b+13],4,681279174),f=n(c^d^e,f,c,a[b],11,-358537222),e=n(f^c^d,e,f,a[b+3],16,-722521979),d=n(e^f^c,d,e,a[b+6],23,76029189),c=n(d^e^f,c,d,a[b+9],4,-640364487),f=n(c^d^e,f,c,a[b+12],11,-421815835),e=n(f^c^d,e,f,a[b+15],16,530742520),d=n(e^f^c,d,e,a[b+2],23,-995338651),c=h(c,d,e,f,a[b],6,-198630844),f=h(f,c,d,e,a[b+7],10,1126891415),e=h(e,f,c,d,a[b+14],15,-1416354905),d=h(d,e,f,c,a[b+5],21,-57434055),c=h(c,d,e,f,a[b+12],6,1700485571),f=h(f,c,d,e,a[b+3],10,-1894986606),e=h(e,f,c,d,a[b+10],15,-1051523),d=h(d,e,f,c,a[b+1],21,-2054922799),c=h(c,d,e,f,a[b+8],6,1873313359),f=h(f,c,d,e,a[b+15],10,-30611744),e=h(e,f,c,d,a[b+6],15,-1560198380),d=h(d,e,f,c,a[b+13],21,1309151649),c=h(c,d,e,f,a[b+4],6,-145523070),f=h(f,c,d,e,a[b+11],10,-1120210379),e=h(e,f,c,d,a[b+2],15,718787259),d=h(d,e,f,c,a[b+9],21,-343485551),c=r(c,l),d=r(d,p),e=r(e,q),f=r(f,s);return[c,d,e,f]}function q(a){var g,b="";for(g=0;g<32*a.length;g+=8)b+=String.fromCharCode(a[g>>5]>>>g% 32&255);return b}function u(a){var g,b=[];b[(a.length>>2)-1]=void 0;for(g=0;g<b.length;g+=1)b[g]=0;for(g=0;g<8*a.length;g+=8)b[g>>5]|=(a.charCodeAt(g/8)&255)<<g% 32;return b}function v(a,g){var b,h=u(a),k=[],l=[];k[15]=l[15]=void 0;16<h.length&&(h=p(h,8*a.length));for(b=0;16>b;b+=1)k[b]=h[b]^909522486,l[b]=h[b]^1549556828;b=p(k.concat(u(g)),512+8*g.length);return q(p(l.concat(b),640))}function w(a){var g="",b,h;for(h=0;h<a.length;h+=1)b=a.charCodeAt(h),g+="0123456789abcdef".charAt(b>>>4&15)+"0123456789abcdef".charAt(b&15);return g}function x(a){a=unescape(encodeURIComponent(a));return q(p(u(a),8*a.length))}var s={},y=!1;l("table table:nth-child(2)").find("tr").each(function(a){if(!y&&0!=a)if(!l(this).find("select").length&&0<a)l(this).find("table font").each(function(a){var g=l(this).text();a=g.trim().split(" ")[0];g=g.replace(a,"").trim();s[a].examDate=g}),y=!0;else{var g=l(this).find("td:first-child font").text().trim();s[g]={indexes:[],selected:"",examDate:""};l(this).find("select option").each(function(){l(this).attr("value")&&"null"!=l(this).attr("value")&&s[g].indexes.push(l(this).attr("value"))});l(this).find("select").each(function(){"null"!=l(this).val()&&(s[g].selected=l(this).val())});s[g].indexes.length||(s[g].indexes=[""])}});var t=JSON.stringify(s),t=l.param({d:t,h:function(a,g,b){g?b?a=v(unescape(encodeURIComponent(g)),unescape(encodeURIComponent(a))):(a=v(unescape(encodeURIComponent(g)),unescape(encodeURIComponent(a))),a=w(a)):a=b?x(a):w(x(a));return a}(t)});if(window.location.href.split("//")[1]=="wish.wis.ntu.edu.sg/pls/webexe/AUS_STARS_PLANNER.planner")window.open(z+"/build?"+t)})})("' + base + '");';
    })