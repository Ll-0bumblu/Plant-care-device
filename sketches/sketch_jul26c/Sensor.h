#pragma once
#include <Arduino.h>
#include <ArduinoJson.h>

class Sensor {
public:
    virtual ~Sensor() {}
    virtual void read() = 0;
    virtual void addToJson(JsonObject obj) const = 0; 
};