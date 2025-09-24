"use client";

import {useTransition} from "react";
import {useSearchParams} from "next/navigation";
import Image from "next/image"
import {Download, RotateCcw} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Slider} from "@/components/ui/slider"
import {Switch} from "@/components/ui/switch"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {downloadImage} from "@/lib/picsum-api"
import {useEditorState} from "@/app/edit/editor-hooks";

export function ImageEditor() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [isDownloadPending, startDownloadTransition] = useTransition();
  const [processedImageUrl, imageInfo, settings, updateSettings, resetSettings] = useEditorState(id)

  const handleDownload = () => {
    startDownloadTransition(async () => {
      if (imageInfo) {
        await downloadImage(imageInfo, settings)
      }
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Photo #{imageInfo?.id ?? "-"}</h1>
            <p className="text-muted-foreground">by {imageInfo?.author ?? "-"}</p>
            <p className="text-sm text-muted-foreground">
              Original: {imageInfo?.width ?? 0} × {imageInfo?.height ?? 0}px
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetSettings}
            className="border-border hover:bg-accent bg-transparent"
          >
            <RotateCcw className="h-4 w-4 mr-2"/>
            Reset
          </Button>
          <Button size="sm" onClick={handleDownload} className="bg-primary hover:bg-primary/90" disabled={isDownloadPending}>
            <Download className="h-4 w-4 mr-2"/>
            Download
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls Panel */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Image Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Size Controls */}
              <div className="space-y-4">
                <Label className="text-sm font-medium text-foreground">Dimensions</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="width" className="text-xs text-muted-foreground">
                      Width
                    </Label>
                    <Input
                      id="width"
                      type="number"
                      value={settings.width}
                      onChange={(e) => updateSettings({width: Number.parseInt(e.target.value) || 0})}
                      min="100"
                      max="2000"
                      className="bg-input border-border text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height" className="text-xs text-muted-foreground">
                      Height
                    </Label>
                    <Input
                      id="height"
                      type="number"
                      value={settings.height}
                      onChange={(e) => updateSettings({height: Number.parseInt(e.target.value) || 0})}
                      min="100"
                      max="2000"
                      className="bg-input border-border text-foreground"
                    />
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Aspect ratio: {(settings.width / settings.height).toFixed(2)}:1
                </div>
              </div>

              {/* Grayscale Toggle */}
              <div className="flex items-center justify-between">
                <Label htmlFor="grayscale" className="text-sm font-medium text-foreground">
                  Grayscale Mode
                </Label>
                <Switch
                  id="grayscale"
                  className="cursor-pointer"
                  checked={settings.grayscale}
                  onCheckedChange={(checked) => updateSettings({grayscale: checked})}
                />
              </div>

              {/* Blur Control */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-foreground">Blur</Label>
                  <span className="text-xs text-muted-foreground">{settings.blur}/10</span>
                </div>
                <Slider
                  value={[settings.blur]}
                  onValueChange={(value) => updateSettings({blur: value[0]})}
                  max={10}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative bg-muted rounded-lg p-4 min-h-[400px] flex items-center justify-center">
                {imageInfo && processedImageUrl && (
                  <Image
                    src={processedImageUrl}
                    alt={`Photo by ${imageInfo.author}`}
                    loading="eager"
                    width={settings.width}
                    height={settings.height}
                    className="max-w-full max-h-[600px] object-contain rounded shadow-lg"
                    unoptimized
                  />
                )}
              </div>
              <div className="mt-4 text-sm text-muted-foreground text-center">
                Current size: {settings.width} × {settings.height}px
                {settings.grayscale && " • Grayscale"}
                {settings.blur > 0 && ` • Blur: ${settings.blur}px`}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
