export const domain =
  {
    production: `${process.env.CUSTOM_DOMAIN}`,
    dev: `dev.${process.env.CUSTOM_DOMAIN}`,
  }[$app.stage] || $app.stage + `.dev.${process.env.CUSTOM_DOMAIN}`;