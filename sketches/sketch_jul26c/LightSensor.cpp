#include "LightSensor.h"

LightSensor::LightSensor(int powerPin, int analogPin, bool invert)
    : _powerPin(powerPin), _analogPin(analogPin), _invert(invert) {
    pinMode(_powerPin, OUTPUT);
    digitalWrite(_powerPin, LOW);
}

void LightSensor::read() {
    digitalWrite(_powerPin, HIGH);
    delay(100);
    int raw = analogRead(_analogPin);
    digitalWrite(_powerPin, LOW);
    if (_invert) raw = 1023 - raw;
    _lightPercent = map(raw, 0, 1023, 0, 100);
    _lightPercent = constrain(_lightPercent, 0, 100);
}

void LightSensor::addToJson(JsonObject obj) const {
    obj["illuminance"] = _lightPercent;
}