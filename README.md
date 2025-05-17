# Boroland - Credit Score Checker

A modern web application built with SvelteKit, TypeScript, and Tailwind CSS that allows users to check their credit score for free.

## Features

- Free credit score check
- Instant access to credit reports
- User-friendly interface
- Secure data handling
- Mobile responsive design
- Real-time updates

## Tech Stack

- SvelteKit - Frontend framework
- TypeScript - Type safety
- Tailwind CSS - Styling
- DaisyUI - UI components
- Supabase - Backend and authentication

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/fintech-boroland.git
cd fintech-boroland
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Supabase credentials:
```env
PUBLIC_SUPABASE_URL=your_supabase_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/     # Reusable UI components
├── routes/         # SvelteKit routes
├── lib/           # Shared utilities and types
└── app.css        # Global styles
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Design inspired by modern fintech applications
- Icons from Heroicons
- UI components from DaisyUI
