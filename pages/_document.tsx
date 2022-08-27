import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';

class BaseDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html className="h-full bg-gray-100">
        <Head>
          <meta name="application-name" content="DLRG Fortbildungen" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="DLRG Fortbildungen" />
          <meta name="description" content="Best DLRG Fortbildungen in the world" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="msapplication-config" content="/icons/browserconfig.xml" />
          <meta name="msapplication-TileColor" content="#FF222B" />
          <meta name="msapplication-tap-highlight" content="no" />
          <meta name="theme-color" content="#FF222B" />

          <link rel="apple-touch-icon" href="/icons/touch-icon-iphone.png" />
          <link rel="apple-touch-icon" sizes="152x152" href="/icons/touch-icon-ipad.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/icons/touch-icon-iphone-retina.png" />
          <link rel="apple-touch-icon" sizes="167x167" href="/icons/touch-icon-ipad-retina.png" />

          <link rel="icon" type="image/png" sizes="32x32" href="/icons/dlrg_favicon_32px.ico" />
          <link rel="icon" type="image/png" sizes="16x16" href="/icons/dlrg_favicon_16px.ico" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#5bbad5" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />

          <meta name="twitter:card" content="summary" />
          <meta name="twitter:url" content="https://dlrg.adjeko.de" />
          <meta name="twitter:title" content="DLRG Fortbildungen" />
          <meta name="twitter:description" content="Best DLRG Fortbildungen in the world" />
          <meta name="twitter:image" content="https://dlrg.adjeko.de/icons/android-chrome-192x192.png" />
          <meta name="twitter:creator" content="@Adjeko" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="DLRG Fortbildungen" />
          <meta property="og:description" content="Best DLRG Fortbildungen in the world" />
          <meta property="og:site_name" content="DLRG Fortbildungen" />
          <meta property="og:url" content="https://dlrg.adjeko.de" />
          <meta property="og:image" content="https://dlrg.adjeko.de/icons/apple-touch-icon.png" />

          <meta
            name='viewport'
            content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover'
          />
        </Head>
        <body className="h-full">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default BaseDocument;