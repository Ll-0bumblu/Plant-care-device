#pragma once
#include "Sensor.h"

class SoilMoistureSensor : public Sensor {
public:
    SoilMoistureSensor(int powerPin, int analogPin, int dryValue, int wetValue);
    void read() override;
    void addToJson(JsonObject obj) const override;
    float getMoisturePercent() const { return _moisturePercent; }
private:
    int _powerPin;
    int _analogPin;
    int _dryValue;
    int _wetValue;
    float _moisturePercent;
};