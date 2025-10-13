export interface Tutor {
  id: string;
  name: string;
  image: string;
  subjects: string[];
  courseCodes: string[];
  emcApproved: boolean;
  degreeLevel: string;
  rating: number;
  reviewCount: number;
  bio: string;
  experience: string;
  availability: string;
  location: string;
  languages: string[];
}
