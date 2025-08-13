import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Calendar, Globe, Tv, Clock, Star } from "lucide-react"
import type { DramaDetail } from "@/lib/api"

interface DramaInfoProps {
  drama: DramaDetail
}

// Helper function to format values with null checks
const formatValue = (value: any): string => {
  if (value === null || value === undefined || value === "" || value === 0) {
    return "N/A"
  }
  return String(value)
}

// Helper function to format array values with null checks
const formatArrayValue = (arr: any[]): string => {
  if (!arr || !Array.isArray(arr) || arr.length === 0) {
    return "N/A"
  }
  return arr.join(", ")
}

// Helper function to format synopsis with null checks
const formatSynopsis = (synopsis: string): string => {
  if (!synopsis || synopsis.trim() === "") {
    return "No synopsis available."
  }
  return synopsis
}

export function DramaInfo({ drama }: DramaInfoProps) {
  return (
    <div className="space-y-6">
      {/* Synopsis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Synopsis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{formatSynopsis(drama.synopsis)}</p>
        </CardContent>
      </Card>

      {/* Drama Details */}
      <Card>
        <CardHeader>
          <CardTitle>Drama Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Tv className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Episodes</p>
                <p className="text-sm text-muted-foreground">{formatValue(drama.episodes)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Aired</p>
                <p className="text-sm text-muted-foreground">{formatValue(drama.aired)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Country</p>
                <p className="text-sm text-muted-foreground">{formatValue(drama.country)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Language</p>
                <p className="text-sm text-muted-foreground">{formatValue(drama.language)}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium mb-2">Network</p>
              <p className="text-sm text-muted-foreground">{formatValue(drama.network)}</p>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Director</p>
              <p className="text-sm text-muted-foreground">{formatArrayValue(drama.director)}</p>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Writer</p>
              <p className="text-sm text-muted-foreground">{formatArrayValue(drama.writer)}</p>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Genres</p>
              <div className="flex flex-wrap gap-2">
                {drama.genres && drama.genres.length > 0 ? (
                  drama.genres.map((genre, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {genre}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">N/A</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
