import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Clock, MapPin, Calendar, Globe, Award } from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import type { Tutor } from "@/types/tutor";

type Props = { tutor: Tutor | null; isOpen: boolean; onClose: () => void };

export default function TutorProfileModal({ tutor, isOpen, onClose }: Props) {
  if (!tutor) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Tutor Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start space-x-4">
            <div className="relative">
              <ImageWithFallback src={tutor.image} alt={tutor.name} className="w-24 h-24 rounded-full object-cover" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-900">{tutor.name}</h2>
              <div className="flex items-center space-x-3 mt-2">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="font-medium">{tutor.rating}</span>
                  <span className="text-gray-500">({tutor.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-500">
                  <MapPin className="h-4 w-4" />
                  <span>{tutor.location}</span>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <div className="text-lg font-semibold text-gray-900">{tutor.degreeLevel}</div>
                {tutor.emcApproved && <div className="text-sm text-green-600 font-medium">✓ EMC Approved</div>}
              </div>
            </div>
          </div>

          {/* Subjects */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Subjects</h3>
            <div className="flex flex-wrap gap-2">
              {tutor.subjects.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
            </div>
          </div>

          {/* Course Codes */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Course Codes</h3>
            <div className="flex flex-wrap gap-2">
              {tutor.courseCodes.map((c) => (
                <Badge key={c} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{c}</Badge>
              ))}
            </div>
          </div>

          {/* About */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">About</h3>
            <p className="text-gray-700 leading-relaxed">{tutor.bio}</p>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="font-medium">Experience</div>
                  <div className="text-sm text-gray-600">{tutor.experience}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="font-medium">Availability</div>
                  <div className="text-sm text-gray-600">{tutor.availability}</div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Globe className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="font-medium">Languages</div>
                  <div className="text-sm text-gray-600">{tutor.languages.join(", ")}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Award className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="font-medium">Verified Tutor</div>
                  <div className="text-sm text-gray-600">Background checked</div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4 border-t">
            <Button className="flex-1">Book Session</Button>
            <Button variant="outline" className="flex-1">Send Message</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
