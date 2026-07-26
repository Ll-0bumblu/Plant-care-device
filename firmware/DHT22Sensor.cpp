#include "DHT22Sensor.h"

DHT22Sensor::DHT22Sensor(int pin) : _dht(pin, DHT22) {
    _dht.begin();
}

void DHT22Sensor::read() {
    _temperature = _dht.readTemperature();
    _humidity = _dht.readHumidity();
    if (isnan(_temperature) || isnan(_humidity)) {
        Serial.println("Ошибка чтения DHT22");
        _temperature = -999;
        _humidity = -999;
    }
}

void DHT22Sensor::addToJson(JsonObject obj) const {
    obj["temperature"] = _temperature;
    obj["humidityAir"] = _humidity;
}