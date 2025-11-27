# Weather Clothing Recommender - Frontend

React frontend application for the Weather Clothing Recommender.

## Features

- Modern, responsive UI built with React
- Clean form interface for user inputs
- Real-time weather-based recommendations
- Detailed weather information display
- Loading states and error handling
- Mobile-friendly design
- CSS variables for easy theming

## Tech Stack

- React 18
- Vite (build tool)
- CSS3 with CSS Variables
- Fetch API for backend communication

## Installation

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.example .env
```

Edit `.env` to set your backend URL:
```env
VITE_API_URL=http://localhost:8000
```

3. Run development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Available Scripts

### `npm run dev`
Starts the development server with hot module replacement.

### `npm run build`
Builds the app for production to the `dist` folder.

### `npm run preview`
Previews the production build locally.

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── WeatherForm.jsx       # Input form component
│   │   ├── WeatherForm.css       # Form styles
│   │   ├── Results.jsx           # Results display component
│   │   └── Results.css           # Results styles
│   ├── App.jsx                   # Main app component
│   ├── App.css                   # App styles
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Global styles
├── index.html                    # HTML template
├── vite.config.js               # Vite configuration
├── package.json                 # Dependencies
└── .env.example                 # Environment variables template
```

## Component Documentation

### App.jsx

Main application component that manages state and API communication.

**State:**
- `recommendation`: Stores the API response
- `loading`: Loading state during API calls
- `error`: Error messages

**Functions:**
- `handleSubmit`: Sends form data to backend API

### WeatherForm.jsx

Form component for user inputs.

**Props:**
- `onSubmit`: Callback function when form is submitted
- `loading`: Boolean to disable form during loading

**Inputs:**
- Home city (text)
- Work city (text)
- Departure time (select, 0-23)
- Return time (select, 0-23)
- Cold sensitivity (radio: low/medium/high)

### Results.jsx

Component that displays the recommendation and weather data.

**Props:**
- `data`: Object containing:
  - `recommendation`: String with clothing advice
  - `home_weather`: Weather data for home location
  - `work_weather`: Weather data for work location

**Displays:**
- AI-generated recommendation
- Temperature, conditions, precipitation, wind speed for both locations

## Styling

The app uses CSS variables for consistent theming:

```css
:root {
  --primary-color: #3b82f6;
  --primary-hover: #2563eb;
  --bg-color: #f8fafc;
  --card-bg: #ffffff;
  --text-color: #1e293b;
  --text-secondary: #64748b;
  --border-color: #e2e8f0;
  --error-color: #ef4444;
  --success-color: #10b981;
  --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}
```

## Configuration

### Environment Variables

Create a `.env` file with:

```env
VITE_API_URL=http://localhost:8000
```

**Important:**
- All environment variables must be prefixed with `VITE_` to be available in the app
- Changes to `.env` require restarting the dev server

### API Integration

The app communicates with the backend via the `/recommend` endpoint:

```javascript
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const response = await fetch(`${apiUrl}/recommend`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(formData),
})
```

## Deployment

### Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard:
   - `VITE_API_URL`: Your backend API URL

### Netlify

1. Build the app:
```bash
npm run build
```

2. Deploy the `dist` folder to Netlify

3. Set environment variable:
   - `VITE_API_URL`: Your backend API URL

### Static Hosting (GitHub Pages, S3, etc.)

1. Update `.env` with production API URL
2. Build:
```bash
npm run build
```
3. Upload contents of `dist/` folder to your hosting service

## Development

### Adding New Features

1. Create new components in `src/components/`
2. Import and use in `App.jsx`
3. Add corresponding CSS files for styles

### Styling Guidelines

- Use CSS variables for colors and spacing
- Follow mobile-first approach
- Add media queries for responsive design
- Keep component styles in separate CSS files

### Code Organization

- One component per file
- Co-locate component and styles
- Use functional components with hooks
- Keep components small and focused

## Responsive Design

The app is fully responsive with breakpoints:

- **Desktop**: > 768px
- **Mobile**: ≤ 768px

Key responsive features:
- Flexible grid layouts
- Stacked forms on mobile
- Adjusted font sizes
- Touch-friendly buttons

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

### Optimization Tips

1. **Code Splitting**: Vite automatically handles this
2. **Lazy Loading**: Use dynamic imports for large components
3. **Image Optimization**: Compress images before adding
4. **Caching**: Configure cache headers in hosting platform

### Build Output

The production build is optimized with:
- Minification
- Tree shaking
- Asset optimization
- Modern browser targets

## Troubleshooting

### Common Issues

**"Cannot connect to API"**
- Check `VITE_API_URL` in `.env`
- Verify backend is running
- Check browser console for CORS errors

**"Blank page after build"**
- Check console for errors
- Verify API URL is set correctly
- Ensure backend is accessible from production

**"Styles not loading"**
- Clear browser cache
- Check if CSS files are imported correctly
- Verify build output includes CSS files

### Development Issues

**Hot reload not working**
- Restart dev server
- Clear `.vite` cache folder
- Check for syntax errors

**Environment variables not updating**
- Restart dev server after changing `.env`
- Ensure variables are prefixed with `VITE_`

## Accessibility

The app follows basic accessibility guidelines:

- Semantic HTML elements
- Proper label associations
- Keyboard navigation support
- Sufficient color contrast
- Responsive text sizing

## Future Enhancements

Potential features to add:

- [ ] Save favorite city pairs
- [ ] Historical weather comparisons
- [ ] Multi-day forecasts
- [ ] Dark mode
- [ ] User preferences persistence
- [ ] Share recommendations
- [ ] Multiple language support
- [ ] PWA capabilities

## Testing

To add tests:

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest
```

Example test:
```javascript
import { render, screen } from '@testing-library/react'
import App from './App'

test('renders app header', () => {
  render(<App />)
  const header = screen.getByText(/Weather Clothing Recommender/i)
  expect(header).toBeInTheDocument()
})
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT
