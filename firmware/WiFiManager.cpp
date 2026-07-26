#include "WiFiManager.h"
#include <Arduino.h>

WiFiManager::WiFiManager(const char* ssid, const char* password)
    : _ssid(ssid), _password(password) {}

bool WiFiManager::connect() {
    WiFi.begin(_ssid, _password);
    Serial.print("Подключение к Wi-Fi");
    int attempts = 0;
    while (WiFi.status() != WL_CONNECTED && attempts < 20) {
        delay(500);
        Serial.print(".");
        attempts++;
    }
    if (WiFi.status() == WL_CONNECTED) {
        Serial.println("\nПодключено! IP: " + WiFi.localIP().toString());
        return true;
    } else {
        Serial.println("\nОшибка подключения");
        return false;
    }
}

bool WiFiManager::isConnected() const {
    return WiFi.status() == WL_CONNECTED;
}