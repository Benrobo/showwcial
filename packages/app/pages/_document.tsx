import { Html, Head, Main, NextScript } from "next/document";

function Document() {
  return (
    <Html>
      <Head>
        {/* Basic Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <meta
          name="description"
          content="Create a stunning portfolio that showcases your best work and stands out with ease."
        ></meta>
        <title>Showwcial</title>

        {/* Open Graph Meta tags */}
        {/* <meta
          property="og:title"
          content="showccial - Create a portfolio that stands out to potential clients and employers."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://tryshowccial.site" />
        <meta
          property="og:image"
          content="https://tryshowccial.site/images/og-img/og-1.png"
        />
        <meta
          property="og:description"
          content="Create a stunning portfolio that showcases your best work and stands out with ease."
        />
        <meta property="og:site_name" content="showccial" /> */}

        {/* Twitter OG Tag */}
        {/* <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@tryshowccial" />
        <meta name="twitter:title" content="Create Impressive Portfolio" />
        <meta
          name="twitter:description"
          content="Create a stunning portfolio that showcases your best work and stands out with ease."
        />
        <meta
          name="twitter:image"
          content="https://tryshowccial.site/images/og-img/og-1.png"
        /> */}

        <link rel="icon" type="image/png" href="/images/logos/logo2.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

export default Document;
