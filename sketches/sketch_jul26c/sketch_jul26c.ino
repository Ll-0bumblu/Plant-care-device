#include <vector>
#include "WiFiManager.h"
#include "DHT22Sensor.h"
#include "SoilMoistureSensor.h"
#include "LightSensor.h"
#include "DataSender.h"

// Настройки
const char* ssid = "NASA";
const char* password = "50747016";
const char* detectorName = "detector_1";
const String serverUrl = "http://192.168.1.107:3000/api/measurements";

// Пины
const int DHT_PIN = 12;
const int SOIL_POWER = 13;
const int SOIL_ANALOG = A0;   
const int LIGHT_POWER = 14;
const int LIGHT_ANALOG = A0;  

// Калибровка датчика влажности почвы
const int SOIL_DRY = 330;
const int SOIL_WET = 280;

// Объекты
WiFiManager wifi(ssid, password);
DHT22Sensor dht(DHT_PIN);
SoilMoistureSensor soil(SOIL_POWER, SOIL_ANALOG, SOIL_DRY, SOIL_WET);
LightSensor light(LIGHT_POWER, LIGHT_ANALOG, false); 

std::vector<Sensor*> sensors = { &dht, &soil, &light };

DataSender sender(serverUrl);

unsigned long previousMillis = 0;
const long interval = 10* 1000;  // 10 секунд

void setup() {
    Serial.begin(9600);
    if (!wifi.connect()) {
        Serial.println("Не удалось подключиться к Wi-Fi, перезагрузка...");
        ESP.restart();
    }
}

void loop() {
    unsigned long currentMillis = millis();
    if (currentMillis - previousMillis >= interval) {
        previousMillis = currentMillis;

        // Читаю все датчики
        for (auto* s : sensors) {
            s->read();
        }

        if (sender.send(sensors, detectorName)) {
            Serial.println("Данные отправлены успешно");
        } else {
            Serial.println("Ошибка отправки");
        }
    }
    delay(100);
}