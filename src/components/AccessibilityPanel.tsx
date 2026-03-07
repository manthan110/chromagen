import { motion } from "framer-motion";
import { Eye,AlertTriangle, CheckCircle} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";


interface Color {
  name: string;
  hex: string;
  rgb: string;
  hsl?: string;
}

interface AccessibilityPanelProps {
  palette: Color[];
}

function hexToRgb(hex: string): [number, number, number] {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  if (c.length !== 6 || !/^[0-9a-fA-F]{6}$/.test(c)) return [0, 0, 0];
  const num = parseInt(c, 16);
  return [num >> 16 & 0xff, (num >> 8) & 0xff, num & 0xff];
}

function luminance([r, g, b]: [number, number, number]) {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function contrastRatio(rgb1: [number, number, number], rgb2: [number, number, number]) {
  const lum1 = luminance(rgb1);
  const lum2 = luminance(rgb2);
  return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
}

function getWcagLevel(ratio: number) {
  if (ratio >= 7) return { level: 'AAA', status: 'pass' };
  if (ratio >= 4.5) return { level: 'AA', status: 'pass' };
  if (ratio >= 3) return { level: 'A', status: 'warning' };
  return { level: 'Fail', status: 'warning' };
}

export const AccessibilityPanel = ({ palette }: AccessibilityPanelProps) => {


  // Calculate contrast for each palette color vs. white and black backgrounds
  const bgColors = [
    { name: 'White', rgb: [255, 255, 255], hex: '#ffffff' },
    { name: 'Black', rgb: [0, 0, 0], hex: '#000000' },
  ];
  const contrastResults=palette.flatMap((color:Color)=> {
    const rgb = hexToRgb(color.hex);
    return bgColors.map((bg:{ name: string; rgb:[number,number,number]; hex:string }) => {
      const ratio=contrastRatio(rgb, bg.rgb);
      const ratioStr=ratio.toFixed(2)+":1";
      const wcag=getWcagLevel(ratio);

      return {
        combination: `${color.name} on ${bg.name}`,
        ratio: ratioStr,
        level: wcag.level,
        status: wcag.status,
      };
  });
});

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 shadow-elegant">
        <div className="flex items-center gap-2 mb-6">
          <Eye className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">WCAG Accessibility Validator</h2>
        </div>

        <div className="space-y-6">
          {/* WCAG Contrast Checker */}
          <div>
            <h3 className="text-lg font-semibold mb-4">WCAG Contrast Ratios</h3>
            <div className="space-y-3">
              {contrastResults.map((result:any , index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{result.combination}</p>
                    <p className="text-xs text-muted-foreground">Ratio: {result.ratio}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={result.status === "pass" ? "default" : "secondary"}>
                      {result.level}
                    </Badge>
                    {result.status === "pass" ? (
                      <CheckCircle className="h-4 w-4 text-success" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-warning" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};