(function() {
  'use strict';

  angular
    .module('calendarday')
    .service('gCalendarService', gCalendarService);

    gCalendarService.$inject = ['$http', '$q'];



    function gCalendarService($http, $q){
      return {
        getEvents : getEvents
      }

      function getEvents(calendarId, apiKey, start, end){
        var baseUrl  = 'https://www.googleapis.com/calendar/v3/';
        var url      = createEventsUrl(baseUrl, calendarId, apiKey, start, end);
        var deferred = $q.defer();

        $http.get(url)
          .success(function(data){
            deferred.resolve({events : data.items});
          })
          .error(function(data) {
            deferred.resolve('Something it\'s wrong');
          });
          return deferred.promise;
      }

      function createEventsUrl(baseUrl, calendarId, apiKey, start, end){
        var startStr = start.toISOString();
        var endStr   = end.toISOString();
        return baseUrl+'calendars/'+calendarId+
                       '/events?key='+apiKey+
                       '&timeMin='+startStr+
                       '&timeMax='+endStr;
      }


    }
  }());
