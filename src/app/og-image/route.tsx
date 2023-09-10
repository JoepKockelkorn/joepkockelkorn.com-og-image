import { ImageResponse } from "next/server";
import { cacheHeader } from "pretty-cache-header";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const hasTitle = searchParams.has("title");
  const title = hasTitle
    ? searchParams.get("title")!.slice(0, 100)
    : "My default title";

  const muktaFont = await getMuktaFont(origin);

  const options: ConstructorParameters<typeof ImageResponse>[1] = {
    width: 1200,
    height: 630,
    fonts: [{ name: "Mukta", data: muktaFont, style: "normal" }],
    headers: {
      "Cache-Control": cacheHeader({
        public: true,
        immutable: true,
        noTransform: true,
        maxAge: "1 year",
      }),
    },
  };
  return new ImageResponse(
    (
      <div
        style={{
          width: options.width,
          height: options.height,
          padding: 100,
          background: "linear-gradient(135deg, #892f0b 10%, #fb923c 100%)",
          color: "white",
          fontFamily: "Mukta",
          fontSize: 70,
          display: "flex",
          flexFlow: "column nowrap",
          gap: 50,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${origin}/android-chrome-192x192.png`}
          width={148}
          height={148}
          alt="Joep Kockelkorn"
        />
        <div style={{ textAlign: "center", lineHeight: 1 }}>{title}</div>
      </div>
    ),
    options
  );
}

async function getMuktaFont(baseUrl: string) {
  const res = await fetch(new URL(`${baseUrl}/mukta-regular.ttf`));
  return await res.arrayBuffer();
}
