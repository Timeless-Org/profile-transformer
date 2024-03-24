/** @jsxImportSource frog/jsx */

import { Button, Frog } from "frog";
import { neynar } from "frog/middlewares";
import { neynar as neynarHub } from "frog/hubs";
import { handle } from "frog/next";
import { v2 as cloudinary } from "cloudinary";
import catMemeAbi from "../../utils/catMemeAbi.json";
import shoulderCatMemeAbi from "../../utils/shoulderCatMemeAbi.json";
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
    size: 120,
    direction: "vertical",
    cloudinary: false,
  },
  hub: neynarHub({ apiKey: "NEYNAR_FROG_FM" }),
  verify: process.env.NODE_ENV === "development" ? "silent" : true,
  headers: {
    "Cache-Control": "max-age=0",
  },
});

app.frame("/", (c) => {
  const imagePath = "/assets/static/start.png";
  return c.res({
    action: "/check",
    image: imagePath,
    intents: [<Button>put a cat on your shoulder</Button>],
  });
});

app.frame("/check", (c) => {
  return c.res({
    action: "/create",
    image: `${process.env.NEXT_PUBLIC_SITE_URL}/check`,
    intents: [
      // <Button value="check">Check for eligibility</Button>,
      <Button.Transaction target="/mint-cat/2" action="/create/2">
        Mint cat NFT #2
      </Button.Transaction>,
      <Button.Transaction target="/mint-cat/3" action="/create/3">
        Mint cat NFT #3
      </Button.Transaction>,
      <Button.Transaction target="/mint-cat/4" action="/create/4">
        Mint cat NFT #4
      </Button.Transaction>,
      <Button action="/create/1">Create New PFP free</Button>,
    ],
  });
});

app.transaction("/mint-cat/:id", async (c) => {
  const { id } = c.req.param();
  return c.contract({
    abi: catMemeAbi,
    chainId: "eip155:84532",
    functionName: "safeMint",
    to: "0x869a39930Fb203deE78153e2Ed0393CDd975f0ff",
    args: [`cat/cat${id}.png`],
  });
});

app
  .use(
    neynar({
      apiKey: "NEYNAR_FROG_FM",
      features: ["interactor"],
    })
  )
  .frame("/create/:id", (c) => {
    const { id } = c.req.param();
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
      if (Number(id) >= 1 && Number(id) !== previousState.cat) {
        previousState.cat = Number(id);
      }
    }) as State;

    return c.res({
      action: `/create/${state.cat}`,
      image: `${process.env.NEXT_PUBLIC_SITE_URL}/create/${
        state.cat
      }?top=${state.top.toString()}&pfpUrl=${pfpUrl}&left=${state.left.toString()}&size=${
        state.size
      }&cat=${state.cat}`,
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
  .frame("/display", (c) => {
    const { deriveState } = c;
    const { pfpUrl } = c.var.interactor || {};
    const state = deriveState(() => {}) as State;

    return c.res({
      action: `/display`,
      image: `${
        process.env.NEXT_PUBLIC_SITE_URL
      }/display?top=${state.top.toString()}&pfpUrl=${pfpUrl}&left=${state.left.toString()}&size=${
        state.size
      }&cat=${state.cat}`,
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
  .frame("/resize", (c) => {
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
      image: `${process.env.NEXT_PUBLIC_SITE_URL}/create/${
        state.cat
      }?top=${state.top.toString()}&pfpUrl=${pfpUrl}&left=${state.left.toString()}&size=${
        state.size
      }&cat=${state.cat}`,
      intents: [
        <Button value="mint" action={`/create/${state.cat}`}>
          ←
        </Button>,
        <Button value="down">-</Button>,
        <Button value="up">+</Button>,
        <Button
          value={`${
            process.env.NEXT_PUBLIC_SITE_URL
          }/display?top=${state.top.toString()}&pfpUrl=${pfpUrl}&left=${state.left.toString()}&size=${
            state.size
          }&cat=${state.cat}.png`}
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
        <Button action="/resize">←</Button>,
        <Button.Transaction target={`/mint/${imageUrl}`}>
          Mint
        </Button.Transaction>,
        <Button.Link
          href={`${process.env.NEXT_PUBLIC_SITE_URL}/create/${state.cat}?top=${
            state.top
          }&pfpUrl=${encodeURIComponent(pfpUrl || "")}&left=${
            state.left
          }&size=${state.size}&cat=${state.cat}`}
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
    abi: shoulderCatMemeAbi,
    chainId: "eip155:84532",
    functionName: "safeMint",
    to: "0x1B9B93331BB7701baE72dE78F8a4647c06f8bAE7",
    args: [`${imageUrl}.png`],
  });
});

devtools(app, { appFid: 227285, serveStatic });

export const GET = handle(app);
export const POST = handle(app);
