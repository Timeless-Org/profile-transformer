import { ImageResponse } from "next/og";

export const runtime = "edge";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const fixedSearchParams = searchParams.toString().replace(/&amp%3B/g, "&");
  const params = new URLSearchParams(fixedSearchParams);
  const pfpUrl = params.get("pfpUrl");
  const top = `${params.get("top")}%`;
  const left = `${params.get("left")}%`;
  const imageData = await fetch(new URL(pfpUrl || "", import.meta.url)).then(
    (res) => res.arrayBuffer()
  );
  const catImage = await fetch(new URL("./cat.png", import.meta.url)).then(
    (res) => res.arrayBuffer()
  );
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
          justifyContent: "flex-start",
          textAlign: "center",
          width: "100%",
        }}
      >
        {/* @ts-ignore */}
        <img width="500" alt="img1" src={imageData} />
        {/* @ts-ignore */}
        <img src={catImage} // 新しい画像のデータ
          alt="img2" // 代替テキスト
          style={{
            position: "absolute",
            width: "120px",
            top: top,
            left: left,
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>
    )
  );
};
