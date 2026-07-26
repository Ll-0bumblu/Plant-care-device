#pragma once
#include <Arduino.h>          
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <vector>             
#include "Sensor.h"            

class DataSender {
public:
    DataSender(const String& serverUrl);
    bool send(const std::vector<Sensor*>& sensors, const String& detectorName);
private:
    String _serverUrl;
    WiFiClient _client;
    HTTPClient _http;
};