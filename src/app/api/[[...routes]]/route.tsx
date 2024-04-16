/** @jsxImportSource frog/jsx */

import { Button, Frog } from "frog";
import { neynar } from "frog/middlewares";
import { neynar as neynarHub } from "frog/hubs";
import { handle } from "frog/next";
import { v2 as cloudinary } from "cloudinary";
import profileMemeAbi from "../../utils/profileMemeAbi.json";
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
    top: 20,
    left: 50,
    size: 120,
    direction: "vertical",
    cloudinary: false,
    img: "enjoy",
  },
  hub: neynarHub({ apiKey: "NEYNAR_FROG_FM" }),
  verify: process.env.NODE_ENV === "development" ? "silent" : true,
  headers: {
    "Cache-Control": "max-age=0",
  },
});

app.frame("/", async (c) => {
  const imagePath = "/assets/static/start.png";
  return c.res({
    action: "/check",
    image: imagePath,
    // image: `${process.env.NEXT_PUBLIC_SITE_URL}/start`,
    intents: [<Button>put a meme on your profile</Button>],
  });
});

app.frame("/check", async (c) => {
  return c.res({
    action: "/create",
    image: `${process.env.NEXT_PUBLIC_SITE_URL}/check`,
    intents: [
      // <Button action="/create/enjoy">Enjoy</Button>,
      <Button action="/create/hat">Degen Hat</Button>,
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
  .frame("/create/:img", async (c) => {
    const { img } = c.req.param();
    console.log(`img: ${img}`);
    const { buttonValue, deriveState } = c;
    const { pfpUrl } = c.var.interactor || {};
    const state = deriveState((previousState: any) => {
      if (buttonValue === "up")
        previousState.top >= 5 ? (previousState.top -= 5) : "";
      if (buttonValue === "down")
        previousState.top <= 95 ? (previousState.top += 5) : "";
      if (buttonValue === "left")
        previousState.left >= 3 ? (previousState.left -= 3) : "";
      if (buttonValue === "right")
        previousState.left <= 97 ? (previousState.left += 3) : "";
      if (buttonValue === "vertical")
        previousState.direction !== "vertical"
          ? (previousState.direction = "vertical")
          : "";
      if (buttonValue === "horizon")
        previousState.direction !== "horizon"
          ? (previousState.direction = "horizon")
          : "";
      if (img !== previousState.img) {
        previousState.img = img;
      }
    }) as State;

    return c.res({
      action: `/create/${state.img}`,
      image: `${
        process.env.NEXT_PUBLIC_SITE_URL
      }/create?top=${state.top.toString()}&pfpUrl=${pfpUrl}&left=${state.left.toString()}&size=${
        state.size
      }&img=${state.img}`,
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
        <Button action="/resize">Proceed</Button>,
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
  .frame("/display", async (c) => {
    const { deriveState } = c;
    const { pfpUrl } = c.var.interactor || {};
    const state = deriveState(() => {}) as State;

    return c.res({
      action: `/display`,
      image: `${
        process.env.NEXT_PUBLIC_SITE_URL
      }/display?top=${state.top.toString()}&pfpUrl=${pfpUrl}&left=${state.left.toString()}&size=${
        state.size
      }&img=${state.img}`,
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
  .frame("/resize", async (c) => {
    const { buttonValue, deriveState } = c;
    const { pfpUrl } = c.var.interactor || {};
    const state = deriveState((previousState: any) => {
      if (buttonValue === "down")
        previousState.size >= 10 ? (previousState.size -= 10) : "";
      if (buttonValue === "up")
        previousState.size <= 480 ? (previousState.size += 10) : "";
    }) as State;

    return c.res({
      action: `/resize`,
      image: `${
        process.env.NEXT_PUBLIC_SITE_URL
      }/create?top=${state.top.toString()}&pfpUrl=${pfpUrl}&left=${state.left.toString()}&size=${
        state.size
      }&img=${state.img}`,
      intents: [
        <Button value="mint" action={`/create/${state.img}`}>
          ←
        </Button>,
        <Button value="down">-</Button>,
        <Button value="up">+</Button>,
        <Button
          value={`${
            process.env.NEXT_PUBLIC_SITE_URL
          }/display?top=${state.top.toString()}&pfpUrl=${pfpUrl}&left=${state.left.toString()}&size=${
            state.size
          }&img=${state.img}`}
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
  .frame("/upload", async (c) => {
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
        <Button action="/resize">←</Button>,
        <Button.Transaction target={`/mint/${imageUrl}`}>
          Mint
        </Button.Transaction>,
        <Button.Link
          href={`${process.env.NEXT_PUBLIC_SITE_URL}/create?top=${
            state.top
          }&pfpUrl=${encodeURIComponent(pfpUrl || "")}&left=${
            state.left
          }&size=${state.size}&img=${state.img}`}
        >
          Download
        </Button.Link>,
      ],
    });
  });

app.transaction("/mint/:imageUrl", async (c) => {
  const { imageUrl } = c.req.param();
  console.log(`imageUrl: ${imageUrl}`);
  return c.contract({
    abi: profileMemeAbi,
    chainId: "eip155:84532",
    functionName: "safeMint",
    to: "0x3A387873306f907D34E879eb8b0c7C0033374523",
    args: [`${imageUrl}`],
  });
});

devtools(app, { appFid: 227285, serveStatic });

export const GET = handle(app);
export const POST = handle(app);
