(function() {
  'use strict';

  angular
    .module('calendarday', [])
    .controller('calendardayController', loadFunction);

  loadFunction.$inject = ['$scope', 'structureService', '$location', 'gCalendarService'];

  function loadFunction($scope, structureService, $location, gCalendarService) {

    structureService.registerModule($location, $scope, 'calendarday');

    var moduleConfig   = $scope.calendarday.modulescope;
    moment.locale(moduleConfig.locale);
    $scope.locale      = moduleConfig.locale;
    $scope.apiKey      = moduleConfig.apiKey;
    $scope.calendarId  = moduleConfig.calendarId;
    $scope.events      = [];
    $scope.actualView  = moment();
    $scope.actualDay   = angular.copy($scope.actualView);
    var actualDayStart = angular.copy($scope.actualView).startOf('day');
    var actualDayEnd   = angular.copy($scope.actualView).endOf('day');

    getEventList($scope.calendarId, $scope.apiKey, actualDayStart, actualDayEnd);

    $scope.changeDay = function(prev) {
      $scope.emptyEvents = undefined;
      var dayStart       = undefined;
      var dayEnd         = undefined;
      $scope.events      = [];

      if (prev) {
        $scope.actualView.subtract(1, 'days');
        dayStart = angular.copy($scope.actualView).startOf('day');
        dayEnd   = angular.copy($scope.actualView).endOf('day');
        getEventList($scope.calendarId, $scope.apiKey, dayStart, dayEnd);
      }
      else {
        $scope.actualView.add(1, 'days');
        dayStart = angular.copy($scope.actualView).startOf('day');
        dayEnd   = angular.copy($scope.actualView).endOf('day');
        getEventList($scope.calendarId, $scope.apiKey, dayStart, dayEnd);
      }
    }

    function getEventList(calendarId, apiKey, start, end) {
      var promise = gCalendarService.getEvents(calendarId, apiKey, start, end);
      promise
        .then(function(result) {
          if(result.events.length > 0){
            $scope.events = result.events;
            walkEvents($scope.events);
          }
          else if(result.events.length == 0){
            $scope.emptyEvents = 'No hay eventos hoy';
          }
          else $scope.error = result;
        })
    }

    function walkEvents(events){
        for(var i = 0; i < events.length; i++){
          getEventsHours(events[i]);
        }
    }

    function getEventsHours(eventDay){
      var dateTimeEvent = $scope.isDateTimeEvent(eventDay);
      if(dateTimeEvent){
        $scope.eventStart = moment(eventDay.start.dateTime).format('HH:mm');
        $scope.eventEnd   = moment(eventDay.end.dateTime).format('HH:mm');
      }
    }

    $scope.isDateTimeEvent = function(eventDay){
        return eventDay.start.dateTime && eventDay.end.dateTime;
    }
  }
}());
