"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import ReactMarkdown from 'react-markdown';

export default function BlogPublisherTest() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/blog-publisher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      });
      const blogPost = await response.json();
      if (blogPost.message) {
        setResult(blogPost.message);
        setTopic(""); // Clear the input after successful submission
      } else {
        console.log(blogPost);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <h1 className="text-4xl font-bold mb-6 text-center">✨ Kid&apos;s Blog Generator ✨</h1>
      <p className="text-center mb-8 text-lg">What would you like to learn about today? 🤔</p>
      
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <label htmlFor="topic" className="block text-xl font-medium mb-2">
            Pick a Fun Topic! 🌟
          </label>
          <Input
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Maybe... dinosaurs? space? cookies? 🦕🚀🍪"
            className="w-full text-lg"
          />
        </div>
        <Button 
          type="submit" 
          disabled={loading}
          className="w-full text-xl py-6"
          variant="default"
        >
          {loading ? "Creating Magic... ✨" : "Make My Story! 📖"}
        </Button>
      </form>

      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Your Special Story! 📚</h2>
        <div className="prose prose-lg max-w-none">
          {result ? (
            <ReactMarkdown>{result}</ReactMarkdown>
          ) : (
            <div className="text-center p-8 border-2 border-dashed border-border rounded-base">
              <p className="text-2xl mb-4">🎨 Ready to Create?</p>
              <p>Type a topic and click the button to generate your story!</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
