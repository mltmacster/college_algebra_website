
import { Navigation } from '../../components/navigation';
import { ContactForm } from '../../components/contact-form';
import { FooterSection } from '../../components/footer-section';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="py-16">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Get Help & Support
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Have questions about College Algebra concepts or need assistance with the platform? 
              We're here to help you succeed in your learning journey.
            </p>
          </div>
          <ContactForm />
        </div>
      </main>
      <FooterSection />
    </div>
  );
}
