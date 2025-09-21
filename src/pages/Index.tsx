import { motion } from "framer-motion";
import { Palette, Sparkles, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Hero } from "@/components/ui/hero-1";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Generation",
      description: "Create stunning color palettes from natural language prompts or images using advanced AI models."
    },
    {
      icon: Eye,
      title: "Accessibility First",
      description: "Built-in WCAG compliance checking ensures your colors work for everyone, including users with color vision deficiencies."
    },
    {
      icon: Palette,
      title: "Designer-Focused",
      description: "Export in multiple formats (HEX, RGB, HSL) with one-click copying for seamless integration into your design workflow."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <Hero
        eyebrow="AI-Powered Design Tools"
        title="ChromaGen"
        subtitle="Revolutionize your design process with intelligent color generation that understands accessibility, brand identity, and creative vision."
        ctaLabel="Generate Your First Palette"
        onCtaClick={() => navigate("/generator")}
      />

      {/* Story Section */}
      <section className="py-20 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="p-8 shadow-elegant">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Color. It's Everything.
            </h2>
            <div className="prose prose-lg text-foreground space-y-4">
              <p>
                As designers, we know that color isn't just decoration—it's communication. It's emotion. It's accessibility. It's the difference between a brand that resonates and one that's forgotten.
              </p>
              <p>
                But finding the perfect palette shouldn't be a game of chance. Traditional color tools leave you guessing about contrast ratios, struggling with WCAG compliance, and wondering if your choices truly serve your users—including the 8% with color vision deficiencies.
              </p>
              <p>
                ChromaGen changes that. By combining the creative power of AI with rigorous accessibility standards, we've built the tool we always wished existed. Whether you're inspired by a sunset photo or need "energetic colors for a fitness brand," ChromaGen understands your vision and delivers palettes that work—for everyone.
              </p>
              <p className="font-semibold text-foreground">
                Because great design isn't just beautiful. It's inclusive.
              </p>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Designed for Modern Workflows
            </h2>
            <p className="text-lg text-foreground max-w-2xl mx-auto">
              Every feature built with the professional designer in mind—from initial inspiration to final implementation.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              >
                <Card className="p-6 h-full shadow-soft hover:shadow-elegant transition-smooth">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-gradient-primary rounded-lg shadow-glow">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-foreground">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-white text-black"
          >
            
            <Button
              variant="hero"
              size="xl"
              onClick={() => navigate("/generator")}
              className="bg-white text-primary hover:bg-white/90"
            >
              Start Creating Now
              <Sparkles className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;