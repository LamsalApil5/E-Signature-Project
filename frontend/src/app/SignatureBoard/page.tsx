"use client"; // Add this line at the top

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useRef, useState, useEffect } from "react";

const SignatureBoard = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [title, setTitle] = useState(""); // State for name input

  // Type guard for distinguishing between MouseEvent and TouchEvent
  const isMouseEvent = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ): e is React.MouseEvent<HTMLCanvasElement> => e.type === "mousedown" || e.type === "mousemove";

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const rect = canvas.getBoundingClientRect();
        let x, y;

        if (isMouseEvent(e)) {
          x = e.clientX - rect.left;
          y = e.clientY - rect.top;
        } else {
          x = e.touches[0].clientX - rect.left;
          y = e.touches[0].clientY - rect.top;
        }

        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);
      }
    }
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const rect = canvas.getBoundingClientRect();
        let x, y;

        if (isMouseEvent(e)) {
          x = e.clientX - rect.left;
          y = e.clientY - rect.top;
        } else {
          x = e.touches[0].clientX - rect.left;
          y = e.touches[0].clientY - rect.top;
        }

        ctx.lineTo(x, y);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  // Adjust canvas size on window resize
  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      }
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas(); // Initial call to set the canvas size

    return () => window.removeEventListener("resize", resizeCanvas); // Clean up on unmount
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Sign Your Document</h1>
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Document Details</CardTitle>
            <CardDescription>Review and sign the document below</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded p-4 min-h-[200px] bg-muted">
              <p className="text-muted-foreground">Document preview would appear here...</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your title"
              />
            </div>
            <div>
              <Label>Your Signature</Label>
              <div className="space-y-2">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={200}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseOut={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  onTouchCancel={stopDrawing}
                  className="border border-input rounded w-full"
                />
                <Button onClick={clearSignature} variant="outline" size="sm">
                  Clear Signature
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Sign and Submit</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignatureBoard;
