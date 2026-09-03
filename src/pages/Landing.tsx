import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import {
  Leaf,
  Brain,
  HandHeart,
  Truck,
  BarChart3,
  Users,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Shield,
  Clock,
  MapPin,
} from 'lucide-react';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-emerald-50">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-100 rounded-full opacity-30 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-100 rounded-full opacity-30 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
              <Sparkles size={16} />
              AI-Powered Food Redistribution
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Reducing Food Waste,{' '}
              <span className="text-gradient">Feeding Communities</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-gray-600 leading-relaxed">
              FeedLink AI intelligently connects food donors with NGOs and food receivers,
              using artificial intelligence to match surplus food with those who need it most.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" onClick={() => navigate('/signup')}>
                Get Started Free
                <ArrowRight size={18} className="ml-2" />
              </Button>
              <Button variant="secondary" size="lg" onClick={() => navigate('/login')}>
                Sign In
              </Button>
            </div>

            <p className="mt-4 text-sm text-gray-500">
              Join 89+ donors and 34+ NGOs already on the platform
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform makes food redistribution simple, fast, and efficient.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: <HandHeart className="w-6 h-6" />,
                title: '1. Donate',
                description: 'Donors list surplus food with details about type, quantity, and expiry.',
              },
              {
                icon: <Brain className="w-6 h-6" />,
                title: '2. AI Analyzes',
                description: 'Our AI evaluates urgency, shelf life, and finds the best NGO match.',
              },
              {
                icon: <Truck className="w-6 h-6" />,
                title: '3. Pickup',
                description: 'The matched NGO arranges pickup and collects the food donation.',
              },
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: '4. Impact',
                description: 'Track meals provided, CO2 saved, and community impact in real-time.',
              },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 mx-auto bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center mb-4">
                  {step.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Platform Features
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to make a difference in your community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Brain className="w-6 h-6" />,
                title: 'AI-Powered Matching',
                description:
                  'Gemini AI analyzes food urgency and matches donations with the most suitable NGOs automatically.',
              },
              {
                icon: <Clock className="w-6 h-6" />,
                title: 'Real-Time Tracking',
                description:
                  'Track your donations from creation to delivery with status updates at every step.',
              },
              {
                icon: <MapPin className="w-6 h-6" />,
                title: 'Smart Location Matching',
                description:
                  'Find NGOs closest to your location for faster pickup and fresher food delivery.',
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: 'Food Safety Analysis',
                description:
                  'AI evaluates shelf life, storage requirements, and provides safety recommendations.',
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: 'Community Impact',
                description:
                  'See the real impact of your donations with detailed statistics and reports.',
              },
              {
                icon: <Leaf className="w-6 h-6" />,
                title: 'Sustainability Metrics',
                description:
                  'Track CO2 emissions saved and food waste reduced through your contributions.',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats Banner */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '45,820+', label: 'Meals Provided' },
              { value: '28,560', label: 'Kg Redistributed' },
              { value: '57,120', label: 'Kg CO2 Saved' },
              { value: '94.5%', label: 'Completion Rate' },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-3xl sm:text-4xl font-bold text-white">
                  {stat.value}
                </p>
                <p className="text-sm text-primary-100 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials / Trust */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Trusted by Food Businesses & NGOs
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  '"FeedLink AI has transformed how we handle surplus food. What used to go to waste now feeds families in need."',
                author: 'Marco Rossi',
                role: 'Owner, Bella Italia Restaurant',
              },
              {
                quote:
                  '"The AI matching is incredible. We get notified about food that perfectly fits our capacity and location."',
                author: 'David Williams',
                role: 'Director, Hope Food Bank',
              },
              {
                quote:
                  '"We have reduced our food waste by 80% since joining FeedLink AI. The platform is easy to use and reliable."',
                author: 'Sarah Johnson',
                role: 'Manager, FreshMart Supermarket',
              },
            ].map((testimonial, i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-xl p-6 border border-gray-100"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <svg
                      key={j}
                      className="w-5 h-5 text-amber-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 italic mb-4">{testimonial.quote}</p>
                <p className="font-semibold text-gray-900">{testimonial.author}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join FeedLink AI today and help reduce food waste while feeding communities in need.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" onClick={() => navigate('/signup')}>
              Start Donating Food
              <ArrowRight size={18} className="ml-2" />
            </Button>
            <Button variant="secondary" size="lg" onClick={() => navigate('/signup')}>
              Register as NGO
            </Button>
          </div>
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <CheckCircle2 size={16} className="text-primary-500" />
              Free to use
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 size={16} className="text-primary-500" />
              No setup required
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 size={16} className="text-primary-500" />
              Cancel anytime
            </span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
