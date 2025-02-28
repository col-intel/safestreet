# Open Graph Images for Rua Segura

This document provides instructions for generating and using Open Graph (OG) images for the Rua Segura website.

## What are OG Images?

Open Graph images are the images that appear when your website is shared on social media platforms like Facebook, Twitter, LinkedIn, and messaging apps like WhatsApp and Telegram. They are crucial for increasing engagement and click-through rates.

## Required OG Images

The following OG images should be created and placed in the `/public` directory:

1. **og-image.jpg** - Default fallback image
2. **og-home.jpg** - Home page
3. **og-report.jpg** - Report page
4. **og-incident.jpg** - Incident detail page
5. **og-faq.jpg** - FAQ page
6. **og-contact.jpg** - Contact page
7. **og-associations.jpg** - Associations page
8. **og-login.jpg** - Login page

## Image Specifications

- **Dimensions**: 1200x630 pixels (optimal for most platforms)
- **Format**: JPG or PNG (JPG recommended for faster loading)
- **File size**: Keep under 1MB (ideally under 200KB)
- **Key elements to include**:
  - Rua Segura logo
  - Page title
  - Brief description (if space allows)
  - Consistent branding elements
  - Visual elements related to the page content
  - Dotted border to match the site's design

## Dynamic OG Image Generation

The project includes a dynamic OG image generation API at `/api/og`. This can be used to generate OG images on-the-fly with custom titles and descriptions.

### Usage

```
https://www.ruasegura.pt/api/og?title=Your%20Title&description=Your%20Description
```

### Parameters

- `title` - The title to display on the image
- `description` - The description to display on the image
- `type` - The type of image (default, incident, report, etc.)

## Implementation in Metadata

The OG images are referenced in the metadata files for each page. For example:

```typescript
openGraph: {
  images: [
    {
      url: '/og-home.jpg',
      width: 1200,
      height: 630,
      alt: 'Rua Segura - Plataforma cidadã para segurança viária no Porto',
    }
  ],
}
```

For dynamic pages like incident details, you can use the dynamic OG image generation API:

```typescript
openGraph: {
  images: [
    {
      url: `https://www.ruasegura.pt/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&type=incident`,
      width: 1200,
      height: 630,
      alt: `Incidente em ${incident.freguesia}: ${incident.type}`,
    }
  ],
}
```

## Tools for Creating OG Images

1. **Figma or Canva** - For designing static OG images
2. **Vercel OG Image Generation** - For dynamic OG images (already implemented)
3. **Cloudinary** - For image transformations and optimizations

## Testing OG Images

You can test how your OG images appear on different platforms using these tools:

- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
- [OpenGraph.xyz](https://www.opengraph.xyz/) 