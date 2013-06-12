# Binary Tactics: Client-Side implementation #2

## Currently testable service calls - console syntax:

### Authentication service (hooked into view model, will have UI manifestation)

```javascript
    bt.services.execute('authService', function(service) {
                                            service.authenticate( 'atkr', 'atkr2', function() { alert("Success"); }, function() { alert("Fail!"); } );
                                        });
```

### Battle service (not hooked to view model, will not have UI manifestation)

```javascript
    bt.services.execute('BattleService', function(service) {
                                            service.getUsername(
                                                                function(data) { console.log("Success:"); console.log(data); },
                                                                function(data) { console.log("Fail:"); console.log(data); }
                                                            );
                                        });
    bt.services.execute('BattleService', function(service) {
                                            service.timeLeft(
                                                                function(data) { console.log("Success:"); console.log(data); },
                                                                function(data) { console.log("Fail:"); console.log(data); }
                                                            );
                                        });
    bt.services.execute('BattleService', function(service) {
                                            service.initialState(
                                                                function(data) { console.log("Success:"); console.log(data); },
                                                                function(data) { console.log("Fail:"); console.log(data); }
                                                            );
                                        });
    bt.services.execute('BattleService', function(service) {
                                            service.lastResult(
                                                                function(data) { console.log("Success:"); console.log(data); },
                                                                function(data) { console.log("Fail:"); console.log(data); }
                                                            );
                                        });
    bt.services.execute('BattleService', function(service) {
                                            service.getStates(
                                                                function(data) { console.log("Success:"); console.log(data); },
                                                                function(data) { console.log("Fail:"); console.log(data); }
                                                            );
                                        });
    bt.services.execute('BattleService', function(service) {
                                            service.getLastState(
                                                                function(data) { console.log("Success:"); console.log(data); },
                                                                function(data) { console.log("Fail:"); console.log(data); }
                                                            );
                                        });
    bt.services.execute('BattleService', function(service) {
                                            service.processAction(
                                                                'action type',
                                                                function(data) { console.log("Success:"); console.log(data); },
                                                                function(data) { console.log("Fail:"); console.log(data); }
                                                            );
                                        });
```

## Debugging options

### Events

To control if all raised events are to be published to console toggle property:
```javascript
bt.debugging.events.publishToConsole = true | false;
```

