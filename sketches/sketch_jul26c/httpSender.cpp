#include "httpSender.h"

bool sendDataToServer(const String& serverUrl, const String& payload) {
    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("Ошибка: нет Wi-Fi подключения");
        return false;
    }

    WiFiClient client;
    HTTPClient http;

    http.begin(client, serverUrl);          
    http.addHeader("Content-Type", "application/json");

    int httpCode = http.POST(payload);

    bool success = false;
    
    if (httpCode > 0) {
        Serial.print("Код ответа: ");
        Serial.println(httpCode);
        success = true;
    } else {
        Serial.print("Ошибка HTTP: ");
        Serial.println(httpCode);
        success = false;
    }

    http.end();
    return success;
}