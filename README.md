# Kinson Busis — Personal Portfolio

A responsive personal developer portfolio built with **HTML5, CSS3, and vanilla JavaScript**. The design uses a premium black-and-gold theme and does not require a framework or build step.

## Project structure

```text
kinson-portfolio/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── images/
└── README.md
```

The portfolio currently uses CSS-built visual mockups for project thumbnails, so the site works without external image files. Google Fonts are loaded online; system fallbacks are included.

## Run in Visual Studio Code

1. Extract `kinson-portfolio.zip`.
2. Open VS Code.
3. Select **File → Open Folder...** and choose the `kinson-portfolio` folder.
4. In Extensions, install **Live Server** by Ritwick Dey.
5. Open `index.html`.
6. Click **Go Live** in the VS Code status bar. The website opens in your browser.

You can also open `index.html` directly in a browser, although Live Server is recommended while editing.

## Customize the website

### Change personal information
Open `index.html` and edit the text in the Home, About, Learning Journey, Contact, and footer sections. Your name, school, and email are already filled in.

### Add real social and project links
Search `index.html` for:
- `https://github.com/` — replace it with your actual GitHub profile.
- `class="placeholder-link"` — each such link currently displays a helpful reminder instead of opening a fake URL. Replace its `href="#"` with your real project demo or repository URL and remove the `placeholder-link` class and its `data-project` / `data-kind` attributes.

Do not publish links that are not real or that you do not have permission to share.

### Change colors
At the top of `css/style.css`, edit the CSS variables in `:root`, including `--bg`, `--gold`, `--text`, and `--muted`.

### Add profile or project images
The project cards use CSS-made previews so they are ready to display without images. If you want to use screenshots, put them in `images/` and replace the corresponding project visual markup in `index.html` with an image such as:

```html
<img src="images/feedback-system.png" alt="Screenshot of the BISU Candijay Feedback System">
```

Keep image files optimized and always write useful `alt` text.

## Contact form behavior

The form checks that all fields are filled in and the email address is valid. When submitted, it opens a new email draft addressed to `kinsonbusis@gmail.com` with the form contents filled in. It **does not send the message automatically**. The visitor must review and send the draft from their email application.

For a true website-submitted contact form, connect a backend or an email form service and configure it securely.

## Test checklist

- [ ] Open Home, About, Skills, Projects, Journey, and Contact from the navigation.
- [ ] Check the mobile menu at a narrow screen width.
- [ ] Confirm buttons scroll to the intended sections.
- [ ] Check the project cards on desktop and mobile.
- [ ] Try submitting the contact form empty and with an invalid email.
- [ ] Submit valid form data and confirm that an email draft opens.
- [ ] Replace placeholder GitHub and project links with real URLs.
- [ ] Check keyboard navigation and visible focus outlines.
- [ ] Test with reduced motion enabled in your operating system.
- [ ] Check the browser console for errors.

## Deploy online

### GitHub Pages
1. Create a GitHub repository and upload the contents of this folder.
2. In the repository, open **Settings → Pages**.
3. Under the build/deployment section, select deployment from the `main` branch and the root folder.
4. Save and wait for GitHub Pages to publish the site.

### Cloudflare Pages
1. Push the project to a GitHub repository.
2. In Cloudflare, create a Pages project and connect that repository.
3. Because this is a plain static site, leave the build command empty and set the output directory to `/` (the project root, depending on the setup screen).
4. Deploy and test the published URL.

## Notes
- No React, Next.js, Vue, Angular, or Tailwind is used.
- No fake work experience, certifications, awards, or project URLs are included.
- The CSS mockups are illustrations, not screenshots of the real applications.


### Profile photo

Your profile photo is stored at `images/kinson-busis-profile.png` and is displayed in the Home section. To change it, replace that image while keeping the same filename, or update the image path in `index.html`. Use a clear, high-quality portrait for the best result.


### Project preview images

The `images/` folder contains the profile photo and the supplied screenshots used in the BISU Candijay Feedback System and American Roadhouse project cards. Keep these image files in place so the previews load correctly.


## Motion effects

The portfolio includes a staggered navigation and hero entrance, a desktop-only gold cursor and mouse spotlight, subtle profile-photo parallax, animated gold button shine, navigation underlines, and project-card hover lighting. These effects use CSS and vanilla JavaScript only. They are disabled or reduced for touch devices and visitors who enable reduced motion in their operating system. The page content remains visible if JavaScript is unavailable.


## Gold electric-arc cursor

On desktop devices with a mouse or fine pointer, the portfolio draws a short-lived, crackling gold electric arc behind the custom cursor. It is implemented with a small vanilla JavaScript canvas and CSS—no React, React Bits Pro package, Tailwind, external library, or license key is required. The canvas ignores pointer input, is disabled on touch devices, and is hidden when reduced motion is enabled.

To test it, open the site on desktop and move the pointer in short and long strokes across the page. The arcs fade quickly by design, keeping the effect subtle and lightweight.


## Text Scatter effect

The portfolio includes a lightweight vanilla JavaScript adaptation of the React Bits Pro Text Scatter interaction. Hover over the hero title, section headings, skill names, project titles, and journey headings on a desktop pointer: letters burst outward in the site's gold-accent style and then settle back into place. The effect respects reduced-motion settings and is disabled on touch-first devices.

This existing website is plain HTML, CSS, and vanilla JavaScript, so the original React/Tailwind registry component was not installed with shadcn. The adapted effect keeps the current stack and does not require a React Bits license key or a build step. If you later migrate the site to React and want the official registry component, follow https://pro.reactbits.dev/docs/installation and https://pro.reactbits.dev/docs/components/text-scatter. Keep `REACTBITS_LICENSE_KEY` in a local `.env.local` file and never commit it.
