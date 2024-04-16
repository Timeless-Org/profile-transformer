// @ts-nocheck
import { ImageResponse } from "next/og";

export const runtime = "edge";

export const GET = async (request: Request) => {
  const mochiyPopOneFontData = await fetch(
    new URL("../../public/assets/fonts/MochiyPopOne.ttf", import.meta.url)
  ).then((res) => res.arrayBuffer());

  const ariBlkFontData = await fetch(
    new URL("../../public/assets/fonts/ariblk.ttf", import.meta.url)
  ).then((res) => res.arrayBuffer());

  const enjoyImage = await fetch(
    new URL("../../public/assets/static/enjoy.png", import.meta.url)
  ).then((res) => res.arrayBuffer());
  const hatImage = await fetch(
    new URL("../../public/assets/static/hat.png", import.meta.url)
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#260f3f",
          backgroundSize: "100% 100%",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "flex-start",
          textAlign: "center",
          width: "100%",
        }}
      >
        <p
          style={{
            color: "white",
            fontSize: 50,
            fontFamily: '"Mochiy Pop One"',
            marginTop: 50,
          }}
        >
          Which meme do you want?
        </p>
        <div
          style={{
            alignItems: "center",
            display: "flex",
            flexDirection: "row",
            height: "100%",
            justifyContent: "space-around",
            textAlign: "center",
            width: "100%",
          }}
        >
          {/* <img
            src={enjoyImage}
            width="300"
            alt="img1"
            style={{
              alignSelf: "center",
            }}
          /> */}
          <img
            src={hatImage}
            width="300"
            alt="img2"
            style={{
              alignSelf: "center",
            }}
          />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Mochiy Pop One",
          data: mochiyPopOneFontData,
          style: "normal",
        },
        {
          name: "AriBlk",
          data: ariBlkFontData,
          style: "normal",
        },
      ],
    }
  );
};
