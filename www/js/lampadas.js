angular.module('lampadas', [])
  .controller('lampadas', ['$scope', '$http', '$ionicPopup','$ionicLoading', function($scope, $http, $ionicPopup, $ionicLoading ) {

    $ionicLoading.show({
      content: 'Conectando',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });


    // Create a client instance
    client = new Paho.MQTT.Client("m14.cloudmqtt.com", 30438, "web_" + parseInt(Math.random() * 100, 10));
    //Example client = new Paho.MQTT.Client("m11.cloudmqtt.com", 32903, "web_" + parseInt(Math.random() * 100, 10));

    // set callback handlers
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    var options = {
      useSSL: true,
      userName: "rrmboowt",
      password: "2kVScZxIkttB",
      onSuccess: onConnect,
      onFailure: doFail
    }

    // connect the client
    client.connect(options);

    // called when the client connects
    function onConnect() {
      // Once a connection has been made, make a subscription and send a message.
      console.log("onConnect");
      $ionicLoading.hide();
      $scope.desligaTodas();
      //client.subscribe("esp8266/pincmd");
    }

    function doFail(e) {
      console.log(e);
    }

    // called when the cient loses its connection
    function onConnectionLost(responseObject) {
      if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
      }
    }

    // called when a message arrives
    function onMessageArrived(message) {
      console.log("onMessageArrived:" + message.payloadString);
    }

    $scope.lampadas = [
      'off','off','off','off'
    ];

    $scope.ligaLampada = function(id)
    {
      $scope.desliga_todas = false;
      $scope.lampadas[id] = 'on';
      message = new Paho.MQTT.Message('liga'+(id+1));
      message.destinationName = "esp8266/pincmd";
      client.send(message);
    }

    $scope.desligaLampada = function(id)
    {
      $scope.liga_todas = false;
      $scope.lampadas[id] = 'off';
      message = new Paho.MQTT.Message('desliga'+(id+1));
      message.destinationName = "esp8266/pincmd";
      client.send(message);
    }

    $scope.toggleLampada = function(id) {
      if($scope.lampadas[id] == 'off'){
        $scope.ligaLampada(id);
      } else {
        $scope.desligaLampada(id);
      }
    }

    $scope.liga_todas = false;
    $scope.ligaTodas = function()
    {
      $scope.modo_festa = false;
      $scope.modo_viagem = false;
      $scope.desliga_todas = false;
      $scope.liga_todas = true;
      $scope.ligaLampada(0);
      $scope.ligaLampada(1);
      $scope.ligaLampada(2);
      $scope.ligaLampada(3);
    }

    $scope.desliga_todas = false;
    $scope.desligaTodas = function()
    {
        $scope.modo_festa = false;
        $scope.modo_viagem = false;
      $scope.desliga_todas = true;
      $scope.liga_todas = false;
      $scope.desligaLampada(0);
      $scope.desligaLampada(1);
      $scope.desligaLampada(2);
      $scope.desligaLampada(3);
    }

    $scope.modo_festa = false;

    $scope.modoFesta = function(tempo){
      if($scope.modo_festa){
        var i = Math.floor(Math.random() * 4);
        $scope.ligaLampada(i);
        setTimeout(function () {
          $scope.desligaLampada(i);
          $scope.modoFesta(tempo);
          $scope.$apply();
        }, tempo);
      }
    }

    $scope.toggleModoFesta = function(tempo)
    {
      $scope.modo_festa = !$scope.modo_festa;
      $scope.modo_viagem = false;
      if($scope.modo_festa)
        $scope.modoFesta(tempo);
    }

    $scope.modoViagem = function(tempo){
      if($scope.modo_viagem){
        var i = Math.floor(Math.random() * 4);
        $scope.ligaLampada(i);
        setTimeout(function () {
          $scope.desligaLampada(i);
          $scope.modoViagem(tempo);
          $scope.$apply();
        }, tempo);
      }
    }

    $scope.modo_viagem = false;
    $scope.toggleModoViagem = function(tempo)
    {
      $scope.modo_festa = false;
      $scope.modo_viagem = !$scope.modo_viagem;
      if($scope.modo_viagem)
        $scope.modoViagem(tempo);
    }

  }]);
