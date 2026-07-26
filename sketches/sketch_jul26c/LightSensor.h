#pragma once
#include "Sensor.h"

class LightSensor : public Sensor {
public:
    LightSensor(int powerPin, int analogPin, bool invert = false);
    void read() override;
    void addToJson(JsonObject obj) const override;
    float getLightPercent() const { return _lightPercent; }
private:
    int _powerPin;
    int _analogPin;
    bool _invert;
    float _lightPercent;
};