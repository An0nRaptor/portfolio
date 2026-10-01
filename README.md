# Rahul Yadav — Portfolio

Personal portfolio built with React, Vite and Tailwind CSS.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs dist/
```

- **Content** lives in `src/data.js` — edit that, not the components.
- **Résumé**: put the PDF at `public/Rahul_Yadav_Resume.pdf`.
- **Contact form** uses Netlify Forms (works only when deployed on Netlify).
  Turn on email notifications in Netlify → Forms → contact → Notifications.
- **Deploy**: connect this repo in Netlify (build `npm run build`, publish `dist`,
  already set in `netlify.toml`), or drag the `dist/` folder into Netlify.
