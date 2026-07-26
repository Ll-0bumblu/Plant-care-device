#include "SoilMoistureSensor.h"

SoilMoistureSensor::SoilMoistureSensor(int powerPin, int analogPin, int dryValue, int wetValue)
    : _powerPin(powerPin), _analogPin(analogPin), _dryValue(dryValue), _wetValue(wetValue) {
    pinMode(_powerPin, OUTPUT);
    digitalWrite(_powerPin, LOW);
}

void SoilMoistureSensor::read() {
    digitalWrite(_powerPin, HIGH);
    delay(100);
    int raw = analogRead(_analogPin);
    digitalWrite(_powerPin, LOW);
    _moisturePercent = map(raw, _dryValue, _wetValue, 0, 100);
    _moisturePercent = constrain(_moisturePercent, 0, 100);
}

void SoilMoistureSensor::addToJson(JsonObject obj) const {
    obj["soilMoisture"] = _moisturePercent;
}