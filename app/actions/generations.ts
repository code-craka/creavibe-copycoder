"use server"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"
import type { Database } from "@/types/supabase"
import type { Generation, GenerationRequest, GenerationResponse, GenerationsResponse } from "@/types/generation"

// Function to generate content using OpenAI
export async function generateContent(request: GenerationRequest): Promise<GenerationResponse> {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    })

    // Get user to ensure they're authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("User not authenticated")
    }

    // Create a pending generation record
    const generationId = uuidv4()
    const startTime = Date.now()

    const pendingGeneration: Generation = {
      id: generationId,
      project_id: request.projectId,
      user_id: user.id,
      prompt: request.prompt,
      result: "Generating...",
      created_at: new Date().toISOString(),
      model: request.model || "gpt-4",
      format: request.format || "markdown",
      status: "pending",
    }

    // Insert the pending generation
    const { error: insertError } = await supabase.from("generations").insert(pendingGeneration as any)

    if (insertError) {
      throw insertError
    }

    // Simulate OpenAI API call (replace with actual OpenAI API call in production)
    // This is a placeholder for the actual OpenAI integration
    const result = await simulateOpenAIResponse(request.prompt)
    const endTime = Date.now()

    // Update the generation with the result
    const updatedGeneration: Partial<Generation> = {
      result,
      status: "completed",
      metadata: {
        tokens: {
          prompt: request.prompt.length / 4, // Rough estimate
          completion: result.length / 4, // Rough estimate
          total: (request.prompt.length + result.length) / 4, // Rough estimate
        },
        duration: endTime - startTime,
      },
    }

    const { error: updateError } = await supabase
      .from("generations")
      .update(updatedGeneration as any)
      .eq("id", generationId)

    if (updateError) {
      throw updateError
    }

    // Fetch the complete generation
    const { data, error } = await supabase.from("generations").select("*").eq("id", generationId).single()

    if (error) {
      throw error
    }

    return { data: data as Generation, error: null }
  } catch (error) {
    console.error("Error generating content:", error)
    return { data: null, error: error as Error }
  }
}

// Function to get generations for a project
export async function getGenerations(projectId: string): Promise<GenerationsResponse> {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    })

    // Get user to ensure they're authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("User not authenticated")
    }

    // Fetch generations for the project
    const { data, error } = await supabase
      .from("generations")
      .select("*")
      .eq("project_id", projectId)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      throw error
    }

    return { data: data as Generation[], error: null }
  } catch (error) {
    console.error("Error fetching generations:", error)
    return { data: null, error: error as Error }
  }
}

// Helper function to simulate OpenAI response (replace with actual OpenAI API call)
async function simulateOpenAIResponse(prompt: string): Promise<string> {
  // Simulate processing time
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Generate a response based on the prompt
  const responses: Record<string, string> = {
    design: `# Design Concept

## Overview
Based on your prompt, here's a modern design concept that emphasizes clean lines and user-friendly interfaces.

## Key Elements
1. **Color Palette**
   - Primary: #3A86FF
   - Secondary: #FF006E
   - Neutral: #8D99AE
   - Background: #F8F9FA

2. **Typography**
   - Headings: Montserrat, bold
   - Body: Inter, regular
   - Accents: Playfair Display, italic

3. **Layout**
   - Grid-based structure
   - Responsive breakpoints at 480px, 768px, 1024px, and 1440px
   - Consistent spacing using 8px increments

## Implementation Notes
- Use CSS variables for theming
- Implement dark mode toggle
- Ensure WCAG AA compliance for accessibility

## Next Steps
1. Create wireframes
2. Develop component library
3. Build prototype
4. Conduct user testing`,

    marketing: `# Marketing Strategy

## Target Audience
- Primary: Tech-savvy professionals, 25-45
- Secondary: Small business owners looking to expand digital presence

## Channel Strategy
1. **Content Marketing**
   - Blog posts (2x weekly)
   - Guest articles on industry publications
   - Downloadable resources (guides, templates)

2. **Social Media**
   - LinkedIn: Industry insights and company updates
   - Twitter: Trend commentary and customer engagement
   - Instagram: Behind-the-scenes and culture content

3. **Email Marketing**
   - Welcome sequence (5 emails)
   - Weekly newsletter
   - Segmented product announcements

## Campaign Ideas
1. "Future of Work" webinar series
2. Case study showcase with key clients
3. Early access program for new features

## KPIs
- Email open rate > 25%
- Social engagement growth of 15% QoQ
- Content conversion rate > 3%
- CAC < $100`,

    code: `# React Component Library

\`\`\`tsx
// Button.tsx
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'underline-offset-4 hover:underline text-primary',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? 'div' : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
\`\`\`

## Usage Example

\`\`\`tsx
import { Button } from '@/components/ui/button';

export default function App() {
  return (
    <div className="space-x-4">
      <Button>Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  );
}
\`\`\``,

    content: `# The Future of AI in Creative Industries

## Introduction

Artificial intelligence is rapidly transforming creative industries, from graphic design to music production. This evolution isn't about replacing human creativity but augmenting it in ways previously unimaginable.

## Current Applications

### Design
AI tools now generate initial concepts, variations, and even complete designs based on text prompts. Designers are becoming curators and directors, focusing on refinement rather than starting from scratch.

### Writing
Natural language processing has advanced to create coherent, contextually relevant content. Writers use AI to overcome blocks, generate outlines, and explore alternative phrasings.

### Music
AI algorithms analyze patterns in music to generate compositions in specific styles or to suggest chord progressions and melodies that complement existing work.

### Film and Animation
From script analysis to character animation, AI streamlines production workflows while opening new creative possibilities through procedural generation.

## Ethical Considerations

As AI becomes more integrated into creative workflows, questions arise:
- Who owns AI-generated content?
- How do we attribute creative work?
- What happens to traditional creative roles?
- How do we preserve the human element in creative expression?

## The Future Landscape

The most successful creatives will be those who embrace AI as a collaborative tool rather than viewing it as competition. The future isn't AI or human creativity—it's AI and human creativity working in concert.

## Conclusion

AI in creative industries represents not an endpoint but a new beginning. The tools will continue to evolve, but the uniquely human qualities of creativity—emotion, cultural context, lived experience—will remain irreplaceable.`,
  }

  // Find a response that matches keywords in the prompt, or use a default
  const matchingKey =
    Object.keys(responses).find((key) => prompt.toLowerCase().includes(key.toLowerCase())) || "content"

  return responses[matchingKey]
}
