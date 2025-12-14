import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Props {
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  isStudent: boolean;
  isTutor: boolean;
}

export function ProfileHeader({ firstName, lastName, email, avatar, isStudent, isTutor }: Props) {
  return (
    <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <Avatar className="w-24 h-24 border-4 border-white shadow-md">
        <AvatarImage src={avatar} alt={`${firstName} ${lastName}`} />
        <AvatarFallback>{firstName[0]}{lastName[0]}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1 text-center md:text-left space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">{firstName} {lastName}</h2>
        <p className="text-muted-foreground">{email}</p>
        <div className="flex gap-2 justify-center md:justify-start">
          {isStudent && <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">Student</Badge>}
          {isTutor && <Badge variant="secondary" className="bg-purple-50 text-purple-700 hover:bg-purple-100">Tutor</Badge>}
        </div>
      </div>
    </div>
  );
}