# Karexa Solutions Website

Static website for Karexa Solutions, a digital transformation and workflow automation consulting brand.

## Files

- `index.html` - main website page
- `site.css` - responsive styling
- `site.js` - mobile menu behavior
- `assets/karexa-workflow-hero.png` - hero image

## Project inquiries

The contact page stores project inquiries in Supabase. The public form allows
submissions for the five services listed on the Services page. There is no
website login or inquiry dashboard.

### Supabase setup

1. Open the Supabase SQL Editor for the project and run
   [`supabase/inquiries.sql`](./supabase/inquiries.sql). This creates the
   `public.inquiries` table and allows anonymous form submissions only. The
   table cannot be read through the website.
2. Deploy the site. The project URL and public publishable key are configured
   in `supabase-client.js`. The publishable key is intended for browser use;
   never put a `service_role` key in the website.
