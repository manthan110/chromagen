import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Wand2, ArrowLeft, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { PaletteDisplay } from "@/components/PaletteDisplay";
import { AccessibilityPanel } from "@/components/AccessibilityPanel";
import { useToast } from "@/hooks/use-toast";

const Generator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [prompt, setPrompt] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPalette, setGeneratedPalette] = useState<any>(null);

  // Helper to convert prompt to Colormind input (simple fallback)
const defaultInput = [[44,43,44],[90,83,82],"N","N","N"];


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast({
        title: "Image uploaded",
        description: "Ready to extract colors from your image.",
      });
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim() && !selectedFile) {
      toast({
        title: "Input required",
        description: "Please provide a text prompt or upload an image.",
        variant: "destructive",
      });
      return;
    }
    setIsGenerating(true);
    try {
      let palette = [];
      // Colormind: handle prompt (text), image, or fallback
      let formData = new FormData();
      let hasInput = false;
      if (prompt.trim()) {
        formData.append('prompt', prompt);
        hasInput = true;
      }
      if (selectedFile) {
        formData.append('image', selectedFile);
        hasInput = true;
      }
      // If neither prompt nor image, fallback to default
      let response, data;
      if (hasInput) {
        response = await fetch('http://localhost:5000/api/generate-palette', {
          method: 'POST',
          body: formData
        });
      } else {
        response = await fetch('http://localhost:5000/api/generate-palette', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input: defaultInput, model: 'default' })
        });
      }
      data = await response.json();
      if (data.result) {
        palette = data.result.map((rgbArr: number[], idx: number) => {
          const hex = '#' + rgbArr.map((x: number) => x.toString(16).padStart(2, '0')).join('');
          return { name: `Color ${idx+1}`, hex, rgb: `rgb(${rgbArr.join(', ')})` };
        });
      } else {
        throw new Error(data.error || 'No palette returned from Colormind');
      }
      setGeneratedPalette(palette);
      toast({
        title: "Palette generated!",
        description: "Your AI-powered color palette is ready.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || 'Failed to connect to backend',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };



  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="text-muted-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              ChromaGen
            </h1>
            <div className="w-24" /> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Input Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-6 shadow-elegant">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Create Your Palette
                </h2>


                {/* Text Prompt */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Describe Your Vision
                    </label>
                    <Textarea
                      placeholder="e.g., 'An energetic palette for a fitness brand inspired by a tropical sunset' or 'Calm, professional colors for a healthcare app'"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="min-h-20"
                    />
                  </div>
                  
                  {/* File Upload */}
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-2">— OR —</div>
                    <div className="border-2 border-dashed border-border rounded-lg p-6">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <div className="flex flex-col items-center space-y-2">
                          <div className="p-3 bg-muted rounded-full">
                            <Upload className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div className="text-sm text-center">
                            <span className="font-medium text-primary">Upload an image</span>
                            <p className="text-muted-foreground">Extract colors from your inspiration</p>
                          </div>
                        </div>
                      </label>
                      
                      {selectedFile && (
                        <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-success">
                          <ImageIcon className="h-4 w-4" />
                          <span>{selectedFile.name}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Generate Button */}
                  <Button
                    variant="hero"
                    size="lg"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4 mr-2" />
                        Generate Palette
                      </>
                    )}
                  </Button>
                </div>

                {/* API Integration Note */}
                <div className="text-xs text-muted-foreground p-3 bg-muted rounded-lg">
                  💡 This demo shows a mock palette. Connect to your AI backend API to enable real palette generation.
                </div>
              </Card>
            </motion.div>

            {/* Generated Palette */}
            {generatedPalette && (
              <PaletteDisplay palette={generatedPalette} />
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {generatedPalette && <AccessibilityPanel palette={generatedPalette} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Generator;