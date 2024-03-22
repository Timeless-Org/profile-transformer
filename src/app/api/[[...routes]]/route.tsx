/** @jsxImportSource frog/jsx */

import { Button, Frog } from "frog";
import { neynar } from "frog/middlewares";
import { handle } from "frog/next";

interface State {
  top: number;
  left: number;
  direction: string;
}

const app = new Frog<{ State: State }>({
  assetsPath: "/",
  basePath: "/api",
  initialState: {
    top: 50,
    left: 50,
    direction: "vertical",
  },
});

app.frame("/", (c) => {
  return c.res({
    action: "/check",
    image: `${process.env.NEXT_PUBLIC_SITE_URL}/start`,
    intents: [<Button value="action">put a cat on your shoulder</Button>],
  });
});

app.frame("/check", (c) => {
  return c.res({
    action: "/check",
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
    // const imageUrl = c.res;
    console.log(`c.frameData: ${JSON.stringify(c)}`);
    const { pfpUrl } = c.var.interactor || {};
    const state = deriveState((previousState: any) => {
      if (buttonValue === "up")
        previousState.top >= 5 ? (previousState.top -= 5) : "";
      if (buttonValue === "down")
        previousState.top <= 95 ? (previousState.top += 5) : "";
      if (buttonValue === "left")
        previousState.left >= 5 ? (previousState.left -= 5) : "";
      if (buttonValue === "right")
        previousState.left <= 95 ? (previousState.left += 5) : "";
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
        // <Button value="proceed">Proceed</Button>,
        <Button.Link
          href={`${process.env.NEXT_PUBLIC_SITE_URL}/create?top=${state.top}&pfpUrl=${pfpUrl}&left=${state.left}`}
          // http://localhost:3000/create?top=50&amp;amp;pfpUrl=https://i.imgur.com/LwSPyFy.jpg&amp;amp;left=50
          // http://localhost:3000/create?top=50&amp;pfpUrl=https://i.imgur.com/LwSPyFy.jpg&amp;left=50
        >
          Download
        </Button.Link>,
      ],
    });
  });

export const GET = handle(app);
export const POST = handle(app);
