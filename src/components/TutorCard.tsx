import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Clock, MapPin } from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import type { Tutor } from "@/types/tutor";

type Props = { tutor: Tutor; onViewProfile: (t: Tutor) => void };

export default function TutorCard({ tutor, onViewProfile }: Props) {
  return (
    <Card className="h-full hover:shadow-xl transition-all duration-200 cursor-pointer group bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90">
      <CardHeader className="pb-3">
        <div className="flex items-start space-x-3">
          <div className="relative">
            <ImageWithFallback
              src={tutor.image}
              alt={tutor.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{tutor.name}</h3>
            <div className="flex items-center space-x-1 mt-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">{tutor.rating}</span>
              <span className="text-sm text-muted-foreground">({tutor.reviewCount})</span>
            </div>
            <div className="flex items-center space-x-1 mt-1">
              <MapPin className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{tutor.location}</span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm font-medium text-foreground">{tutor.degreeLevel}</div>
            {tutor.emcApproved && (
              <div className="text-xs text-green-600 font-medium">EMC Approved</div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1">
              {tutor.subjects.slice(0, 2).map((s) => (
                <Badge key={s} variant="secondary" className="text-xs">
                  {s}
                </Badge>
              ))}
              {tutor.subjects.length > 2 && (
                <Badge variant="outline" className="text-xs">+{tutor.subjects.length - 2} more</Badge>
              )}
            </div>
            <div className="flex flex-wrap gap-1">
              {tutor.courseCodes.slice(0, 3).map((c) => (
                <Badge key={c} variant="outline" className="text-xs bg-accent/30 text-accent-foreground border-accent-foreground/20">
                  {c}
                </Badge>
              ))}
              {tutor.courseCodes.length > 3 && (
                <Badge variant="outline" className="text-xs">+{tutor.courseCodes.length - 3} more</Badge>
              )}
            </div>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">{tutor.bio}</p>

          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{tutor.experience}</span>
            </div>
            <div>{tutor.availability}</div>
          </div>

          <div className="pt-2">
            <Button onClick={() => onViewProfile(tutor)} className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" variant="outline">
              View Profile
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
