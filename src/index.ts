import {
  turnOn,
  turnOff,
  setBrightness,
  setLightParams,
  loginDeviceByIp,
  setColourTemperature,
  getDeviceInfo,
  LightParams,
} from "../tp-link-tapo-connect";
import { config } from "dotenv";
import express, { query } from "express";

config();
const app = express();

const port = process.env.PORT || 8002;
const ip = process.env.DEVICEIP;
const email = process.env.EMAIL;
const password = process.env.PASSWORD;

function checkNumber(
  value: number,
  upper: number = 100,
  lower: number = 1
): boolean {
  const output = !(isNaN(value) || value > upper || value < lower);
  if (!output) {
      console.log(value);
  }
  return output;
}

function checkLightParams(lightParams: LightParams): boolean {
  return (
    checkNumber(lightParams.hue ?? 0, 360, 0) &&
    checkNumber(lightParams.color_temp ?? 2500, 6500, 2500) &&
    checkNumber(lightParams.brightness ?? 1, 100, 1) &&
    checkNumber(lightParams.saturation ?? 0, 100, 0)
  );
}

async function doThingIfAllgood<T>(
  value: T,
  check: (value: T) => boolean,
  iotFunction: (tok: any, value: T) => Promise<any>
): Promise<string> {
  if (check(value)) {
    await iotFunction(await token(), value);
    return "Noice";
  }
  return "Not noice";
}

async function token() {
  return await loginDeviceByIp(email, password, ip);
}

app.get("/off", async (req, resp) => {
  await turnOff(await token());
  resp.send("success");
});

app.get("/on", async (req, resp) => {
  await turnOn(await token());
  resp.send("hello world");
});

app.get("/colour", async (req, resp) => {
  const previous = await getDeviceInfo(await token());

  // weird fuckery to allow a value of 0.
  const inputHue = +req.query.hue || +req.query.h;
  const previousHue = +previous.hue;
  const hue = inputHue === 0 || inputHue ? inputHue : previousHue

  const colourParams: LightParams = {
    hue,
    saturation: +req.query.saturation || +req.query.s || +previous.saturation,
    brightness: +req.query.brightness || +req.query.l || undefined,
  };
  resp.send(
    await doThingIfAllgood<LightParams>(
      colourParams,
      (v) => checkLightParams(v),
      setLightParams
    )
  );
});

app.get("/standard", async (req, resp) => {
    const colourParams: LightParams = {
      color_temp: +req.query.color_temp || +req.query.t || +req.query.temperature || undefined,
      brightness: +req.query.brightness || +req.query.l || undefined,
    };
    resp.send(
      await doThingIfAllgood<LightParams>(
        colourParams,
        (v) => checkLightParams(v),
        setLightParams
      )
    );
  });

app.get("/info", async (req, resp) => {
  resp.send(await getDeviceInfo(await token()));
});

// start the Express server
app.listen(+port, "0.0.0.0", () => {
  console.log(`server started at http://localhost:${port}`);
});
