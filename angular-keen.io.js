!function(global, angular) {
  'use strict';
  
  global._Keen = global._Keen || {};
  global.Keen = global.Keen || function(event) {
    global._Keen.clients = global._Keen.clients || {};
    global._Keen.clients[event.projectId] = this;
    this._config = event;
  };
  global.Keen.ready = global.Keen.ready || function(event){
    global._Keen.ready = global._Keen.ready || [];
    global._Keen.ready.push(event);
  };
  
  var events = ['addEvent','setGlobalProperties','trackExternalLink','on'];
  function init(event) {
    return function(){
      this['_' + event] = this['_' + event] || [];
      this['_' + event].push(arguments);
      return this;
    };
  }  
  for(var i = 0; i < events.length; i++) {
    var event_name = events[i];
    // define init above in here
    global.Keen.prototype[event_name] = global.Keen.prototype[event_name] || init(event_name);
  }
  

/*
  global.Keen = Keen || {
    configure: function(e) {
      this._cf = e;
    },
    addEvent: function(e,t,n,i) {
      this._eq = this._eq || [];
      this._eq.push([e,t,n,i]);
    },
    setGlobalProperties: function(e) {
      this._gp = e;
    },
    onChartsReady: function(e) {
      this._ocrq = this._ocrq || [];
      this._ocrq.push(e);
    }
  };
*/
  
  function $KeenServiceProvider() {
    var _asyncLoading = false;
    var _client;
    var _scriptUrl = 'https://d26b395fwzu5fz.cloudfront.net/3.2.0/keen.min.js';

    this.asyncLoading = function(config) {
      _asyncLoading = config || _asyncLoading;
      return this;
    };

    this.scriptUrl = function(url) {
      _scriptUrl = url || _scriptUrl;
      return this;
    };

    this.configure = function(config) {
      _client = Keen(config);
      return this;
    };
    
    this.client = function() {
      return _client;
    };

    // Create a script tag with moment as the source
    // and call our onScriptLoad callback when it
    // has been loaded
    function createScript(callback) {
      var scriptTag = document.createElement('script');
      scriptTag.type = 'text/javascript';
      scriptTag.async = true;
      scriptTag.src = _scriptUrl;
      scriptTag.onreadystatechange = function () {
        if (this.readyState === 'complete') {
          callback();
        }
      };
      scriptTag.onload = callback;
      var s = document.getElementsByTagName('scipt')[0];
      s.parentNode.insertBefore(scriptTag, s);
      // s.appendChild(scriptTag);
    }

    this.$get = function() {
      if (_asyncLoading) {
        createScript();
      }
      return _client;
    };
  }

  function $Keen(KeenService) {
    return {
      addEvent: function(event, object) {
        KeenService.addEvent(event, object);
      },
      trackEvent: function() {
        this.addEvent.apply(this, arguments);
      },
      trackExternalLink: function(element, event, object) {
        return KeenService.trackExternalLink(element, event, object);
      }
    }
  };
  
  angular.module('ngKeen', [])
  .provider('KeenService', $KeenServiceProvider)
  .provider('$keenService', $KeenServiceProvider)
  .factory('Keen', ['KeenService', $Keen])
  .factory('$keen', ['$keenService', $Keen]);
  
  angular.module('angular-keen.io', ['ngKeen']);

/*

// Keen.io javascript sdk

!function(init,root) {
  init('Keen','https://d26b395fwzu5fz.cloudfront.net/3.2.0/keen.min.js', root);
}(function(keen_text, script_url, global) {
  global['_' + keen_text] = {};
  global[keen_text] = function(event) {
    global['_' + keen_text].clients = global['_' + keen_text].clients || {};
    global['_' + keen_text].clients[event.projectId] = this;
    this._config = event;
  };
  global[keen_text].ready = function(event){
    global['_' + keen_text].ready = global['_' + keen_text].ready || [];
    global['_' + keen_text].ready.push(event);
  };
  var events = ['addEvent','setGlobalProperties','trackExternalLink','on'];


  for(var event_index = 0; event_index < events.length; event_index++) {
    var event_name = events[event_index];
    var init = function(event) {
      return function(){
        this['_' + event] = this['_' + event] || [];
        this['_' + event].push(arguments);
        return this;
      };
    }  
    global[keen_text].prototype[event_name] = init(event_name);
  }
  var script_dom = document.createElement('script');
  script_dom.async = !0;
  script_dom.src = script_url;
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(script_dom, s);
}, this);

// from

!function(a,b) {
  a("Keen","https://d26b395fwzu5fz.cloudfront.net/3.2.0/keen.min.js",b)
}(function(a,b,c) {
  var d,e,f;
  c["_"+a] = {},
  c[a] = function(b) {
    c["_"+a].clients = c["_"+a].clients || {},
    c["_"+a].clients[b.projectId] = this,
    this._config=b
    
  },
  c[a].ready = function(b){
    c["_"+a].ready = c["_"+a].ready || [],
    c["_"+a].ready.push(b)
    
  },
  d=["addEvent","setGlobalProperties","trackExternalLink","on"];
  for(var g=0;g<d.length;g++) {
    var h = d[g],
    i = function(a) {
      return function(){
        return this["_"+a] = this["_"+a] || [],
        this["_"+a].push(arguments),
        this
      }
    };
    c[a].prototype[h] = i(h)
  }
  e = document.createElement("script"),
  e.async = !0,
  e.src = b,
  f = document.getElementsByTagName("script")[0],
  f.parentNode.insertBefore(e,f)
},this);

*/


}(this, this.angular);
