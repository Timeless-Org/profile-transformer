import { ImageResponse } from "next/og";

export const runtime = "edge";

export const GET = async (request: Request) => {
  const mochiyPopOneFontData = await fetch(
    new URL("../../public/assets/fonts/MochiyPopOne.ttf", import.meta.url)
  ).then((res) => res.arrayBuffer());

  const ariBlkFontData = await fetch(
    new URL("../../public/assets/fonts/ariblk.ttf", import.meta.url)
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
            marginTop: 50
          }}
        >
          Do you have a cat NFT?
        </p>
        <p
          style={{
            color: "white",
            fontSize: 36,
            fontStyle: "normal",
            marginTop: 100,
            padding: "0 240px",
            fontFamily: '"AriBlk"',
          }}
        >
          You must have a cat NFT before you create new PFP
        </p>
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
