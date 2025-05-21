"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, Copy, Download, FileText, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"
import type { Generation } from "@/types/generation"
import ReactMarkdown from "react-markdown"

interface GenerationCardProps {
  generation: Generation
}

export function GenerationCard({ generation }: GenerationCardProps) {
  const [expanded, setExpanded] = useState(false)
  const { toast } = useToast()

  const formattedDate = new Date(generation.created_at).toLocaleDateString()
  const timeAgo = formatDistanceToNow(new Date(generation.created_at), { addSuffix: true })

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generation.result)
      toast({
        title: "Copied to clipboard",
        description: "The content has been copied to your clipboard.",
      })
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy content to clipboard.",
        variant: "destructive",
      })
    }
  }

  const downloadAsMarkdown = () => {
    const blob = new Blob([generation.result], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `generation-${generation.id.slice(0, 8)}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadAsPDF = () => {
    toast({
      title: "PDF Export",
      description: "PDF export functionality would be implemented here.",
    })
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden"
    >
      <div className="p-4 border-b border-border flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-text">
            {generation.model}
          </Badge>
          <Badge variant="outline" className="text-text capitalize">
            {generation.format}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-text/70 text-sm">
          <Calendar className="h-3 w-3" />
          <span>{formattedDate}</span>
          <Clock className="h-3 w-3 ml-2" />
          <span>{timeAgo}</span>
        </div>
      </div>

      <div className="p-4 border-b border-border">
        <h3 className="font-medium text-text mb-2">Prompt</h3>
        <p className="text-text/80 text-sm whitespace-pre-wrap">{generation.prompt}</p>
      </div>

      <motion.div layout className={`p-4 ${expanded ? "max-h-none" : "max-h-60 overflow-hidden relative"}`}>
        <h3 className="font-medium text-text mb-2">Result</h3>
        <div className="text-text/90 prose prose-sm dark:prose-invert max-w-none">
          {generation.format === "markdown" ? (
            <ReactMarkdown>{generation.result}</ReactMarkdown>
          ) : (
            <pre className="whitespace-pre-wrap">{generation.result}</pre>
          )}
        </div>

        {!expanded && (
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-surface to-transparent" />
        )}
      </motion.div>

      <div className="p-4 border-t border-border flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => setExpanded(!expanded)}>
          {expanded ? (
            <>
              <Minimize2 className="h-4 w-4 mr-2" />
              Collapse
            </>
          ) : (
            <>
              <Maximize2 className="h-4 w-4 mr-2" />
              Expand
            </>
          )}
        </Button>

        <Button variant="outline" size="sm" onClick={copyToClipboard}>
          <Copy className="h-4 w-4 mr-2" />
          Copy
        </Button>

        <Button variant="outline" size="sm" onClick={downloadAsMarkdown}>
          <FileText className="h-4 w-4 mr-2" />
          Markdown
        </Button>

        <Button variant="outline" size="sm" onClick={downloadAsPDF}>
          <Download className="h-4 w-4 mr-2" />
          PDF
        </Button>
      </div>
    </motion.div>
  )
}
