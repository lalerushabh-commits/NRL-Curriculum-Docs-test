---
title: "Module 5.8: Glossary"
sidebar_position: 8
slug: /phase-5-wiring-wireless-and-the-whole-robot/glossary
---

Every term this book leans on, in one place.

| Term | Meaning |
| --- | --- |
| ADC | Analog-to-digital converter — turns a voltage into a number the brain can use; the Hub's is the 10-bit MCP3008 ([Module 4.5](/phase-4-motion-and-sensing/analog-and-digital-signals)) |
| Analog / Digital | Smoothly varying signal / two-state (ON-OFF) signal ([Module 4.5](/phase-4-motion-and-sensing/analog-and-digital-signals)) |
| Battery checker | Pocket instrument that reads a pack's voltage through its XT30 ([Module 3.2](/phase-3-power/charging-checking-and-battery-care)) |
| BMS | Battery Management System — the protection and cell-balancing board inside the pack ([Module 3.1](/phase-3-power/the-battery-and-the-bms)) |
| Brownout | A reset caused by battery voltage sagging under load ([Module 3.4](/phase-3-power/brownouts-and-power-monitoring)) |
| Bus (I2C, UART, SPI) | A shared digital "conversation line" for smart devices ([Module 4.6](/phase-4-motion-and-sensing/buses-i2c-uart-and-spi)) |
| Cell balancing | The BMS keeping all cells in a pack evenly charged ([Module 3.1](/phase-3-power/the-battery-and-the-bms)) |
| Current (A) | The flow of electricity, in amps — drawn by the load ([Module 1.2](/phase-1-electronics-foundations/a-five-minute-electricity-primer)) |
| Debounce | Smoothing a button's electrical bounce into one clean press ([Module 5.4](/phase-5-wiring-wireless-and-the-whole-robot/conclusion-and-next-steps)) |
| DIR / PWM lines | The two commands per motor channel: direction, and the speed-setting pulse signal ([Module 4.3](/phase-4-motion-and-sensing/the-motor-driver)–[4.4](/phase-4-motion-and-sensing/pwm-controlling-power-with-pulses)) |
| Duty cycle | The percentage of each PWM cycle spent ON — the throttle setting ([Module 4.4](/phase-4-motion-and-sensing/pwm-controlling-power-with-pulses)) |
| ESP-NOW | The fast, direct wireless protocol carrying driving commands over Hexa Link ([Module 5.3](/phase-5-wiring-wireless-and-the-whole-robot/conclusion-and-next-steps)) |
| H-bridge | Four switches that let one motor run both directions at any speed ([Module 4.3](/phase-4-motion-and-sensing/the-motor-driver)) |
| Heading | The direction the robot faces, tracked by the IMU's gyroscope ([Module 4.7](/phase-4-motion-and-sensing/the-imu)) |
| Hexa Link | The 2.4 GHz wireless link between Controller and Command Hub ([Module 1.1](/phase-1-electronics-foundations/welcome-to-nrl-electronics), [5.3](/phase-5-wiring-wireless-and-the-whole-robot/conclusion-and-next-steps)) |
| IMU | Inertial measurement unit — accelerometer + gyroscope; the LSM6DSOXTR on both boards ([Module 4.7](/phase-4-motion-and-sensing/the-imu)) |
| MISO / MOSI / SCLK / CS | The SPI bus wires: data in, data out, clock, and chip-select ([Module 4.6](/phase-4-motion-and-sensing/buses-i2c-uart-and-spi)) |
| PWM | Pulse-Width Modulation — delivering partial power by fast ON/OFF switching ([Module 4.4](/phase-4-motion-and-sensing/pwm-controlling-power-with-pulses)) |
| Rail | One regulated supply voltage distributed across the board (servo rail, 5 V, 3.3 V) ([Module 3.3](/phase-3-power/the-power-path)) |
| Regulator | A circuit that turns rough battery voltage into a clean, steady rail ([Module 3.3](/phase-3-power/the-power-path)) |
| Sag | The temporary drop in battery voltage under heavy load ([Module 3.2](/phase-3-power/charging-checking-and-battery-care), [3.4](/phase-3-power/brownouts-and-power-monitoring)) |
| SDA / SCL | The I2C bus wires: serial data and serial clock ([Module 4.6](/phase-4-motion-and-sensing/buses-i2c-uart-and-spi)) |
| Series / Parallel | End-to-end (voltages add) / side-by-side (same voltage, own currents) ([Module 1.2](/phase-1-electronics-foundations/a-five-minute-electricity-primer)) |
| Silkscreen | The printed labels on a circuit board — always worth reading ([Module 1.3](/phase-1-electronics-foundations/reading-the-robot)) |
| Stall | A powered motor forced to a stop — maximum current, pure heat ([Module 4.1](/phase-4-motion-and-sensing/dc-motors-and-gearboxes)) |
| Telemetry | Live robot data streamed to the Controller's screen ([Module 5.4](/phase-5-wiring-wireless-and-the-whole-robot/conclusion-and-next-steps)) |
| Torque | Turning force — what gearboxes trade speed to get ([Module 4.1](/phase-4-motion-and-sensing/dc-motors-and-gearboxes)) |
| TX / RX | The UART wires: transmit and receive — always connected crosswise ([Module 4.6](/phase-4-motion-and-sensing/buses-i2c-uart-and-spi)) |
| U.FL | The tiny snap-on antenna connector — delicate, limited cycles ([Module 5.3](/phase-5-wiring-wireless-and-the-whole-robot/conclusion-and-next-steps)) |
| Voltage (V) | The electrical "push," in volts — and your battery fuel gauge ([Module 1.2](/phase-1-electronics-foundations/a-five-minute-electricity-primer), [3.1](/phase-3-power/the-battery-and-the-bms)) |
| Voltage divider | Two resistors that scale a big voltage down to a measurable one ([Module 3.4](/phase-3-power/brownouts-and-power-monitoring)) |
| XT30 / JST-XH / JST-VH | The kit's power and signal connector families ([Module 5.1](/phase-5-wiring-wireless-and-the-whole-robot/conclusion-and-next-steps)) |
