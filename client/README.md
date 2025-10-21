# Holy Word Frontend Configuration

## API Configuration

The frontend connects to the API server using the `REACT_APP_API_URL` environment variable.

### Development
Set in your environment or create a `.env` file:
```
REACT_APP_API_URL=http://localhost:3001
```

### Production
Set in your deployment platform (Netlify, Vercel, etc.):
```
REACT_APP_API_URL=https://your-api-server.railway.app
```

## Deployment

1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Deploy the `build` folder to:**
   - Netlify
   - Vercel
   - GitHub Pages

3. **Set environment variable:**
   - Add `REACT_APP_API_URL` with your server URL

## Features

- ✅ Responsive design
- ✅ Daily verse fetching from API
- ✅ Contact page
- ✅ Developer documentation
- ✅ External API integration