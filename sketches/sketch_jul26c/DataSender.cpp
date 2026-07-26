#include "DataSender.h"
#include <ESP8266WiFi.h>
#include <ArduinoJson.h>

DataSender::DataSender(const String& serverUrl) : _serverUrl(serverUrl) {}

bool DataSender::send(const std::vector<Sensor*>& sensors, const String& detectorName) {
    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("Нет Wi-Fi");
        return false;
    }

    StaticJsonDocument<256> doc;
    doc["deviceId"] = detectorName;                // <<-- обязательное поле
    // doc["timestamp"] = millis();               // опционально, можно добавить

    // Каждый датчик добавляет свои поля в корневой объект
    for (auto* s : sensors) {
        s->addToJson(doc.as<JsonObject>());
    }

    String payload;
    serializeJson(doc, payload);

    Serial.print("Отправка JSON: ");
    Serial.println(payload);

    _http.begin(_client, _serverUrl);
    _http.addHeader("Content-Type", "application/json");
    int httpCode = _http.POST(payload);

    bool success = false;
    if (httpCode > 0) {
        Serial.printf("Код ответа: %d\n", httpCode);
        String response = _http.getString();
        Serial.println("Ответ сервера: " + response);
        success = true;
    } else {
        Serial.printf("Ошибка HTTP: %d\n", httpCode);
    }
    _http.end();
    return success;
}