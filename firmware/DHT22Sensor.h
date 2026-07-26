#pragma once
#include "Sensor.h"
#include <DHT.h>

class DHT22Sensor : public Sensor {
public:
    DHT22Sensor(int pin);
    void read() override;
    void addToJson(JsonObject obj) const override;
    float getTemperature() const { return _temperature; }
    float getHumidity() const { return _humidity; }
private:
    DHT _dht;
    float _temperature;
    float _humidity;
};