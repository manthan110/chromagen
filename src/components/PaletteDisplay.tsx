import { motion } from "framer-motion";
import { ColorSwatch } from "./ColorSwatch";
import { Card } from "@/components/ui/card";

interface Color {
  name: string;
  hex: string;
  rgb: string;
  hsl: string;
}

interface PaletteDisplayProps {
  palette: Color[];
  title?: string;
}

export const PaletteDisplay = ({ palette, title = "Generated Palette" }: PaletteDisplayProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card className="p-6 shadow-elegant">
        <h2 className="text-2xl font-bold text-foreground mb-6">{title}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {palette.map((color, index) => (
            <ColorSwatch
              key={index}
              color={color.hex}
              name={color.name}
              hex={color.hex}
              rgb={color.rgb}
              hsl={color.hsl}
              index={index}
            />
          ))}
        </div>
      </Card>
    </motion.div>
  );
};