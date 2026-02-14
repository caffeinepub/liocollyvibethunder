import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Share, Plus, MoreVertical, Download, Store } from 'lucide-react';
import { SiApple, SiAndroid } from 'react-icons/si';

export default function HelpInstallPage() {
  return (
    <div className="container max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Help & Installation</h1>
        <p className="text-muted-foreground">
          Learn how to install LioCollyVibeThunder on your device for the best experience
        </p>
      </div>

      {/* Feature Icons Visual */}
      <Card>
        <CardContent className="pt-6">
          <img
            src="/assets/generated/feature-icons.dim_256x256.png"
            alt="App Features"
            className="w-full max-w-xs mx-auto rounded-lg"
          />
        </CardContent>
      </Card>

      {/* iOS Installation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SiApple className="h-5 w-5" />
            Install on iOS (iPhone/iPad)
          </CardTitle>
          <CardDescription>Using Safari browser</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                1
              </div>
              <div className="flex-1">
                <p className="font-medium">Open Safari</p>
                <p className="text-sm text-muted-foreground">
                  Navigate to LioCollyVibeThunder in Safari browser (not Chrome or other browsers)
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                2
              </div>
              <div className="flex-1">
                <p className="font-medium">Tap the Share button</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  Tap the <Share className="h-3 w-3 inline" /> Share icon at the bottom of the screen
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                3
              </div>
              <div className="flex-1">
                <p className="font-medium">Add to Home Screen</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  Scroll down and tap "Add to Home Screen" <Plus className="h-3 w-3 inline" />
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                4
              </div>
              <div className="flex-1">
                <p className="font-medium">Confirm</p>
                <p className="text-sm text-muted-foreground">
                  Tap "Add" in the top right corner. The app icon will appear on your home screen!
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Android Installation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SiAndroid className="h-5 w-5" />
            Install on Android
          </CardTitle>
          <CardDescription>Using Chrome browser</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                1
              </div>
              <div className="flex-1">
                <p className="font-medium">Open Chrome</p>
                <p className="text-sm text-muted-foreground">
                  Navigate to LioCollyVibeThunder in Chrome browser
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                2
              </div>
              <div className="flex-1">
                <p className="font-medium">Tap the menu</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  Tap the <MoreVertical className="h-3 w-3 inline" /> three-dot menu in the top right
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                3
              </div>
              <div className="flex-1">
                <p className="font-medium">Install app</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  Tap "Install app" or "Add to Home screen" <Download className="h-3 w-3 inline" />
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                4
              </div>
              <div className="flex-1">
                <p className="font-medium">Confirm</p>
                <p className="text-sm text-muted-foreground">
                  Tap "Install" in the popup. The app will be added to your home screen!
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* App Store / Play Store Notice */}
      <Card className="border-accent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            About App Store & Play Store
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            LioCollyVibeThunder is currently available as a <strong>web app</strong> that you can install directly from your browser using the instructions above.
          </p>
          <p className="text-sm text-muted-foreground">
            Publishing to the <Badge variant="outline" className="mx-1">Apple App Store</Badge> or <Badge variant="outline" className="mx-1">Google Play Store</Badge> requires a separate native wrapper and store submission process that is not performed by this web deployment.
          </p>
          <p className="text-sm text-muted-foreground">
            The web app you install from your browser provides the same full functionality and works offline, just like a native app!
          </p>
        </CardContent>
      </Card>

      {/* Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Why Install?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Quick access from your home screen</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Full-screen experience without browser UI</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Works offline after initial load</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Faster loading and better performance</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
