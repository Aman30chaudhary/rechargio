import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquare, Zap, Shield, Globe } from 'lucide-react';
import { Button } from '../components/UI';
import { motion } from 'framer-motion';

const Landing = () => {
  const features = [
    { icon: <MessageSquare className="w-6 h-6" />, title: 'Real-time Chat', desc: 'Instant messaging with zero latency.' },
    { icon: <Zap className="w-6 h-6" />, title: 'Lightning Fast', desc: 'Optimized for speed and performance.' },
    { icon: <Shield className="w-6 h-6" />, title: 'End-to-End Encryption', desc: 'Your data is secure and private.' },
    { icon: <Globe className="w-6 h-6" />, title: 'Global Access', desc: 'Connect with anyone, anywhere.' },
  ];

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8 max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold text-text tracking-tight leading-tight">
            The modern way to <br className="hidden md:block" />
            <span className="text-primary">communicate</span> with your team.
          </h1>
          <p className="text-xl text-text-muted max-w-2xl mx-auto leading-relaxed">
            A powerful, secure, and lightning-fast messaging platform designed for modern teams. Experience communication like never before.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto gap-2 text-base">
                Get Started Free <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto text-base">
                View Demo
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Hero Image/Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-20 relative mx-auto max-w-5xl"
        >
          <div className="aspect-[16/9] rounded-2xl bg-surface border border-border shadow-2xl overflow-hidden flex items-center justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
            <MessageSquare className="w-32 h-32 text-primary/20" />
            <p className="absolute bottom-10 text-text-muted font-medium">App Interface Preview</p>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-surface border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">Everything you need to scale</h2>
            <p className="text-lg text-text-muted max-w-2xl mx-auto">Built with modern technologies to provide the best experience for your team.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-6 rounded-2xl bg-bg border border-border hover:border-primary/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-text mb-2">{feature.title}</h3>
                <p className="text-text-muted leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-bg border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold text-text">SaaS<span className="text-primary">Chat</span></span>
          </div>
          <p className="text-text-muted text-sm">© 2026 SaaS Chat Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="#" className="text-text-muted hover:text-primary transition-colors">Twitter</Link>
            <Link to="#" className="text-text-muted hover:text-primary transition-colors">GitHub</Link>
            <Link to="#" className="text-text-muted hover:text-primary transition-colors">LinkedIn</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
