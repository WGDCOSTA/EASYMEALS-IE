
# EasyMeals.ie

Modern eCommerce platform for ready-made meals with AI-powered nutrition tracking.

## Features

### 🍽️ Product Management
- Comprehensive meal catalog with categories (Student Meals, Kids Meals, Busy Life, Health & Fitness, Halal, Combos)
- Advanced product detail pages with nutritional information
- Real-time inventory management
- Multi-image product galleries

### 🤖 AI-Powered Nutrition Features
- **AI Nutrition Populator**: Automatically fetch and populate nutritional data for products
- **Calorie Tracker**: Track daily calorie intake and nutritional goals
- **AI Meal Planner**: Get personalized meal suggestions based on dietary preferences
- **Weekly Progress Tracking**: Visualize nutrition progress over time

### 👤 User Experience
- User authentication with NextAuth.js
- Personal nutrition profiles
- Order history and tracking
- Shopping cart with nutrition preview
- Wishlist functionality
- Guest and authenticated user experiences

### 📊 Analytics & Insights
- Purchase history analysis
- Subscription intelligence
- Personalized meal recommendations
- Nutrition goal tracking

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **UI**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **AI Integration**: OpenAI API for nutrition suggestions
- **Deployment**: Abacus.AI platform

## Database Schema

The application uses Prisma with PostgreSQL and includes:
- User management with roles
- Product catalog
- Order processing
- Nutrition profiles
- Meal planning
- Daily intake tracking
- Reviews and ratings

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- OpenAI API key (for AI features)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/WGDCOSTA/easymeals-ie.git
cd easymeals-ie/nextjs_space
```

2. Install dependencies:
```bash
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Authentication secret
- `NEXTAUTH_URL`: Application URL
- `ABACUSAI_API_KEY`: AI features API key

4. Run database migrations:
```bash
yarn prisma generate
yarn prisma migrate dev
```

5. Start the development server:
```bash
yarn dev
```

Visit `http://localhost:3000` to see the application.

## Deployment

The application is deployed at: [easymeals.abacusai.app](https://easymeals.abacusai.app)

To deploy updates:
1. Make your changes
2. Test locally
3. Run `./commit-and-push.sh "Your commit message"`
4. The platform will automatically deploy changes

## Project Structure

```
nextjs_space/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── cart/              # Shopping cart
│   ├── nutrition/         # Nutrition dashboard
│   ├── products/          # Product pages
│   └── ...
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...
├── lib/                   # Utilities and helpers
│   ├── db.ts             # Database client
│   └── ...
├── prisma/               # Database schema
│   └── schema.prisma
└── public/               # Static assets
```

## Key Features Implementation

### Animated Nutrition Display
- Circular progress indicators for macronutrients
- Interactive macro breakdown bars
- Real-time nutrition calculations

### AI Integration
- GPT-4 powered meal suggestions
- Personalized nutrition recommendations
- Automated nutritional data population

### User Dashboard
- Three-tab interface (Today, Planner, Progress)
- Goal tracking and progress visualization
- Purchase history analysis

## Contributing

This is a private project. For questions or contributions, please contact the repository owner.

## License

Proprietary - All rights reserved

## Contact

- Website: [easymeals.abacusai.app](https://easymeals.abacusai.app)
- Repository: [github.com/WGDCOSTA/easymeals-ie](https://github.com/WGDCOSTA/easymeals-ie)
