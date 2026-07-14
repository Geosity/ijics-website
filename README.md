# IJICS Website

Static website preview for *The International Journal of Intelligent Control and Systems* (IJICS).

## Local preview

```bash
python3 -m http.server 4173 --directory demo
```

Open `http://127.0.0.1:4173/index.html`.

## Deployment

The GitHub Pages workflow publishes only the contents of `demo/`. Internal planning notes and source materials are excluded from version control.
