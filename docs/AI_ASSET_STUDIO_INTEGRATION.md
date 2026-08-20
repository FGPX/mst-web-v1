# AI Asset Studio integration

The Musterring navbar now opens the existing image-generation application in a separate tab. This preserves the working image workflow and prevents customer-site releases from changing the Studio.

## Local development

1. Start Musterring on `http://localhost:3000`.
2. Start the image-generation app in `X:\10_ZHVILLIM\04_PROJECTS\32_IMAGE WORKFLOW\05_KODI\image-generation`.
3. The navbar opens `https://localhost:9443`, the app's current local frontend address.

## Deployment

Set this Musterring deployment environment variable to the deployed Studio URL:

```text
NEXT_PUBLIC_AI_ASSET_STUDIO_URL=https://studio.musterring.com
```

The Studio must enforce access itself. Before it is exposed to production users, configure its authentication and an approved email-domain allowlist in its `ikon-config.toml`; a website link alone is not an access-control mechanism.
