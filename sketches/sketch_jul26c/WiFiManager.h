#pragma once
#include <ESP8266WiFi.h>

class WiFiManager {
public:
    WiFiManager(const char* ssid, const char* password);
    bool connect();          
    bool isConnected() const;
private:
    const char* _ssid;
    const char* _password;
};