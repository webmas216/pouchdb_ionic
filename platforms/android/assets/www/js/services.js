var services = angular.module('starter.services', []);

services.value('version', '0.1');

services.factory('pouchdb', function() {
  PouchDB.enableAllDbs = true;
  var database = new PouchDB('starter221');
  return database;
});


services.factory('pp', function($q, pouchdb, $rootScope) {

  return {
    add: function(playerId) {
      var deferred = $q.defer();
      var doc = {
        type: 'goal',
        playerId: playerId
      };
      pouchdb.post(doc, function(err, res) {
        $rootScope.$apply(function() {
          if (err) {
            deferred.reject(err)
          } else {
            deferred.resolve(res)
          }
        });
      });
      return deferred.promise;
    },
    getScore: function(playerId) {

      var deferred = $q.defer();
      var map = function(doc) {
        if (doc.type === 'goal') {
          emit(doc.playerId, null)
        }
      };
      pouchdb.query({map: map, reduce: '_count'}, {key: playerId}, function(err, res) {
        $rootScope.$apply(function() {
          if (err) {
            deferred.reject(err);
          } else {
            if (!res.rows.length) {
              deferred.resolve(0);
            } else {
              deferred.resolve(res.rows[0].value);
            }
          }
        });
      });
      return deferred.promise;
    }
  }

});
