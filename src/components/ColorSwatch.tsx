import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ColorSwatchProps {
  color: string;
  name: string;
  hex: string;
  rgb: string;
  hsl: string;
  index: number;
}

export const ColorSwatch = ({ color, name, hex, rgb, hsl, index }: ColorSwatchProps) => {
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const copyToClipboard = (text: string, format: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const formatButtons = [
    { label: "HEX", value: hex, key: "hex" },
    { label: "RGB", value: rgb, key: "rgb" },
    { label: "HSL", value: hsl, key: "hsl" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Card className="p-4 shadow-soft hover:shadow-elegant transition-smooth">
        <div
          className="w-full h-32 rounded-lg mb-4 shadow-soft border"
          style={{ backgroundColor: color }}
        />
        
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">{name}</h3>
          
          <div className="space-y-2">
            {formatButtons.map(({ label, value, key }) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground font-mono">{value}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(value, key)}
                  className="h-6 px-2"
                >
                  {copiedFormat === key ? (
                    <Check className="h-3 w-3 text-success" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};