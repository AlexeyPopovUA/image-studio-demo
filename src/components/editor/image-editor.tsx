"use client";

import {ChangeEvent, useCallback, useId, useTransition} from "react";
import {useSearchParams} from "next/navigation";
import Image from "next/image"
import Link from "next/link"
import {ArrowLeft, Download, ImageOff, Loader2, RotateCcw} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Slider} from "@/components/ui/slider"
import {Switch} from "@/components/ui/switch"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {downloadImage} from "@/lib/picsum-api"
import {useEditorState} from "@/components/editor/editor-hooks";

export function ImageEditor() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [isDownloadPending, startDownloadTransition] = useTransition();
  // Preview dimensions are derived to keep network usage low while honoring configured aspect ratio.
  const [processedImageUrl, imageInfo, settings, updateSettings, resetSettings, imageStatus, previewDimensions] = useEditorState(id)

  const blurLabelId = useId();
  const blurDescriptionId = useId();
  const previewTitleId = useId();

  const blurLevelDescription = settings.blur === 0
    ? "Blur off"
    : `Blur level ${settings.blur} of 10`;

  const isReady = imageStatus === "ready"
  const isMissing = imageStatus === "missing"
  const isLoading = imageStatus === "loading"
  const prevPageParam = searchParams.get('prevPage')
  const backHref = prevPageParam && prevPageParam.startsWith('/') ? prevPageParam : '/'
  const widthInputMax = imageInfo ? imageInfo.width : 1200
  const heightInputMax = imageInfo ? imageInfo.height : 1200

  const handleDownload = () => {
    startDownloadTransition(async () => {
      if (imageInfo) {
        await downloadImage(imageInfo, settings)
      }
    })
  }

  const handleWidthChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const parsedValue = Number.parseInt(event.target.value, 10) || 0
    updateSettings({width: Math.max(1, parsedValue)})
  }, [updateSettings])

  const handleHeightChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const parsedValue = Number.parseInt(event.target.value, 10) || 0
    updateSettings({height: Math.max(1, parsedValue)})
  }, [updateSettings])

  const handleGrayscaleChange = useCallback((checked: boolean) => {
    updateSettings({grayscale: checked})
  }, [updateSettings])

  const handleBlurChange = useCallback((value: number[]) => {
    updateSettings({blur: value[0] ?? 0})
  }, [updateSettings])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-4">
          <Button variant="ghost" size="sm" asChild className="w-full justify-start md:w-auto md:justify-center">
            <Link href={backHref} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" aria-hidden="true"/>
              Back
            </Link>
          </Button>
          <div role={isMissing ? "alert" : isLoading ? "status" : undefined}>
            {isMissing ? (
              <>
                <h1 className="text-2xl font-bold text-foreground">Could not load the image</h1>
                <p className="text-muted-foreground text-sm max-w-md">
                  The requested photo may be unavailable or the link is invalid. Choose another image to continue editing.
                </p>
              </>
            ) : isLoading ? (
              <>
                <h1 className="text-2xl font-bold text-foreground">Loading image…</h1>
                <p className="text-muted-foreground text-sm">Fetching photo details from Picsum.</p>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-foreground">Photo #{imageInfo?.id ?? "-"}</h1>
                <p className="text-muted-foreground">by {imageInfo?.author ?? "-"}</p>
                <p className="text-sm text-muted-foreground">
                  Original: {imageInfo?.width ?? 0} × {imageInfo?.height ?? 0}px
                </p>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch md:items-center sm:justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={resetSettings}
            className="border-border hover:bg-accent bg-transparent cursor-pointer w-full sm:w-auto"
            disabled={!isReady}
          >
            <RotateCcw className="h-4 w-4 mr-2" aria-hidden="true"/>
            Reset
          </Button>
          <Button
            size="sm"
            onClick={handleDownload}
            className="bg-primary hover:bg-primary/90 cursor-pointer w-full sm:w-auto"
            disabled={!isReady || isDownloadPending}
          >
            <Download className="h-4 w-4 mr-2" aria-hidden="true"/>
            Download
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
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
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="width" className="text-xs text-muted-foreground">
                      Width
                    </Label>
                    <Input
                      id="width"
                      type="number"
                      value={settings.width}
                      onChange={handleWidthChange}
                      min="1"
                      max={widthInputMax}
                      className="bg-input border-border text-foreground"
                      disabled={!isReady}
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
                      onChange={handleHeightChange}
                      min="1"
                      max={heightInputMax}
                      className="bg-input border-border text-foreground"
                      disabled={!isReady}
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
                  onCheckedChange={handleGrayscaleChange}
                  disabled={!isReady}
                />
              </div>

              {/* Blur Control */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label id={blurLabelId} className="text-sm font-medium text-foreground">Blur</Label>
                  <span
                    className="text-xs text-muted-foreground"
                    id={blurDescriptionId}
                  >
                    {blurLevelDescription}
                  </span>
                </div>
                <Slider
                  aria-labelledby={blurLabelId}
                  aria-describedby={blurDescriptionId}
                  aria-valuetext={blurLevelDescription}
                  value={[settings.blur]}
                  onValueChange={handleBlurChange}
                  max={10}
                  min={0}
                  step={1}
                  className="w-full"
                  disabled={!isReady}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle id={previewTitleId} className="text-foreground flex items-center gap-2">
                Quick Preview <span className="text-sm font-normal">(light version {previewDimensions.width}x{previewDimensions.height})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="relative bg-muted rounded-lg p-4 min-h-[280px] flex items-center justify-center md:min-h-[400px] md:p-6"
                role="region"
                aria-labelledby={previewTitleId}
              >
                {isReady && imageInfo && processedImageUrl ? (
                  <Image
                    src={processedImageUrl}
                    alt={`Photo by ${imageInfo.author}`}
                    loading="eager"
                    width={previewDimensions.width}
                    height={previewDimensions.height}
                    className="max-w-full max-h-[600px] object-contain rounded shadow-lg"
                    unoptimized
                  />
                ) : (
                  <div className="flex flex-col items-center text-center gap-3 text-muted-foreground">
                    {isMissing ? (
                      <ImageOff className="h-12 w-12" aria-hidden="true"/>
                    ) : (
                      <Loader2 className="h-10 w-10 animate-spin" aria-hidden="true"/>
                    )}
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">
                        {isMissing ? "Could not load the image" : "Loading image"}
                      </p>
                      <p className="text-xs text-muted-foreground max-w-xs">
                        {isMissing ? "The image may have been removed or the ID is invalid." : "Please wait while we fetch the image details."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              {isReady && (
                <div className="mt-4 text-sm text-muted-foreground text-center">
                  Current size: {settings.width} × {settings.height}px
                  {settings.grayscale && " • Grayscale"}
                  {settings.blur > 0 && ` • Blur level ${settings.blur}`}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
