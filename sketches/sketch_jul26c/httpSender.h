#pragma once

#include <Arduino.h> 
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

bool sendDataToServer(const String& serverUrl, const String& payload);