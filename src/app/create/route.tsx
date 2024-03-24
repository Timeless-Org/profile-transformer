// @ts-nocheck
import { ImageResponse } from "next/og";

export const runtime = "edge";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const fixedSearchParams = searchParams.toString().replace(/&amp%3B/g, "&");
  const params = new URLSearchParams(fixedSearchParams);
  const pfpUrl = params.get("pfpUrl");
  const top = `${params.get("top")}%`;
  const left = `${params.get("left")}%`;
  const size = `${params.get("size")}px`;
  const cat = params.get("cat");
  const imageData = await fetch(new URL(pfpUrl || "", import.meta.url)).then(
    (res) => res.arrayBuffer()
  );
  const catImage = await fetch(
    new URL(`../../public/assets/static/cat${cat}.png`, import.meta.url)
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "white",
          backgroundSize: "100% 100%",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
          position: "relative",
        }}
      >
        <img
          src={imageData}
          width="500"
          alt="img1"
          style={{
            alignSelf: "center",
          }}
        />
        <img
          src={catImage}
          alt="img2"
          style={{
            position: "absolute",
            width: size,
            top: top,
            left: left,
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>
    ),
    {
      headers: {
        "Content-Disposition": 'attachment; filename="meme.png"',
      },
    }
  );
};
