/** @jsxImportSource frog/jsx */

import { Button, Frog } from "frog";
import { neynar } from "frog/middlewares";
import { handle } from "frog/next";
import { v2 as cloudinary } from "cloudinary";
import abi from "../../utils/abi.json";
import { State } from "../../utils/types";
import { devtools } from "frog/dev";
import { serveStatic } from "frog/serve-static";

cloudinary.config({
  cloud_name: "dtwhotpyc",
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_SECRET,
});

const app = new Frog<{ State: State }>({
  assetsPath: "/",
  basePath: "/api",
  initialState: {
    top: 50,
    left: 50,
    direction: "vertical",
    cloudinary: false,
  },
});

app.frame("/", (c) => {
  const imagePath = "/assets/static/start.png";
  return c.res({
    action: "/check",
    // image: `${process.env.NEXT_PUBLIC_SITE_URL}/start`,
    // image: `${process.env.NEXT_PUBLIC_SITE_URL}/assets/static/start.png`,
    image: imagePath,
    intents: [<Button value="action">put a cat on your shoulder</Button>],
  });
});

app.frame("/check", (c) => {
  return c.res({
    action: "/create",
    image: `${process.env.NEXT_PUBLIC_SITE_URL}/check`,
    intents: [
      // <Button value="check">Check for eligibility</Button>,
      // <Button value="mint">Mint cat NFT</Button>,
      <Button value="" action="/create">
        Create New PFP
      </Button>,
    ],
  });
});

app
  .use(
    neynar({
      apiKey: "NEYNAR_FROG_FM",
      features: ["interactor"],
    })
  )
  .frame("/create", (c) => {
    const { buttonValue, deriveState } = c;
    const { pfpUrl } = c.var.interactor || {};
    const state = deriveState((previousState: any) => {
      if (buttonValue === "up")
        previousState.top >= 2 ? (previousState.top -= 2) : "";
      if (buttonValue === "down")
        previousState.top <= 98 ? (previousState.top += 2) : "";
      if (buttonValue === "left")
        previousState.left >= 2 ? (previousState.left -= 2) : "";
      if (buttonValue === "right")
        previousState.left <= 98 ? (previousState.left += 2) : "";
      if (buttonValue === "vertical")
        previousState.direction !== "vertical"
          ? (previousState.direction = "vertical")
          : "";
      if (buttonValue === "horizon")
        previousState.direction !== "horizon"
          ? (previousState.direction = "horizon")
          : "";
    }) as State;

    return c.res({
      action: `/create`,
      image: `${
        process.env.NEXT_PUBLIC_SITE_URL
      }/create?top=${state.top.toString()}&pfpUrl=${pfpUrl}&left=${state.left.toString()}`,
      intents: [
        <Button value={state.direction === "vertical" ? "up" : "left"}>
          {state.direction === "vertical" ? "👆" : "👈"}
        </Button>,
        <Button value={state.direction === "vertical" ? "down" : "right"}>
          {state.direction === "vertical" ? "👇" : "👉"}
        </Button>,
        <Button value={state.direction === "vertical" ? "horizon" : "vertical"}>
          {state.direction === "vertical" ? "R / L" : "UP / DOWN"}
        </Button>,
        <Button
          value={`${
            process.env.NEXT_PUBLIC_SITE_URL
          }/display?top=${state.top.toString()}&pfpUrl=${pfpUrl}&left=${state.left.toString()}.png`}
          action="/upload"
        >
          Proceed
        </Button>,
      ],
    });
  });

app
  .use(
    neynar({
      apiKey: "NEYNAR_FROG_FM",
      features: ["interactor"],
    })
  )
  .frame("/display", (c) => {
    const { deriveState } = c;
    const { pfpUrl } = c.var.interactor || {};
    const state = deriveState(() => {}) as State;

    return c.res({
      action: `/display`,
      image: `${
        process.env.NEXT_PUBLIC_SITE_URL
      }/display?top=${state.top.toString()}&pfpUrl=${pfpUrl}&left=${state.left.toString()}`,
      intents: [],
    });
  });

app
  .use(
    neynar({
      apiKey: "NEYNAR_FROG_FM",
      features: ["interactor"],
    })
  )
  .frame("/upload", (c) => {
    const { buttonValue, deriveState } = c;
    const { pfpUrl } = c.var.interactor || {};
    const imageUrl = Date.now().toString();
    const state = deriveState((previousState: any) => {
      if (!previousState.cloudinary) {
        previousState.cloudinary = true;
        cloudinary.uploader.upload(
          buttonValue || "",
          { public_id: imageUrl },
          function (error, result) {
            console.log(result);
            previousState.cloudinary = false;
          }
        );
      }
    }) as State;

    return c.res({
      action: "/mint",
      image: buttonValue || "",
      intents: [
        <Button value="mint" action="/create">
          ←
        </Button>,
        <Button.Transaction target={`/mint/${imageUrl}`}>
          Mint
        </Button.Transaction>,
        <Button.Link
          href={`${process.env.NEXT_PUBLIC_SITE_URL}/create?top=${
            state.top
          }&pfpUrl=${encodeURIComponent(pfpUrl || "")}&left=${state.left}`}
        >
          Download
        </Button.Link>,
      ],
    });
  });

app.transaction("/mint/:imageUrl", (c) => {
  const { imageUrl } = c.req.param();
  return c.contract({
    abi,
    chainId: "eip155:84532",
    functionName: "mint",
    args: [`${imageUrl}.png`],
    to: "0x1B9B93331BB7701baE72dE78F8a4647c06f8bAE7",
  });
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
