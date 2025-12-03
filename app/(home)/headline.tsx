"use client";
import { cn } from "@/components/utils";
import { Card } from "fumadocs-ui/components/card";
import Link from "fumadocs-core/link";

import React, { useRef, useEffect } from "react";

interface NoiseProps {
  patternSize?: number;
  patternScaleX?: number;
  patternScaleY?: number;
  patternRefreshInterval?: number;
  patternAlpha?: number;
}

const Noise: React.FC<NoiseProps> = ({
  patternSize = 250,
  patternScaleX = 1,
  patternScaleY = 1,
  patternRefreshInterval = 2,
  patternAlpha = 15,
}) => {
  const grainRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = grainRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let frame = 0;
    let animationId: number;

    const canvasSize = 1024;

    const resize = () => {
      if (!canvas) return;
      canvas.width = canvasSize;
      canvas.height = canvasSize;

      canvas.style.width = "100vw";
      canvas.style.height = "100vh";
    };

    const drawGrain = () => {
      const imageData = ctx.createImageData(canvasSize, canvasSize);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255;
        data[i] = value;
        data[i + 1] = value;
        data[i + 2] = value;
        data[i + 3] = patternAlpha;
      }

      ctx.putImageData(imageData, 0, 0);
    };

    const loop = () => {
      if (frame % patternRefreshInterval === 0) {
        drawGrain();
      }
      frame++;
      animationId = window.requestAnimationFrame(loop);
    };

    window.addEventListener("resize", resize);
    resize();
    loop();

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(animationId);
    };
  }, [
    patternSize,
    patternScaleX,
    patternScaleY,
    patternRefreshInterval,
    patternAlpha,
  ]);

  return (
    <canvas
      className="pointer-events-none absolute top-0 left-0 h-screen w-screen"
      ref={grainRef}
      style={{
        imageRendering: "pixelated",
      }}
    />
  );
};

export const Headline = () => {
  const tagline =
    "Bamboost is a Python library built for datamanagement using the HDF5 file format. bamboost stands for a lightweight shelf which will boost your efficiency and which will totally break if you load it heavily. Just kidding, bamboo can fully carry pandas.";

  return (
    <div className="flex gap-12 flex-col justify-center text-center transition-all duration-500 ease-in-out relative overflow-hidden md:rounded-3xl py-10">
      <div className={cn("transition-all duration-500 ease-in-out")}>
        <Noise
          patternSize={250}
          patternScaleX={1}
          patternScaleY={1}
          patternRefreshInterval={4}
          patternAlpha={15}
        />
        <h1 className="mb-4 text-2xl font-bold">
          Get a grip on your data
          <br /> with bamboost
        </h1>
        <p className="text-muted-foreground">
          You may click here{" "}
          <Link
            href="/docs"
            className="text-route-docs font-semibold underline"
          >
            /docs
          </Link>{" "}
          for the documentation.
        </p>
        <p className="text-muted-foreground">
          Or here{" "}
          <Link
            href="/apidocs"
            className="text-route-api font-semibold underline"
          >
            /apidocs
          </Link>{" "}
          for the API reference.
        </p>
      </div>
      <div className="mx-4 md:mx-auto">
        <div
          className={cn(
            "container max-w-2xl p-px relative bg-linear-to-br from-primary to-primary via-transparent",
            "transition-all duration-500 ease-in-out",
            "before:content-[''] before:-z-10 before:absolute before:inset-0 before:bg-linear-to-br before:from-route-docs before:to-route-docs before:via-transparent before:blur-lg",
            "brightness-90 hover:brightness-100 cursor-pointer rounded-xl",
          )}
        >
          <Card
            title="What is bamboost?"
            className={cn(
              "border-none",
              "w-full border z-10 bg-opacity-100",
              "bg-background hover:bg-background", // Add this to ensure the card background doesn't spin
            )}
            href="/docs"
          >
            {tagline}
          </Card>
        </div>
      </div>
    </div>
  );
};
