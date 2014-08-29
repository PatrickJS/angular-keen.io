!function(window, angular, Keen) {
  'use strict';

  Keen = Keen || {
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

  angular.module('angular-keen.io', ['ngKeen']);

  angular.module('ngKeen', [])
  .provider('KeenService', function() {
    var _asyncLoading = false;
    var _scriptUrl = '//dc8na2hxrj29i.cloudfront.net/code/keen-2.1.0-min.js';

    this.asyncLoading = function(config) {
      _asyncLoading = config || _asyncLoading;
      return this;
    };

    this.scriptUrl = function(url) {
      _scriptUrl = url || _scriptUrl;
      return this;
    };

    this.configure = function(config) {
      Keen.configure(config);
    };

    // Create a script tag with moment as the source
    // and call our onScriptLoad callback when it
    // has been loaded
    function createScript($document, callback) {
      var scriptTag = $document.createElement('script');
      scriptTag.type = 'text/javascript';
      scriptTag.async = true;
      scriptTag.src = _scriptUrl;
      scriptTag.onreadystatechange = function () {
        if (this.readyState === 'complete') {
          callback();
        }
      };
      scriptTag.onload = callback;
      var s = $document.getElementsByTagName('body')[0];
      s.appendChild(scriptTag);
    }

    this.$get = ['$q', '$document', '$window', '$timeout', function($q, $document, $window, $timeout) {
      var deferred = $q.defer();
      var _keen = $window.keen;

      if (_asyncLoading) {
        // Load client in the browser
        var onScriptLoad = function() {
          $timeout(function() {
            deferred.resolve($window.d3);
          });
        };
        createScript($document[0], onScriptLoad);
      }

      return (_asyncLoading) ? deferred.promise: _keen;
    }];
  })
  .factory('Keen', ['KeenService', function(KeenService) {
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
  }]);


}(this, this.angular, this.Keen);
