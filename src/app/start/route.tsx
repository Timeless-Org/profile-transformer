import { ImageResponse } from "next/og";

export const runtime = "edge";

export const GET = async (request: Request) => {
  const mochiyPopOneFontData = await fetch(
    new URL("../../public/assets/fonts/MochiyPopOne.ttf", import.meta.url)
  ).then((res) => res.arrayBuffer());

  const ariBlkFontData = await fetch(
    new URL("../../public/assets/fonts/ariblk.ttf", import.meta.url)
  ).then((res) => res.arrayBuffer());

  const image1Data = await fetch(new URL("./img1.png", import.meta.url)).then(
    (res) => res.arrayBuffer()
  );

  const image2Data = await fetch(new URL("./img2.png", import.meta.url)).then(
    (res) => res.arrayBuffer()
  );

  const arrowImageData = await fetch(new URL("./arrow.png", import.meta.url)).then(
    (res) => res.arrayBuffer()
  );

  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#260f3f",
          backgroundSize: "100% 100%",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          height: "100%",
          justifyContent: "space-around",
          textAlign: "center",
          width: "100%",
        }}
      >
        <p
          style={{
            color: "white",
            fontSize: 50,
            fontFamily: '"Mochiy Pop One"',
          }}
        >
          put a cat on your shoulder
        </p>
        <p
          style={{
            color: "white",
            fontSize: 36,
            fontStyle: "normal",
            marginTop: 30,
            padding: "0 360px",
            fontFamily: '"AriBlk"',
          }}
        >
          Transform your PFP into an Awesome cat Meme
        </p>
        <div
          style={{
            color: "white",
            marginTop: 30,
            padding: "0 120px",
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
            width: "100%",
            alignItems: "center",
            gap: "50px",
          }}
        >
          {/* @ts-ignore */}
          <img width="200" alt="img1" src={image1Data} />
          {/* @ts-ignore */}
          <img width="170" alt="img1" src={arrowImageData} />
          {/* @ts-ignore */}
          <img width="200" alt="img2" src={image2Data} />
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
