# Karexa Solutions Website

Static website for Karexa Solutions, a digital transformation and workflow automation consulting brand.

## Files

- `index.html` - main website page
- `site.css` - responsive styling
- `site.js` - mobile menu behavior
- `assets/karexa-workflow-hero.png` - hero image

## Project inquiries

The contact page stores project inquiries in Supabase. The public form allows
submissions for the five services listed on the Services page. The admin page
at `admin.html` uses Supabase email/password authentication to display them.

### Supabase setup

1. Open the Supabase SQL Editor for the project and run
   [`supabase/inquiries.sql`](./supabase/inquiries.sql). This creates the
   `public.inquiries` table and row-level security policies.
2. In Supabase Authentication, create an email/password user for
   `Kamaldevtalla1911@gmail.com`. The SQL policy allows only this email to read
   inquiry data.
3. Set the user's password in Supabase and sign in at `/admin.html`.
4. Deploy the site. The project URL and public publishable key are configured
   in `supabase-client.js`. The publishable key is intended for browser use;
   never put a `service_role` key in the website.
